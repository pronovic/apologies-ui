import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

const Landing = () => import('../views/Landing.vue')
const Game = () => import('../views/Game.vue')
const Error = () => import('../views/Error.vue')
const LoadUser = () => import('../views/LoadUser.vue')
const RegisterHandle = () => import('../views/RegisterHandle.vue')
const UnregisterHandle = () => import('../views/UnregisterHandle.vue')
const HandleUnavailable = () => import('../views/HandleUnavailable.vue')
const ServerShutdown = () => import('../views/ServerShutdown.vue')
const NotFound = () => import('../views/NotFound.vue')

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
            console.log('User is not yet loaded, redirecting to load user page')
            next({ name: 'LoadUser' })
        }
    }

    next()
})

export default router
