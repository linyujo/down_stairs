import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

var pjson = require('../package.json');
console.log(pjson.version);

Vue.config.productionTip = false;

new Vue({
	render: h => h(App),
	store,
	router,
	components: { App }
}).$mount("#app");
