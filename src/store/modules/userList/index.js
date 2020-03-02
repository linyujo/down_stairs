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
	DELETE_ONE_USER: "DELETE_ONE_USER"
};

// reducer
const mutations = {
	[actionTypes.CURRENT_USERS]: (state, list) => {
		state.list = list;
	},
	[actionTypes.ADD_ONE_USER]: (state, user) => {
		state.list = [...state.list, user];
	},
	[actionTypes.DELETE_ONE_USER]: (state, id) => {
		state.list = state.list.filter(u => u.id !== id);
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
	}
};

export default {
	state,
	getters,
	actionTypes,
	actions,
	mutations
};
