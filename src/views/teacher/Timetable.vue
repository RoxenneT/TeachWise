<script>
import axios from 'axios';
import Loading from '../Loading.vue'
export default {
    components: {
        Loading,
    },
    props: {
        selectedTeacher: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            timetable: {},
            currentWeekIndex: 0,
            times: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
            days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', "Сб"],
            showPopup: false,
            selectedStudentID: null,
            studentName: '',
            studentLastname: '',
            studentImage: '',
            serverHost: 'http://172.28.0.242:7000',
            loading: false,
        }
    },
    created() {
        this.renderCalendar()
    },
    computed: {
        currentWeekStart() {
            const startDate = new Date(2023, 11, 11);
            const currentWeekStartDate = new Date(startDate);
            currentWeekStartDate.setDate(startDate.getDate() + this.currentWeekIndex * 7);
            return currentWeekStartDate;
        },
        currentWeekEnd() {
            const currentWeekEndDate = new Date(this.currentWeekStart);
            currentWeekEndDate.setDate(this.currentWeekStart.getDate() + 6);
            return currentWeekEndDate;
        },
        currentWeekLabel() {
            return `${this.currentWeekStart.getDate()}.${this.currentWeekStart.getMonth() + 1}.${this.currentWeekStart.getFullYear()} - ${this.currentWeekEnd.getDate()}.${this.currentWeekEnd.getMonth() + 1}.${this.currentWeekEnd.getFullYear()}`;
        },
        getImageUrl() {
            return function (imagePath) {
                return `${this.serverHost}${imagePath}`;
            };
        },
    },
    watch: {
        currentWeekIndex: 'renderCalendar',
    },
    methods: {
        showStudentInfo(date, time) {
            const lesson = this.timetable.lessons[date][time].student;
            if (this.timetable.lessons[date][time].type === 'Занято') {
                this.selectedStudentID = lesson;
                console.log(this.selectedStudentID);
                axios.get(`${this.serverHost}/api/student/${this.selectedStudentID}`, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                })
                    .then(response => {
                        let data = response.data;
                        console.log("Я дата:", data);
                        this.studentName = data["first_name"];
                        this.studentLastname = data["last_name"];
                        this.studentImage = data["image"];
                        console.log("Имя", this.studentName);
                        console.log("Фамилия", this.studentLastname);

                    })
                    .catch(error => {
                        console.log(error);
                        if (error["response"]["status"] !== 500) {
                            this.error = error["response"]["data"]["error"];
                            setTimeout(() => {
                                this.error = '';
                            }, 5000);
                        }
                    })
                this.showPopup = true;
            }
        },
        closePopup() {
            this.showPopup = false;
            this.selectedStudent = null;
        },
        changeWeek(weeks) {
            this.currentWeekIndex += weeks;
        },
        renderCalendar() {
            let startForRequest = new Date(this.currentWeekStart.toISOString());
            let endForRequest = new Date(this.currentWeekEnd.toISOString());
            startForRequest.setDate(startForRequest.getDate() + 1);
            endForRequest.setDate(endForRequest.getDate() + 1);
            this.loading = true;
            axios.get(`${this.serverHost}/api/future-lesson`, {
                params: {
                    "start": startForRequest,
                    "end": endForRequest,
                    "teacher_id": JSON.parse(localStorage.getItem('profile'))['id']
                },
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
            })
                .then(response => {
                    let data = response.data;
                    let times = [
                        '10:00',
                        '11:00',
                        '12:00',
                        '13:00',
                        '14:00',
                        '15:00',
                        '16:00',
                        '17:00'
                    ]
                    let dayOfWeeks = {};
                    for (const key in data.lessons) {
                        dayOfWeeks[key] = data['lessons'][key]['day_of_week']
                        delete data['lessons'][key]['day_of_week']
                    }
                    this.timetable = data

                    let sortedTimes = { 'lessons': {} }
                    for (const key in data['lessons']) {
                        sortedTimes['lessons'][key] = {}
                        for (let index = 0; index < times.length; index++) {
                            const element = times[index];
                            sortedTimes['lessons'][key][element] = data['lessons'][key][element]
                        }
                    }
                    this.timetable = sortedTimes
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    }
}
</script>

<template>
    <div class="timetableContainer">
        <loading v-if="loading"></loading>
        <div :class="{ 'hide': loading }"
            style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
            <button @click="changeWeek(-1)">&#10510;</button>
            {{ currentWeekLabel }}
            <button @click="changeWeek(1)">&#10509;</button>
        </div>
        <div class="table" :class="{ 'overlay': showPopup, 'hide': loading }">
            <div class="daysHolder">
                <div class="days" v-for="(day, dateIndex) in days" :key="dateIndex">{{ day }}</div>
            </div>
            <div class="holder">
                <div class="timeHolder">
                    <div class="time" v-for="time in times">{{ time }}</div>
                </div>
                <div class="lessonHolder" v-for="(day, date) in timetable.lessons" :key="date">
                    <div class="lesson" v-for="(lesson, time) in day" :key="time" @click="showStudentInfo(date, time)"
                        :class="{ 'free': lesson.type === 'Свободно', 'reserved': lesson.type === 'Занято' }">
                        {{ lesson.type }}
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showPopup" class="popup">
            <div class="popup-content"
                style="width: 100%; display: flex; justify-content: flex-end; align-items: flex-start;">
                <span class="close-popup" @click="closePopup"
                    style="color: red; background-color: white; border: none; cursor: pointer;">✖</span>
            </div>
            <p>Студент:</p>
            <h3>{{ studentName }} {{ studentLastname }}</h3>
            <img v-if="studentImage" :src="getImageUrl(studentImage)" alt="Student Photo">
            <img v-if="!studentImage" src="/images/profile.jpg" alt="Student Photo">
        </div>
    </div>
</template>
  
<style scoped>
.timetableContainer {
    width: 100%;
    min-height: 100%;
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

.hide {
    z-index: -1;
}

.table {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 500px;
}

.timeHolder {
    display: flex;
    flex-direction: column;
    width: 9%;
    height: 440px;
}

.time {
    width: 100%;
    height: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #ffffff;
    background-color: #385170;
    color: white;
}

img {
    width: 200px;
    height: 200px;
    border-radius: 10px;
}

.holder {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: 80%;
    height: 440px;
}

.daysHolder {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 80%;
    height: 40px;
}

.days {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 15.17%;
    height: 100%;
    border: 1px solid #ffffff;
    background-color: #385170;
    color: white;
}

.lessonHolder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 15.22%;
    height: 440px;
}

.lesson {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ffffff;
}

h3 {
    color: rgb(255, 185, 56);
}

.free {
    background-color: #9fd3c7;
    color: black;
}

.reserved {
    background-color: #ececec;
    color: #767676;
    cursor: pointer;
}

button {
    background-color: white;
    border: none;
    font-size: 30px;
    width: 40px;
    text-align: center;
}

.popup {
    min-width: 300px;
    max-width: fit-content;
    min-height: 360px;
    max-height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;
    position: fixed;
    top: 58%;
    left: 50.50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 1390px) {
    * {
        font-size: 12px;
    }

    .timetableContainer {
        min-height: 100vh;
    }

    .table {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: fit-content;
    }

    .timeHolder {
        display: flex;
        flex-direction: column;
        width: 9%;
        height: 700px;
    }

    .time {
        width: 100%;
        height: 15%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid #ffffff;
        background-color: #385170;
        color: white;
    }

    .holder {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        width: 80%;
        height: 700px;
    }

    .daysHolder {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 80%;
        height: 40px;
    }

    .days {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 15.17%;
        height: 100%;
        border: 1px solid #ffffff;
        background-color: #385170;
        color: white;
    }

    .lessonHolder {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 15.22%;
        height: 700px;
    }

    .lesson {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #ffffff;
    }

    .popup {
        top: 50%;
        left: 50.50%;
    }
}
</style>
  