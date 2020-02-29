/* eslint-disable */

const state = [];

const getters = {
	usersCount: state => state.length,
};

// constant
const actionTypes = {
	CURRENT_USERS: "CURRENT_USERS",
	ADD_ONE_USER: "ADD_ONE_USER",
	DELETE_ONE_USER: "DELETE_ONE_USER",
};

// reducer
const mutations = {
	[actionTypes.CURRENT_USERS]: (state, userList) => {
		state = userList;
	},
	[actionTypes.ADD_ONE_USER]: (state, user) => {
		state = [...state, user];
	},
	[actionTypes.DELETE_ONE_USER]: (state, user) => {
		state = state.filter(u => u.id !== user.id);
	},
};

// action middleware
const actions = {
	[actionTypes.CURRENT_USERS]: ({ commit }, list) => {
		commit(actionTypes.CURRENT_USERS, list);
	},
	[actionTypes.ADD_ONE_USER]: ({ commit }, user) => {
		commit(actionTypes.ADD_ONE_USER, user);
	},
	[actionTypes.DELETE_ONE_USER]: ({ commit }, user) => {
		commit(actionTypes.DELETE_ONE_USER, user);
	}
};

export default {
	state,
	getters,
	actionTypes,
	actions,
	mutations,
};
