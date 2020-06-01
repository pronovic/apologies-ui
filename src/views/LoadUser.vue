<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="secondary">
            <b-navbar-brand href="#">Apologies</b-navbar-brand>
        </b-navbar>

        <b-jumbotron class="w-50 mx-auto" bg-variant="white">
            <template v-slot:header
                >Please Wait
                <b-icon
                    icon="arrow-clockwise"
                    animation="spin"
                    font-scale="1"
                ></b-icon
            ></template>

            <template v-slot:lead>
                Please wait while we load your existing user registration.
            </template>
        </b-jumbotron>
    </div>
</template>

<script>
import disconnectSocket from '../utils/client.js'

export default {
    name: 'LoadUser',
    components: {},
    data() {
        return {
            timer: null,
        }
    },
    created: function () {
        this.timer = setInterval(this.timeout, 15000)

        // TODO: this isn't right - subscriptions are global, so we're double-subscribing
        // these need to somehow be global, I think.  then the page basically errors out if
        // it still exists after 15 seconds and if the right event happens, we'll just go
        // somewhere else.   I think that's why I was getting duplicate redirect errors
        // below.  I shouldn't need to wrap the router push in a conditional.  We can
        // subscribe to actions as well as mutations, so that might make more sense.  I
        // think I need to be more careful about how the actions and mutations are composed.
        // They need to be finter-grained, I think - or need to somehow better map to the
        // actions that actually occur.  Right now, we use "not registered" to mean
        // several different things ("no user found", "player unregisterd", etc.) and
        // that's confusing.  I need to go back and define the actual actions, which then
        // might map to a smaller set of mutations, and then I can subscribe to whatever
        // ones make the most sense - might be either mutations or actions, but probably
        // not both.   (See https://vuex.vuejs.org/api/#subscribe)

        // At this point, I am still thinking that the local storage stuff belongs *outside*
        // of vuex store state, because it doesn't strictly have anything to do with the
        // store itself (which is application state).  This article follows a pattern of
        // manually persisting some state to local storage:
        // https://www.mikestreety.co.uk/blog/vue-js-using-localstorage-with-the-vuex-store
        // There is also the option of the vuex-persist package that persists the entire vuex
        // state to storage, but I'm not sure that is the right pattern to follow, because
        // the state by itself doesn't give us everything we need - we also need to know
        // whether the websocket connection is up, etc.  So I think that I am better off
        // persisting a bare minimum of state and re-bootstrapping the application based
        // on that state.  But, as discussed above, I think the composition of my mutations
        // and actions is wrong.  I've kind of got the mechanics down (I know how to trigger
        // stuff to register/unregister in general) but it's just not structured right.

        this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'markPlayerRegistered') {
                if (this.$route.name !== 'Game') {
                    console.log(
                        'Player is registered; redirecting to game page'
                    )
                    this.$router.push({ name: 'Game' })
                }
            } else if (mutation.type === 'markPlayerNotRegistered') {
                if (this.$route.name !== 'Landing') {
                    console.log(
                        'Player not registered; redirecting to landing page'
                    )
                    this.$router.push({ name: 'Landing' })
                }
            } else if (mutation.type === 'markPlayerHandleUnavailable') {
                if (this.$route.name !== 'HandleUnavailable') {
                    console.log(
                        'Failed to register player: handle is not available'
                    )
                    this.$router.push({ name: 'HandleUnavailable' })
                }
            } else if (mutation.type === 'markPlayerError') {
                if (this.$route.name !== 'Error') {
                    console.log('Failed to register player: general error')
                    this.$router.push({ name: 'Error' })
                }
            }
        })

        this.$store.dispatch('loadUser')
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    methods: {
        timeout() {
            console.log(
                'Failed to load user after 15000ms; disconnecting socket'
            )
            clearInterval(this.timer)
            disconnectSocket()
            this.$router.push({ name: 'Error' })
        },
    },
}
</script>
