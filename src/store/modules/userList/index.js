/* eslint-disable */

const state = [
	{
		id: "PodeWGPg3h6mi5Qo6cacFQ==",
		username: "cc",
		avatar:
			"https://www.gravatar.com/avatar/f6f45ac28e597b5ae62faf55301661ec?s=120&d=identicon"
	},
	{
		id: "bCaVGNX3LIcymexZ4Qc0lQ==",
		username: "cindy",
		avatar:
			"https://www.gravatar.com/avatar/55a322aab1666f79a8f9e41f753ae948?s=120&d=identicon"
	}
];

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
