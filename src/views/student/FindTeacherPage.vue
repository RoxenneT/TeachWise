<script>
import Calendar from './Calendar.vue';
import Loading from '../Loading.vue'
import axios from 'axios';
export default {
    components: {
        Calendar,
        Loading,
    },
    data() {
        return {
            serverHost: 'http://172.28.0.242:7000',
            popupVisible: false,
            isNotActive: false,
            selectedTeacher: null,
            searchQuery: '',
            teachersList: [],
            loading: false,
        }
    },
    created() {
        this.loading = true;
        axios.get(`${this.serverHost}/api/teacher`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(response => {
                this.teachersList = response.data;
                console.log(this.teachersList);

            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                this.loading = false;
            });
    },
    computed: {
        filteredTeachers() {
            const query = this.searchQuery.toLowerCase();
            return this.teachersList.filter(teacher => {
                const fullName = `${teacher.last_name} ${teacher.first_name}`.toLowerCase();
                console.log(teacher.last_name);
                return fullName.includes(query) || teacher.subject.toLowerCase().includes(query);
            });
        },
        getImageUrl() {
            return function (imagePath) {
                return `${this.serverHost}${imagePath}`;
            };
        },
    },
    methods: {
        showPopup(teacher) {
            this.popupVisible = true;
            this.selectedTeacher = teacher;
        },
        closePopup() {
            this.popupVisible = false;
        },
    }
}
</script>

<template>
    <div class="FindTeacherContainer">
        <div class="search" :class="{ 'overlay': popupVisible, 'hide': loading }">
            <input type="search" v-model="searchQuery" placeholder="Найти учителя">
        </div>
        <div class="cards" :class="{ 'overlay': popupVisible, 'hide': loading }">

            <div class="teachersCardsContainer" v-for="teacher in filteredTeachers" :key="teacher.teacher_id">
                <div class="teachersCards">
                    <img v-if="teacher.image" :src="getImageUrl(teacher.image)" alt="Teacher Photo">
                    <img v-if="!teacher.image" src="/images/profile.jpg" alt="Teacher Photo">
                    <div class="infoHolder">
                        <strong>Преподаватель:</strong>
                        <strong>{{ teacher.subject }}</strong>
                        <h3>{{ teacher.last_name }} {{ teacher.first_name }}</h3>
                        <span><strong>О себе:</strong> {{ teacher.description }}</span>
                    </div>
                </div>
                <div
                    style="width: 100%; display: flex; justify-content: flex-end; align-items: flex-end; padding-right: 10px;">
                    <button class="btn" @click="() => showPopup(teacher)">
                        Расписание
                    </button>
                </div>

            </div>
        </div>
        <div v-if="popupVisible" class="popup">
            <div class="area" @click="closePopup"></div>
            <div style="width: 100%; display: flex; justify-content: flex-end; align-items: center;">
                <button @click="closePopup" style="color: red; background-color: white; border: none;">✖</button>
            </div>
            <Calendar :selectedTeacher="selectedTeacher" />
        </div>
        <loading v-if="loading"></loading>
    </div>
</template >

<style scoped>
.FindTeacherContainer {
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

.overlay {
    opacity: 0.5;
}

.area {
    position: fixed;
    width: 100vw;
    height: 100vh;
    opacity: 0.4;
    background-color: white;
    left: -100;
    top: -100;
    z-index: -5;
}

.cards {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}

.teachersCardsContainer {
    width: 540px;
    height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: space-between;
    margin-bottom: 20px;
    border-radius: 0 0 10px 0;
    border-bottom: 2px solid rgb(8, 114, 72);
    border-right: 2px solid rgb(8, 114, 72);
    -webkit-box-shadow: 8px 8px 7px -5px rgba(34, 60, 80, 0.42);
    -moz-box-shadow: 8px 8px 7px -5px rgba(34, 60, 80, 0.42);
    box-shadow: 8px 8px 7px -5px rgba(34, 60, 80, 0.42);
}

.teachersCards {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;
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
    width: 95%;
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

.popup {
    width: 800px;
    min-height: 400px;
    max-height: 730px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 50%;
    left: 50%;
    padding: 10px;
    transform: translate(-50%, -50%);
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 0 15px rgb(0, 0, 0);
}

.btn {
    color: white;
    font-size: 17px;
    background-color: rgb(255, 185, 56);
    border: none;
    width: 120px;
    height: 30px;
    border-radius: 15px;
    box-shadow: none;
}

.btn:hover {
    box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.366);
}

@media (max-width: 1390px) {
    .search {
        width: 100%;
        justify-content: center;
    }

    .popup {
        width: 600px;
        min-height: fit-content;
        max-height: fit-content;
        left: 50%;
        top: 40%;
    }
}
</style>




