import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		path: '/login',
		name: 'login',
		component: ()=>import('../views/LoginView.vue')
	},
	{
		path: '/',
		name: 'home',
		component: () => import('../views/HomeView.vue'),
		children: [
			//课程页面 
			{
				path: 'Course',
				name: 'Course',
				component:()=>import('../views/HomeView/CourseView.vue')
			},
			{
				path: 'Statistics',
				name: 'Statistics',
				component:()=>import('../views/HomeView/StatisticsView.vue')
			},
		]
	},
]

const router = new VueRouter({
  routes
})

export default router
