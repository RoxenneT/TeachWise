import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegistrationPage.vue')
    },
    {
      path: '/enter',
      name: 'enter',
      component: () => import('../views/Enter.vue')
    },
    {
      path: '/seeMore',
      name: 'seeMore',
      component: () => import('../views/FeatureContent.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/teacher/ProfileTeacher.vue') 
    },
    {
      path: '/students',
      name: 'students',
      component: () => import('../views/teacher/Students.vue') 
    },
    {
      path: '/session',
      name: 'session',
      component: () => import('../views/Session.vue') 
    },
    {
      path: '/timetable',
      name: 'timetable',
      component: () => import('../views/teacher/timetable.vue') 
    },
    {
      path: '/findTeacher',
      name: 'findTeacher',
      component: () => import('../views/student/FindTeacherPage.vue')
    },
    {
      path: '/studentDashboard',
      name: 'studentDashboard',
      component: () => import('../views/student/ProfileStudent.vue') 
    },
    {
      path: '/homework',
      name: 'homework',
      component: () => import('../views/student/Homework.vue') 
    },
  ]
})

export default router


