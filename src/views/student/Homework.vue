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
            homework: [],
            loading: false
        };
    },
    created() {
        this.loading = true;
        axios.get(`${this.serverHost}/api/homework/student`, {
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'multipart/form-data',
            }
        })
            .then(response => {
                // console.log('I AM RESPONSE', response.data);
                this.homework = response.data
                console.log(this.homework);
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
            .finally(() => {
                this.loading = false;
            });
    },
    methods: {
        getFileUrl(imagePath) {
            return `${this.serverHost}${imagePath}`;
        },
    },
};
</script>

<template>
    <div class="homeworkContainer">
        <loading v-if="loading"></loading>
        <div class="cards" :class="{ 'hide': loading }" v-if="homework">
            <div class="homeworkCards" v-for="task in homework" :key="id">
                <img src="/images/hw.png" alt="Student Photo">
                <div class="infoHolder">
                    <span>Дата урока: </span>
                    <h3>{{ new Date(task.upload_date).toLocaleString() }}</h3>
                    <span>Тема урока</span>
                    <h3>{{ task.description }}</h3>
                    <a :href=getFileUrl(task.file) download>Скачать файл</a>
                </div>
            </div>
            <div style="width: 100%; height: 600px; display: flex; flex-direction: column; justify-content: center; align-items: center;"
                v-if="homework.length === 0">
                <h2>Домашних заданий ещё нет. Отдыхайте!</h2>
                <img src="/images/funny.gif" alt="">
            </div>
        </div>
    </div>
</template >

<style scoped>
.homeworkContainer {
    width: 98%;
    min-height: 95vh;
    max-height: fit-content;
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 30px;
}

.cards {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
}

.homeworkCards {
    width: 600px;
    height: 205px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
    border-radius: 0 0 10px 0;
    border-bottom: 2px solid rgb(8, 56, 114);
    border-right: 2px solid rgb(8, 49, 114);
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

h3 {
    color: rgb(255, 185, 56);
}

h2 {
    color: rgb(212, 143, 16);
}

.hide {
    z-index: -1;
}

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
</style>