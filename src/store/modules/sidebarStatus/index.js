const state = {
	status: "idle",
	title: "在線成員"
};

const getters = {
	sidebarStatus: state => state.status,
	sidebarTitle: state => state.title
};

// constant
const actionTypes = {
	RESET_IDLE: "RESET_IDLE",
	INVITING: "INVITING",
	INVITED: "INVITED",
	BATTLING: "BATTLING"
};

// reducer
const mutations = {
	[actionTypes.RESET_IDLE]: nextState => {
		nextState.status = "idle";
		nextState.title = "在線成員";
	},
	[actionTypes.INVITING]: nextState => {
		nextState.status = "inviting";
		nextState.title = "召喚中";
	},
	[actionTypes.INVITED]: nextState => {
		nextState.status = "invited";
		nextState.title = "決鬥召喚";
	},
	[actionTypes.BATTLING]: nextState => {
		nextState.status = "battling";
		nextState.title = "決鬥中";
	}
};

// action middleware
const actions = {
	[actionTypes.RESET_IDLE]: ({ commit }) => {
		commit(actionTypes.RESET_IDLE);
	},
	[actionTypes.INVITING]: ({ commit }) => {
		commit(actionTypes.INVITING);
	},
	[actionTypes.INVITED]: ({ commit }) => {
		commit(actionTypes.INVITED);
	},
	[actionTypes.BATTLING]: ({ commit }) => {
		commit(actionTypes.BATTLING);
	}
};

export default {
	state,
	getters,
	actionTypes,
	mutations,
	actions
};
