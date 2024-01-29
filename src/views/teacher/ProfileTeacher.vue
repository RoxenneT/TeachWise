<script>
import axios from 'axios';
import Loading from '../Loading.vue'
export default {
    components: {
        Loading,
    },
    data() {
        return {
            // serverHost: 'http://127.0.0.1:7000',
            serverHost: 'http://172.28.0.242:7000',
            error: '',
            submitError: '',
            selectedFileName: '',
            isSuccess: false,
            type: '',
            teacher: {
                id: 1,
                photo: '',
                surname: '',
                name: '',
                email: '',
                password: '',
                subject: '',
                about: '',

            }
        };
    },
    created() {
        this.fetchUserProfile();
    },
    methods: {
        fetchUserProfile() {
            axios.get(`${this.serverHost}/api/user/profile`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })
                .then(response => {
                    let data = response.data;
                    console.log(data);
                    this.teacher.id = data["user_id"];
                    this.teacher.surname = data["first_name"];
                    this.teacher.name = data["last_name"];
                    this.teacher.email = data["email"];
                    this.teacher.password = data["password"];
                    this.teacher.photo = `${this.serverHost}${data["image"]}`;
                    this.teacher.subject = data["subject"];
                    this.teacher.about = data["description"];
                    this.type = data["type"];
                })
                .catch(error => {
                    if (error["response"]["status"] !== 500) {
                        this.error = error["response"]["data"]["error"];
                        setTimeout(() => {
                            this.error = '';
                        }, 5000);
                    }
                })
        },
        changePhoto(event) {
            const file = event.target.files[0];
            if (file) {
                this.convertImageToDataUrl(file);
                this.selectedFileName = file.name;
                console.log("Выбран файл:", file);
            }
        },
        convertImageToDataUrl(imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.teacher.photo = e.target.result;
            };
            reader.readAsDataURL(imageFile);
        },
        submitForm() {
            const formData = new FormData();

            formData.append('first_name', this.teacher.name);
            formData.append('last_name', this.teacher.surname);
            formData.append('email', this.teacher.email);
            formData.append('description', this.teacher.about);
            formData.append('password', this.teacher.password);
            formData.append('subject', this.teacher.subject);

            const fileInput = document.getElementById('fileInput');
            if (fileInput.files.length > 0) {
                formData.append('img', fileInput.files[0]);
            }
            axios.put(`${this.serverHost}/api/user`, formData, {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then(response => {
                    let data = response.data;
                    console.log(data);
                    this.isSuccess = true
                })
                .catch(error => {
                    if (error.response && error.response.status !== 500) {
                        this.submitError = error.response.data.error;
                        setTimeout(() => {
                            this.submitError = '';
                        }, 5000);
                    }
                })
        },
        logout() {
            this.$store.commit('logout');
            localStorage.removeItem('token');
            this.$router.push('/');
        }
    },
};
</script>

<template>
    <div class="dashboardContainer">
        <div class="profilePhoto">
            <h3>Настройка профиля:</h3>
            <img v-if="teacher.photo !== 'http://172.28.0.242:7000null'" :src=teacher.photo alt="Фотография пользователя">
            <img v-if="teacher.photo === 'http://172.28.0.242:7000null'" src="/images/profile.jpg"
                alt="Фотография пользователя">
            <label class="custom-file-input-label" for="fileInput">Выберите файл</label>
            <input id="fileInput" style="display: none;" type="file" @change="changePhoto" accept="image/*" />
        </div>

        <form @submit.prevent="submitForm">
            <div style="display: flex; flex-direction: column; gap: 15px; height: 222.6px;">
                <label for="name">Имя:</label>
                <input id="name" type="text" v-model="teacher.name">

                <label for="surname">Фамилия:</label>
                <input id="surname" type="text" v-model="teacher.surname">

                <label for="subject">Преподаватель: (предмет)</label>
                <input id="subject" type="text" v-model="teacher.subject">
            </div>

            <div style="display: flex; flex-direction: column; gap: 15px; height: 222.6px;">
                <label for="email">E-mail</label>
                <input id="email" type="text" v-model="teacher.email">

                <label for="password">Пароль:</label>
                <input id="password" type="text" v-model="teacher.password">

            </div>

            <div style="display: flex; flex-direction: column; gap: 15px; margin-top: 20px;">
                <label for="about">Немного о себе:</label>
                <textarea id="about" type="text" v-model="teacher.about" maxlength="120"></textarea>

                <div style="display: flex; justify-content: center; align-items: center; gap: 20px;">
                    <button type="submit">Сохранить</button>
                    <button type="button" @click="logout">Выйти</button>
                </div>

            </div>
        </form>
        <div class="errorCatcher" v-if="error">{{ error }}</div>
        <div class="great" v-if="isSuccess">Данные сохранены!</div>
    </div>
</template >

<style scoped>
.dashboardContainer {
    width: 98%;
    min-height: 95vh;
    max-height: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.hide {
    z-index: -1;
}

.profilePhoto {
    width: 38%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
}

img {
    width: 250px;
    height: 250px;
    border-radius: 10px;
}

input {
    width: 250px;
    height: 30px;
    color: black;
    font-size: 15px;
    font-weight: bold;
    padding-left: 10px;
    border-radius: 5px;
    border: 1px solid rgb(29, 88, 62);
    outline: none;
}

input::placeholder {
    color: black;
    font-size: 15px;
}

form {
    width: 60%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
}

textarea {
    width: 518px;
    height: 100px;
    font-size: 15px;
    font-weight: bold;
}

.custom-file-input-label,
button {
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

@media (max-width: 1317px) {
    .dashboardContainer {
        flex-direction: column;
        gap: 30px;
    }

    .profilePhoto {
        width: 100%;
    }

    form {
        width: 100%;
        margin-bottom: 20px;
    }

    .errorCatcher,
    .great {
        left: 93%;
        background-color: rgb(243, 243, 243);
    }

    .errorCatcher {
        color: red;
    }

    .great {
        color: rgb(32, 141, 32);
    }

    @keyframes slidein {
        0% {
            top: 60%;
        }

        50% {
            top: 90%;
        }

        70% {
            top: 90%;
        }

        80% {
            top: 90%;
        }

        100% {
            top: 90%;
        }
    }
}
</style>