import Vue from 'vue'
import './plugins/fontawesome'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Dialog from 'vue-dialog-loading'

Vue.config.productionTip = false
Vue.use(Dialog,  {
	dialogBtnColor: '#0f0'
   })
new Vue({
  router,
  store,
	vuetify,
  render: h => h(App)
}).$mount('#app')
