import Vue from "vue";
import Vuex from "vuex";

import * as getters from "./rootGetter";
// modules
import user from "./modules/user";
import userList from "./modules/userList";
import sidebarStatus from "./modules/sidebarStatus";
import gameMode from "./modules/gameMode";

Vue.use(Vuex);

export default new Vuex.Store({
	getters,
	modules: {
		user,
		userList,
		sidebarStatus,
		gameMode
	},
	// 嚴格模式，禁止直接修改 state
	strict: true
});
