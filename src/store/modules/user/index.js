const state = {
	token: "", // 由後端給
	authStatus: "",
	status: "idle"
};

const getters = {
	isAuthenticated: state => !!state.token,
	authStatus: state => state.authStatus,
	clientID: state => state.token
};

// constant
const actionTypes = {
	AUTH_SUCCESS: "AUTH_SUCCESS",
	AUTH_ERROR: "AUTH_ERROR"
};

// reducer
const mutations = {
	[actionTypes.AUTH_SUCCESS]: (nextState, token) => {
		nextState.authStatus = "login";
		nextState.token = token;
	},
	[actionTypes.AUTH_ERROR]: nextState => {
		nextState.authStatus = "invalid";
	}
};

// action middleware
const actions = {
	[actionTypes.AUTH_SUCCESS]: ({ commit }, token) => {
		commit(actionTypes.AUTH_SUCCESS, token);
	}
};

export default {
	state,
	getters,
	actionTypes,
	actions,
	mutations
};
