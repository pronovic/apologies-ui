import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueKonva from 'vue-konva'

// eslint-disable-next-line no-unused-vars
import babelPolyfill from 'babel-polyfill' // this is a required to get certain async features working

import App from './App.vue'
import router from 'Router'
import store from 'VStore'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueKonva)

new Vue({
    router,
    store,
    render: (h) => h(App),
    methods: {
        onResize() {
            store.dispatch('handleWindowSizeChange')
        },
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize)
            store.dispatch('handleWindowSizeChange')
        })
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
}).$mount('#app')
