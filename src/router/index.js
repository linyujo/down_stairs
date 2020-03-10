import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import SingleView from "../views/Single.vue";
import DualView from "../views/Dual.vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "home",
		component: Home,
		beforeEnter: (to, from, next) => {
			// if (!isAuthenticated) next('/login');
			// if the user is not authenticated, `next` is called twice
			if (store.getters.isAuthenticated) {
				next();
				return;
			}
			next("/login");
		}
	},
	{
		path: "/single",
		name: "single",
		component: SingleView,
		beforeEnter: (to, from, next) => {
			if (store.getters.isAuthenticated) {
				next();
				return;
			}
			next("/login");
		}
	},
	{
		path: "/dual",
		name: "dual",
		component: DualView,
		beforeEnter: (to, from, next) => {
			if (store.getters.isAuthenticated) {
				next();
				return;
			}
			next("/login");
		}
	},
	{
		path: "/login",
		name: "login",
		component: Login
	},
	{
		path: "/*",
		name: "backToHome",
		component: Home,
		beforeEnter: (to, from, next) => {
			if (store.getters.isAuthenticated) {
				next();
				return;
			}
			next("/login");
		}
	}
	// {
	//   path: "/about",
	//   name: "about",
	//   // route level code-splitting
	//   // this generates a separate chunk (about.[hash].js) for this route
	//   // which is lazy-loaded when the route is visited.
	//   component: () =>
	//     import(/* webpackChunkName: "about" */ "../views/About.vue")
	// }
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

export default router;
