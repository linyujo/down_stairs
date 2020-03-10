const state = {
	token: "", // 由後端給
	authStatus: "",
	status: "idle"
};

const getters = {
	isAuthenticated: state => !!state.token,
	authStatus: state => state.authStatus,
	clientID: state => state.token,
	isBattling: state => state.status === "battling"
};

// constant
const actionTypes = {
	AUTH_SUCCESS: "AUTH_SUCCESS",
	AUTH_ERROR: "AUTH_ERROR",
	UPDATE_STATUS: "UPDATE_STATUS"
};

// reducer
const mutations = {
	[actionTypes.AUTH_SUCCESS]: (nextState, token) => {
		nextState.authStatus = "login";
		nextState.token = token;
	},
	[actionTypes.AUTH_ERROR]: nextState => {
		nextState.authStatus = "invalid";
	},
	[actionTypes.UPDATE_STATUS]: (nextState, status) => {
		nextState.status = status;
	}
};

// action middleware
const actions = {
	[actionTypes.AUTH_SUCCESS]: ({ commit }, token) => {
		commit(actionTypes.AUTH_SUCCESS, token);
	},
	[actionTypes.UPDATE_STATUS]: ({ commit }) => {
		const nextStatus = state.status === "idle" ? "battling" : "idle";
		commit(actionTypes.UPDATE_STATUS, nextStatus);
	}
};

export default {
	state,
	getters,
	actionTypes,
	actions,
	mutations
};
