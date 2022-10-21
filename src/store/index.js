import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		userInfo:''
  	},
	getters: {
		getUserInfo: state => {
			return state.userInfo
		  }
	},
	mutations: {
		updateUserInfo(state, uf) {
			state.userInfo = uf;
		}
  	},
	actions: {
	},
	modules: {
	}
})
