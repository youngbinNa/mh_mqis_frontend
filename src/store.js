import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user'),
    isAdmin: localStorage.getItem('isAdmin'),
    type: localStorage.getItem('type'),
    userseq: localStorage.getItem('userseq'),
  },
  plugins: [ createPersistedState({ 
    paths: ["token","user","isAdmin","type","userseq"], 
  }), ],

  mutations: {
    getToken (state, user) {
      state.token = localStorage.getItem('token')
      state.user = user
    },
    getTokenisAdmin (state, isAdmin) {
      state.isAdmin = isAdmin
    },
    getTokenlogintype (state, type) {
      state.type = type
    },
    getTokenUserSeq (state, userseq) {
      state.userseq = userseq
    },
    delToken (state) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('isAdmin')
      localStorage.removeItem('type')
      localStorage.removeItem('userseq')
      state.token = null
      state.user = {
        user_seq: null,
        kname: null,
      },
      state.isAdmin=null,
      state.type=null,
      state.userseq=null
    }
  },
  actions: {

  }
})