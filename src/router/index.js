import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from "nprogress"
import 'nprogress/nprogress.css'
Vue.use(VueRouter)

const routes = [
	{
		path: '/login',
		name: 'login',
		component: ()=>import('../views/LoginView.vue')
	},
	{
		path: '/test',
		name: 'test',
		component: ()=>import('../views/testview.vue')
	},
	{
		path: '/',
		name: 'home',
		component: () => import('../views/HomeView.vue'),
		children: [
			{
				path: 'Start',
				name: 'Start',
				component:()=>import('../views/HomeView/WelcomeView.vue')
			},
			{
				path:'Flush',
				name: 'flush',
				component:()=>import('../views/Flush.vue')
			},
		]
	},
	{
		path:'/404',
		name: '404 Not Found',
		component:()=>import('@/views/404.vue')
	},
	{
		path: '/doWork',
		name: 'doWork',
		component:()=>import('@/views/WorkPanel.vue')
	},
	{
		path: '/',
		redirect:'/Start',
	},
	{
		path: '*',
		redirect:'/404',
	}
]

const router = new VueRouter({
	base:'/TEEE',
  	routes
})


const serverRoutes = sessionStorage.getItem('serverRoutes');
if (serverRoutes) {
	const arr = JSON.parse(serverRoutes);
	setRouter(arr);
}

router.beforeEach((to, from, next) => {
	//验证token存在，则进入该页面
	try {
		NProgress.start();	
	} finally {}
	if (to.path == '/login') {
		localStorage.setItem('token', '');
		sessionStorage.setItem('serverRoutes', '');
	}
	if (localStorage.getItem('token')) {
		next();
	} else { 
		if (to.path === "/login") {
			next();
		} else {
			next("/login");
		}
	}
	try {
		NProgress.set(1);
	
	} finally {}
});

router.afterEach((to,from,nex)=>{
	NProgress.set(1);
})


export function resetRouter() {
	router.matcher = new VueRouter({routes}).matcher
}
export function setRouter(routers) {
	let bool_setCourseChildren = false;
	for (const { name, path, component, icon } of routers) {
		if (path != null) {
			router.addRoute('home', {
				path: path,
				name: name,
				component: () => import(`@/views/HomeView/${component}`),	
			});
		}
		// if (name == '我的课程' && bool_setCourseChildren == false) {
		// 	bool_setCourseChildren = true;
		// 	router.addRoute('我的课程', {
		// 		path: "/CourseContent",
		// 		name: 'CourseContent',
		// 		component: () => import(`@/views/HomeView/CourseContent.vue`),	
				
		// 	});
		// 	router.addRoute('CourseContent', {
		// 		path: "/announcement",
		// 		name: 'announcement',
		// 		component: () => import(`@/views/HomeView/CourseContentChildren/announcement.vue`),	
				
		// 	});
		// 	router.addRoute('我的课程', {
		// 		path: "/examsView",
		// 		name: 'examsView',
		// 		component: () => import(`@/views/HomeView/CourseContentChildren/examsView.vue`),	
				
		// 	});
		// 	router.addRoute('我的课程', {
		// 		path: "/worksView",
		// 		name: 'worksView',
		// 		component: () => import(`@/views/HomeView/CourseContentChildren/worksView.vue`),	
				
		// 	});
		// }
	}
	
}

export default router
