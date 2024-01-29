<script>
import { RouterLink, RouterView } from 'vue-router'
import axios from 'axios';
import TeacherNav from './views/teacher/TeacherNav.vue';
import StudentNav from './views/student/StudentNav.vue';
export default {
  data() {
    return {
      userType: '',
      serverHost: 'http://172.28.0.242:7000',
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    userType() {
      return this.$store.state.type;
    },
    // userTypeNavComponent() {
    //   console.log("Я ВЫЗЫВАЮСЬ!!!!!!!!!!!!!!!!!!!!");
    //   switch (localStorage.getItem('type')) {
    //     case 'teacher':
    //       return TeacherNav;
    //     case 'student':
    //       return StudentNav;
    //     default:
    //       return null; 
    //   }
    // },
  },
  watch: {
    userType(newType) {
      console.log('Type changed:', newType);
    }
  },
  created() {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${this.serverHost}/api/user/profile`, {
        headers: {
          Authorization: token
        }
      }) 
        .then(response => {
          const userData = response.data;
          let type = userData['type']
          this.$store.commit('updateRoles', { type });
          this.userType = this.$store.state.type;
          this.userDataReceived = true;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  updated(){
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${this.serverHost}/api/user/profile`, {
        headers: {
          Authorization: token
        }
      }) 
        .then(response => {
          const userData = response.data;
          let type = userData['type']
          this.$store.commit('updateRoles', { type });
          this.userType = this.$store.state.type;
          this.userDataReceived = true;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
}
</script>

<template>
  <header>
    <div class="appName">
      <img alt="logo" class="logo" src="/images/logo.png" />
      <h2 style="font-weight: bolder; letter-spacing: 2px; line-height: 10px; color: rgb(8, 114, 8);">Teach Wise</h2>
    </div>
    <nav v-if="this.$store.state.type === ''">
      <RouterLink to="/">Главная</RouterLink>
      <RouterLink to="/register">Регистрация</RouterLink>
      <RouterLink to="/enter"><button>Войти</button></RouterLink>
    </nav>

    <nav v-if="this.$store.state.type === 'teacher'">
        <RouterLink to="/timetable">Расписание</RouterLink>
        <RouterLink to="/students">Студенты</RouterLink>
        <RouterLink to="/session">Урок</RouterLink>
        <RouterLink to="/dashboard">Профиль</RouterLink>
    </nav>

    <nav  v-if="this.$store.state.type === 'student'">
        <RouterLink to="/findTeacher">Найти учителя</RouterLink>
        <RouterLink to="/homework">Домашняя работа</RouterLink>
        <RouterLink to="/session">Урок</RouterLink>
        <RouterLink to="/studentDashboard">Профиль</RouterLink>
    </nav>

    <!-- <component :is="userTypeNavComponent" v-if="isAuthenticated"></component> -->

  </header>

  <RouterView />
</template>

<style scoped>
header {
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  gap: 300px;
  border-bottom: .5px solid rgb(0, 128, 94);
}

.appName {
  width: 250px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 65px;
  height: 65px;
}

nav {
  width: fit-content;
  display: flex;
  gap: 30px;
  font-size: 20px;
  padding-right: 10px;
}

button {
  color: white;
  font-size: 20px;
  background-color: rgb(255, 185, 56);
  border: none;
  width: 100px;
  height: 30px;
  border-radius: 15px;
  box-shadow: none;
}

button:hover {
  box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.366);
}

@media (max-width: 1390px) {
  header {
    height: 20%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
    margin-bottom: 20px;
    gap: 30px;
  }

  .appName {
    flex-direction: column;
  }

  nav {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    gap: 10px;
  }
}
</style>
