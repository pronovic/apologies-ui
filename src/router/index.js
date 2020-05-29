import Vue from 'vue'
import VueRouter from 'vue-router'
import { requireRegistered, requireUnregistered } from './user.js'

import Landing from '../views/Landing.vue'
import Game from '../views/Game.vue'
import Error from '../views/Error.vue'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: Landing,
        beforeEnter: requireUnregistered,
    },
    {
        path: '/game',
        name: 'Game',
        component: Game,
        beforeEnter: requireRegistered,
    },
    {
        path: '/error',
        name: 'Error',
        component: Error,
    },
    {
        path: '*',
        name: 'NotFound',
        component: NotFound,
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

export default router
