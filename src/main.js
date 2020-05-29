import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// eslint-disable-next-line no-unused-vars
import babelPolyfill from 'babel-polyfill' // this is a required to get certain async features working

import App from './App.vue'
import router from './router'
import store from './store'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app')
