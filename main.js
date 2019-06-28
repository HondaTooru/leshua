import Vue from 'vue'
import App from './App'
import store from '@/store'

import EmptyData from '@/components/emptydata'
import userAuth from '@/components/auth'
import cuCustom from './components/cu-custom.vue'

Vue.component('cu-custom',cuCustom) // 导航模板
Vue.component('empty-data', EmptyData) // 空数据模板
Vue.component('userAuth', userAuth) // 用户授权登录

Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.$store = store

const app = new Vue({
    ...App
})
app.$mount()
