import store from '../store'

function requireUnregistered(to, from, next) {
    loadAndRedirect(redirectUnregistered, to, from, next)
}

function requireRegistered(to, from, next) {
    loadAndRedirect(redirectRegistered, to, from, next)
}

function loadAndRedirect(redirect, to, from, next) {
    console.log('Checking user registration enroute to ' + to.path)
    if (store.getters.isUserLoaded) {
        console.log('User is already loaded')
        redirect(to, from, next)
    } else {
        console.log('User is not yet loaded, redirecting to load user page')
        next({ name: 'LoadUser' })
    }
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
