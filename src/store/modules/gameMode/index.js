const state = {
	mode: "single"
};

const getters = {
	gameMode: state => state.mode
};

// constant
const actionTypes = {
	UPDATE_GAME_MODE: "UPDATE_GAME_MODE"
};

// reducer
const mutations = {
	[actionTypes.UPDATE_GAME_MODE]: (nextState, mode) => {
		nextState.mode = mode;
	}
};

// action middleware
const actions = {
	[actionTypes.UPDATE_GAME_MODE]: ({ commit }) => {
		const mode = state.mode === "single" ? "dual" : "single";
		commit(actionTypes.UPDATE_GAME_MODE, mode);
	}
};

export default {
	state,
	getters,
	actionTypes,
	mutations,
	actions
};
