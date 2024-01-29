<script>
import axios from 'axios';

export default {
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
      serverHost: 'http://172.28.0.242:7000',
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
  },
  watch: {
    currentWeekIndex: 'renderCalendar',
  },
  methods: {
    closePopup() {
      this.showPopup = false;
    },
    changeWeek(weeks) {
      this.currentWeekIndex += weeks;
    },
    toggleLessonStatus(date, time) {
      let profile = JSON.parse(localStorage.getItem("profile"));
      if (!profile) {
        axios.get(`${this.serverHost}/api/user/profile`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(response => {
                let data = response.data;
                localStorage.setItem("profile", JSON.stringify(data))
                profile = data
            })
            .catch(error => {
                if (error["response"]["status"] !== 500) {
                    this.error = error["response"]["data"]["error"];
                    setTimeout(() => {
                        this.error = '';
                    }, 5000);
                }
            });
      }
      let dateParts = date.split("-");
      let currentDateFormat = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      let requestDate =  new Date(`${currentDateFormat} ${time}`);
      let data = {
        "start_datetime": requestDate.toString(),
        "teacher_id": this.selectedTeacher.teacher_id,
        "student_id": profile.id
      }
      axios.post(`${this.serverHost}/api/future-lesson`, data, {
        headers: {
          'Authorization': localStorage.getItem('token')
        },
      })
        .then(response => {
          let data = response.data;
          console.log(data);
        })
        .catch(error => {
          console.log(error);
        });

      const currentStatus = this.timetable.lessons[date][time].type;
      if (currentStatus === 'Свободно') {
        this.timetable.lessons[date][time].type = 'Занято';
        this.timetable.lessons[date][time].class = 'reserved';
      }
    },
    renderCalendar() {
      let startForRequest = new Date(this.currentWeekStart.toISOString());
      let endForRequest = new Date(this.currentWeekEnd.toISOString());
      startForRequest.setDate(startForRequest.getDate() + 1);
      endForRequest.setDate(endForRequest.getDate() + 1);

      axios.get(`${this.serverHost}/api/future-lesson`, {
        params: {
          "start": startForRequest,
          "end": endForRequest,
          "teacher_id": this.selectedTeacher.teacher_id
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

          let sortedTimes = {'lessons': {}}
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
        });
    },
  }
}
</script>

<template>
  <div class="calendarContainer">
    <span style="display: flex; flex-direction: column; align-items: center;">
      Выбранный учитель:
      <h3>
        {{ selectedTeacher.last_name }}
        {{ selectedTeacher.first_name }}
      </h3>
    </span>
    <div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
      <button @click="changeWeek(-1)">&#10510;</button>
      {{ currentWeekLabel }}
      <button @click="changeWeek(1)">&#10509;</button>
    </div>
    <div class="table">
      <div class="daysHolder">
        <div class="days" v-for="(day, dateIndex) in days" :key="dateIndex">{{ day }}</div>
      </div>
      <div class="holder">
        <div class="timeHolder">
          <div class="time" v-for="time in times">{{ time }}</div>
        </div>
        <div class="lessonHolder" v-for="(day, date) in timetable.lessons" :key="date">
          <div class="lesson" v-for="(lesson, time) in day" v-if="time === number" :key="time"
            @click="toggleLessonStatus(date, time)"
            :class="{ 'free': lesson.type === 'Свободно', 'reserved': lesson.type === 'Занято' }" :time="time"
            :day="date">
            {{ lesson.type }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<style scoped>
.calendarContainer {
  width: 98%;
  min-height: 90vh;
  max-height: fit-content;
  padding-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
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
  border: 1px solid #ffffff;
  background-color: #385170;
  color: white;
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
  cursor: pointer;
  background-color: #9fd3c7;
  color: black;
}

.reserved {
    background-color: #ececec;
    color: #767676;
    cursor: pointer;
}

button {
  background-color: transparent;
  border: none;
  font-size: 30px;
  width: 40px;
  text-align: center;
}


@media (max-width: 1390px) {
  * {
    font-size: 10px;
  }

  .calendarContainer {
    width: 100%;
    min-height: fit-content;
    max-height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
  }

  .time {
    height: 20%;
  }

  .lessonHolder {
    height: 100%;
  }

  .holder {
    height: 100%;
  }

  .timeHolder {
    height: 100%;
  }

  .table {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 700px;
  }
}
</style>
  