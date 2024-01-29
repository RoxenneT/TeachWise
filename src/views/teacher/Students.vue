<script>
import axios from 'axios';
import Loading from '../Loading.vue'
export default {
    components: {
        Loading,
    },
    data() {
        return {
            serverHost: 'http://172.28.0.242:7000',
            popupVisible: false,
            selectedFileName: null,
            selectedStudent: null,
            searchQuery: '',
            studentsList: [],
            fileName: '',
            theme: '',
            response: [],
            isSuccess: false,
            loading: false,
        }
    },
    created() {
        this.loading = true;
        axios.get(`${this.serverHost}/api/student`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(response => {
                this.studentsList = response.data;
                console.log('I HERE', this.studentsList);
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                this.loading = false;
            });
    },
    computed: {
        filteredStudents() {
            const query = this.searchQuery.toLowerCase();
            return this.studentsList.filter(student => {
                const fullName = `${student.last_name} ${student.first_name}`.toLowerCase();
                return fullName.includes(query);
            });
        },
    },
    methods: {
        showPopup(student) {
            this.popupVisible = true;
            this.selectedStudent = student;
            console.log(this.selectedStudent);

        },
        closePopup() {
            this.popupVisible = false;
        },
        handleFileUpload(event) {
            const input = event.target;
            const fileName = input.files.length > 0 ? input.files[0].name : null;
            this.selectedFileName = fileName;
        },
        uploadFile() {
            let formData = new FormData();

            formData.append('student_id', this.selectedStudent.student_id);
            formData.append('description', this.theme);

            const fileInput = document.getElementById('fileInput');
            console.log('File here, ', fileInput);
            if (fileInput.files.length > 0) {
                formData.append('homework', fileInput.files[0]);
                console.log(fileInput.files[0]);
            }

            for (var key of formData.entries()) {
                console.log(key[0] + ', ' + key[1]);
            }
            axios.post(`${this.serverHost}/api/homework`, formData, {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then(response => {
                    console.log('I AM RESPONSE', response.data);
                    this.response = response.data
                    console.log('MEGA', this.response);
                    this.isSuccess = true
                })
                .catch(error => {
                    console.error(error);
                    if (error["response"]["status"] !== 500) {
                        this.error = error["response"]["data"]["error"];
                        setTimeout(() => {
                            this.error = '';
                        }, 5000);
                    }
                })
            this.selectedFileName = '';
            this.theme = '';
        },
        getImageUrl(imagePath) {
            return `${this.serverHost}${imagePath}`;
        },
    },
}
</script>

<template>
    <div class="studentContainer">
        <loading v-if="loading"></loading>
        <div class="search" :class="{ 'overlay': popupVisible, 'hide': loading }">
            <input type="search" v-model="searchQuery" placeholder="Найти студента">
        </div>
        <div class="cards" v-if="studentsList" :class="{ 'overlay': popupVisible, 'hide': loading }">
            <div class="studentsCards" v-for="student in filteredStudents" :key="student.student_id">
                <img v-if="student.image" :src="getImageUrl(student.image)" alt="Student Photo">
                <img v-if="!student.image" src="/images/profile.jpg" alt="Student Photo">
                <div class="infoHolder">
                    <h3>
                        {{ student.first_name }}
                        {{ student.last_name }}
                    </h3>
                    <a @click="showPopup(student)">
                        Назначить домашнее задание
                    </a>
                </div>
            </div>
        </div>
        <div v-if="popupVisible" class="popup" :class="{ 'hide': loading }">
            <div style="width: 100%; display: flex; justify-content: flex-end; align-items: center;">
                <button @click="closePopup" style="color: red; background-color: white; border: none;">✖</button>
            </div>
            <span style="display: flex; flex-direction: column; align-items: center;">
                Выбранный студент:
                <h3>
                    {{ selectedStudent.last_name }}
                    {{ selectedStudent.first_name }}
                </h3>
            </span>
            <label for="theme">Тема урока</label>
            <input class="theme" type="text" v-model="theme" required>
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
                <label class="custom-file-input-label" for="fileInput">Выберите файл</label>
                <input id="fileInput" style="display: none;" type="file" @change="handleFileUpload" required />
                <span style="text-align: center; max-width: 380px;">
                    {{ selectedFileName }}
                </span>
            </div>
            <button class="btn" @click="uploadFile">Загрузить</button>
        </div>
        <div v-if="studentsList.length === 0"
            style="display: flex; justify-content: center; align-items: center; text-align: center; width: 400px; height: 400px; font-size: 20px; color: rgb(233, 163, 35); font-weight: bold;">
            У Вас пока нет студентов, <br> пригласите их на платформу TeachWise <br> и начните преподавать "мудро".</div>
        <div class="errorCatcher" v-if="error">{{ error }}</div>
        <div class="great" v-if="isSuccess">Файл успешно отправлен!</div>
    </div>
</template>

<style scoped>
.studentContainer {
    width: 98%;
    min-height: 95vh;
    max-height: fit-content;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 30px;
}

.hide {
    z-index: -1;
}

.cards {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
}

.studentsCards {
    width: 520px;
    height: 205px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
    border-radius: 0 0 10px 0;
    border-bottom: 2px solid rgb(8, 114, 72);
    border-right: 2px solid rgb(8, 114, 72);
    -webkit-box-shadow: 8px 8px 7px -5px rgba(34, 60, 80, 0.42);
    -moz-box-shadow: 8px 8px 7px -5px rgba(34, 60, 80, 0.42);
    box-shadow: 8px 8px 7px -5px rgba(34, 60, 80, 0.42);
}

.infoHolder {
    display: flex;
    flex-direction: column;
    gap: 10px;

}

img {
    width: 200px;
    height: 200px;
    border-radius: 10px;
}

.search {
    width: 93%;
    display: flex;
    gap: 20px;
    justify-content: flex-start;
    align-items: center;
}

input {
    width: 250px;
    height: 30px;
    color: black;
    font-size: 15px;
    font-weight: bold;
    padding-left: 10px;
    border-radius: 5px;
    border: 1px solid rgb(27, 82, 57);
    outline: none;
}

input::placeholder {
    color: black;
    font-size: 15px;
}

h3 {
    color: rgb(255, 185, 56);
}

.popup {
    width: 400px;
    min-height: 400px;
    max-height: 800px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.errorCatcher {
    background-color: rgba(201, 89, 89, 0.559);
}

.great {
    background-color: rgba(89, 201, 93, 0.559);
}

.errorCatcher,
.great {
    min-width: 300px;
    max-width: 400px;
    min-height: 150px;
    max-height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    position: absolute;
    top: -20%;
    left: 80%;
    transform: translate(-50%, -50%);
    padding: 20px;
    border: 1px solid #ccc;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.422);
    border-radius: 15px;
    animation: 5s ease slidein;
    font-size: 18px;
    font-weight: bold;
    color: black;
    text-align: center;
}

@keyframes slidein {
    0% {
        top: 20%;
    }

    50% {
        top: 30%;
    }

    70% {
        top: 30%;
    }

    80% {
        top: 30%;
    }

    100% {
        top: 30%;
    }
}

.custom-file-input-label,
.btn {
    width: 150px;
    height: 30px;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    background-color: #3498db;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.custom-file-input-label:hover,
.custom-file-input-label:focus,
.btn:hover,
.btn:focus {
    background-color: #2980b9;
}

.overlay {
    opacity: 0.5;
}

@media (max-width: 1317px) {

    .errorCatcher,
    .great {
        left: 90%;
        top: -20%;
    }

    @keyframes slidein {
        0% {
            top: 40%;
        }

        50% {
            top: 65%;
        }

        70% {
            top: 65%;
        }

        80% {
            top: 65%;
        }

        100% {
            top: 65%;
        }
    }

    .popup {
        width: 400px;
        min-height: 400px;
        max-height: 800px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;
        position: fixed;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        background-color: #fff;
        border: 1px solid #ccc;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
}
</style>