const state = {
	status: "idle",
	title: "在線成員",
	inviteData: {
		invitee: null, // 受邀人
		inviter: null, // 發起人
		roomID: ""
	}
};

const getters = {
	sidebarStatus: state => state.status,
	sidebarTitle: state => state.title,
	inviteData: state => state.inviteData
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
		nextState.inviteData = {
			invitee: null,
			inviter: null,
			roomID: ""
		};
	},
	[actionTypes.INVITING]: (nextState, payload) => {
		nextState.status = "inviting";
		nextState.title = "召喚中";
		nextState.inviteData.invitee = payload.invitee;
	},
	[actionTypes.INVITED]: (nextState, payload) => {
		nextState.status = "invited";
		nextState.title = "決鬥召喚";
		nextState.inviteData.inviter = payload.inviter;
		nextState.inviteData.roomID = payload.roomID;
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
	[actionTypes.INVITING]: ({ commit }, payload) => {
		commit(actionTypes.INVITING, payload);
	},
	[actionTypes.INVITED]: ({ commit }, payload) => {
		commit(actionTypes.INVITED, payload);
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
