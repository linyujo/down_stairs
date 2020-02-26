/* eslint-disable */
import user from "@/store/modules/user";

const userActionTypes = user.actionTypes;

const state = {
	websocket: null,
};

const actionTypes = {
	UPDATE_WEBSOCKET: 'UPDATE_WEBSOCKET',
	INIT_WEBSOCKET: 'INIT_WEBSOCKET',
};

const mutations = {
	[actionTypes.UPDATE_WEBSOCKET]: (state, ws) => {
		state.websocket = ws;
	}
};

const actions = {
	[actionTypes.INIT_WEBSOCKET]: ({ commit, dispatch }) => {
		const wsuri = "ws://192.168.100.5:4000/";
		commit(actionTypes.UPDATE_WEBSOCKET, new WebSocket(wsuri));

		if (state.websocket) {
			state.websocket.onmessage = evt => {
				const resData = JSON.parse(evt.data);
				switch (resData.type) {
					case "token":
						dispatch(userActionTypes.AUTH_SUCCESS, resData.token);
						break;
					case "lobbyList":
						console.log('lobbyList', resData.lobbyList);
						break;
					default:
						break;
				}
			};
		}
	}
};

const getters = {
	webSocket: state => state.websocket,
};

export default {
	state,
	getters,
	actionTypes,
	actions,
	mutations,
};