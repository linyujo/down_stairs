import userStore from "@/store/modules/user";

const state = {
	list: []
};

const getters = {
	usersCount: state => state.list.length,
	userList: state => state.list
};

// constant
const actionTypes = {
	CURRENT_USERS: "CURRENT_USERS",
	ADD_ONE_USER: "ADD_ONE_USER",
	DELETE_ONE_USER: "DELETE_ONE_USER",
	UPDATE_ONE_USER: "UPDATE_ONE_USER"
};

// reducer
const mutations = {
	[actionTypes.CURRENT_USERS]: (nextState, list) => {
		nextState.list = list;
	},
	[actionTypes.ADD_ONE_USER]: (nextState, user) => {
		nextState.list = [...state.list, user];
	},
	[actionTypes.DELETE_ONE_USER]: (nextState, id) => {
		nextState.list = state.list.filter(u => u.id !== id);
	},
	[actionTypes.UPDATE_ONE_USER]: (nextState, user) => {
		nextState.list = state.list.map(u => (u.id === user.id ? user : u));
	}
};

// action middleware
const actions = {
	[actionTypes.CURRENT_USERS]: ({ commit }, list) => {
		commit(actionTypes.CURRENT_USERS, list);
	},
	[actionTypes.ADD_ONE_USER]: ({ commit }, user) => {
		commit(actionTypes.ADD_ONE_USER, user);
	},
	[actionTypes.DELETE_ONE_USER]: ({ commit }, id) => {
		commit(actionTypes.DELETE_ONE_USER, id);
	},
	[actionTypes.UPDATE_ONE_USER]: ({ commit, getters, dispatch }, user) => {
		commit(actionTypes.UPDATE_ONE_USER, user);
		if (user.id === getters.clientID) {
			dispatch(userStore.actionTypes.UPDATE_STATUS);
		}
	}
};

export default {
	state,
	getters,
	actionTypes,
	actions,
	mutations
};
