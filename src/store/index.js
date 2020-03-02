import Vue from "vue";
import Vuex from "vuex";

import * as getters from "./rootGetter";
// modules
import user from "./modules/user";
import userList from "./modules/userList";

Vue.use(Vuex);

export default new Vuex.Store({
	getters,
	modules: {
		user,
		userList
	},
	// 嚴格模式，禁止直接修改 state
	strict: true
});
