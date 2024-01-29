import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      type: '',
      isAuthenticated: false
    };
  },
  getters: {
    userType: state => state.type,
  },
  mutations: {
    updateRoles(state, { type }) {
      console.log("updateRoles ===========================");
      console.log(type);
      console.log("=40291384098 2173 4098 217 =");
      state.type = type;
      state.isAuthenticated = true; 
    },
    logout(state) {
      state.type = '';
      state.isAuthenticated = false;
      localStorage.clear()
    },
  },
});

export default store;