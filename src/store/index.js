import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		userInfo: '',
		pageName:'',
  	},
	getters: {
		getUserInfo: state => {
			return state.userInfo
		},
		getPageName: state => {
			return state.pageName
		},
	},
	mutations: {
		updateUserInfo(state, uf) {
			state.userInfo = uf;
		},
		updatePageName(state, uf) {
			state.pageName = uf;
		},
  	},
	actions: {
	},
	modules: {
	}
})
