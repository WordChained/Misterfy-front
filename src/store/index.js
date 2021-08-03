import Vue from 'vue'
import Vuex from 'vuex'
import { stationStore } from './modules/station-store.js'
import { playerStore } from './modules/player-store.js'
import { userStore } from './modules/user-store.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userMsg: null
  },
  getters: {
    userMsg(state) {
      return state.userMsg;
    }
  },
  mutations: {
    updateUserMsg(state, { userMsg }) {
      state.userMsg = userMsg;
    },
    deleteMsg(state) {
      state.userMsg = null
    },

  },
  actions: {},
  modules: {
    stationStore,
    playerStore,
    userStore
  }
})