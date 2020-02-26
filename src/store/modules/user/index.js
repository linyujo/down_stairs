/* eslint-disable */

const state = {
	token: '', // 由後端給
	status: '',
};

const getters = {
	isAuthenticated: state => !!state.token,
	authStatus: state => state.status,
};

// constant
const actionTypes = {
	AUTH_REQUEST: 'AUTH_REQUEST',
	AUTH_SUCCESS: 'AUTH_SUCCESS',
	AUTH_ERROR: 'AUTH_ERROR',
};

// reducer
const mutations = {
	[actionTypes.AUTH_REQUEST]: (state) => {
		state.status = 'fetching';
	},
	[actionTypes.AUTH_SUCCESS]: (state, token) => {
		state.status = 'login';
		state.token = token;
	},
	[actionTypes.AUTH_ERROR]: (state) => {
		state.status = 'invalid';
	},
};

// action middleware
const actions = {
	[actionTypes.AUTH_REQUEST]: ({ getters, commit }, payload) => {
		commit(actionTypes.AUTH_REQUEST);
		const websocket = getters.webSocket;
		websocket.send(JSON.stringify(payload));
	},
	[actionTypes.AUTH_SUCCESS]: ({ commit }, token) => {
		commit(actionTypes.AUTH_SUCCESS, token);
	}
};

export default {
	state,
	getters,
	actionTypes,
	actions,
	mutations,
};