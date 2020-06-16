import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'VStore'

import { logger } from 'Utils/util'

const Landing = () => import('Views/Landing.vue')
const Game = () => import('Views/Game.vue')
const Error = () => import('Views/Error.vue')
const Inactive = () => import('Views/Inactive.vue')
const LoadUser = () => import('Views/LoadUser.vue')
const RegisterHandle = () => import('Views/RegisterHandle.vue')
const UnregisterHandle = () => import('Views/UnregisterHandle.vue')
const HandleUnavailable = () => import('Views/HandleUnavailable.vue')
const ServerShutdown = () => import('Views/ServerShutdown.vue')
const NotFound = () => import('Views/NotFound.vue')

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: Landing,
    },
    {
        path: '/game',
        name: 'Game',
        component: Game,
    },
    {
        path: '/error',
        name: 'Error',
        component: Error,
    },
    {
        path: '/inactive',
        name: 'Inactive',
        component: Inactive,
    },
    {
        path: '/load',
        name: 'LoadUser',
        component: LoadUser,
    },
    {
        path: '/register/:handle',
        name: 'RegisterHandle',
        component: RegisterHandle,
    },
    {
        path: '/unregister',
        name: 'UnregisterHandle',
        component: UnregisterHandle,
    },
    {
        path: '/unavailable/:handle',
        name: 'HandleUnavailable',
        component: HandleUnavailable,
    },
    {
        path: '/shutdown',
        name: 'ServerShutdown',
        component: ServerShutdown,
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

router.beforeEach((to, from, next) => {
    if (to.name !== 'LoadUser' && to.name !== 'Error') {
        if (!store.getters.isUserLoaded) {
            logger.info('User is not yet loaded, redirecting to load user page')
            next({ name: 'LoadUser' })
        }
    }

    next()
})

export default router
