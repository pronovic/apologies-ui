import store from '../store'
import { UserLoadStatus } from '../store/user.js'

function requireUnregistered(to, from, next) {
    loadAndRedirect(redirectUnregistered, to, from, next)
}

function requireRegistered(to, from, next) {
    loadAndRedirect(redirectRegistered, to, from, next)
}

function loadAndRedirect(redirect, to, from, next) {
    console.log('Checking user registration enroute to ' + to.path)
    if (store.getters.userLoadStatus === UserLoadStatus.LOADED) {
        console.log('User is already loaded, passing off to redirect function')
        redirect(to, from, next)
    } else {
        console.log('User is not yet loaded; loading now')
        store.dispatch('loadUser')
        store.watch(
            () => store.getters.userLoadStatus,
            (userLoadStatus) => {
                switch (userLoadStatus) {
                    case UserLoadStatus.LOADED:
                        console.log(
                            'User is now loaded, passing off to redirect function'
                        )
                        redirect(to, from, next)
                        break
                    case UserLoadStatus.FAILED:
                        console.log('Failed to load user, redirecting to error')
                        redirectError(to, from, next)
                        break
                    default:
                        break
                }
            }
        )
    }
}

function redirectError(to, from, next) {
    console.log('Failed to load user, redirecting to error page')
    next({
        name: 'UserError',
    })
}

function redirectUnregistered(to, from, next) {
    if (store.getters.isUserRegistered) {
        console.log('User is registered, redirecting to game page')
        next({
            name: 'Game',
        })
    } else {
        console.log('User is not registered, continuing to ' + to.path)
        next()
    }
}

function redirectRegistered(to, from, next) {
    if (store.getters.isUserRegistered) {
        console.log('User is registered, continuing to ' + to.path)
        next()
    } else {
        console.log('User is not registered, redirecting to landing page')
        next({
            name: 'Landing',
        })
    }
}

export { requireUnregistered, requireRegistered }
