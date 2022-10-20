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

// router.beforeEach((to, from, next) => {
// 	if (to.path.startsWith('/login')) {
// 		window.localStorage.removeItem('token');
// 		next();
// 	} else {
// 		let token = JSON.parse(window.localStorage.getItem('token')).data;
// 		if (!token) {
// 			next({path: '/login'})
// 		} else {
// 			axios({
// 				url: '/api/checkToken',
// 				method: 'get',
// 				header: {
// 					token:token
// 				}
// 			})
// 		}
// 	}
// })


const router = new VueRouter({
	base:'/TEEE',
  	routes
})

export default router
