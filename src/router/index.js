import Vue from 'vue'
import VueRouter from 'vue-router'
import { requireRegistered, requireUnregistered } from './user.js'

const Landing = () => import('../views/Landing.vue')
const Game = () => import('../views/Game.vue')
const Error = () => import('../views/Error.vue')
const LoadUser = () => import('../views/LoadUser.vue')
const HandleUnavailable = () => import('../views/HandleUnavailable.vue')
const NotFound = () => import('../views/NotFound.vue')

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
        path: '/load',
        name: 'LoadUser',
        component: LoadUser,
    },
    {
        path: '/duplicate',
        name: 'HandleUnavailable',
        component: HandleUnavailable,
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
