import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import shop from './modules/shop'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		shop,
		user
	},
	getters
})

export default store

