<template>
    <div>
        <b-navbar
            toggleable="lg"
            type="dark"
            variant="secondary"
            id="gameNavbar"
        >
            <b-navbar-brand>Apologies</b-navbar-brand>
            <b-navbar-nav class="ml-auto">
                <StartGameButton></StartGameButton>
                <GameInProgressIndicator></GameInProgressIndicator>
                <ClearGameButton></ClearGameButton>
                <b-nav-text this.class="text-white"
                    ><em>{{ playerHandle }}</em></b-nav-text
                >
                <GameMenu></GameMenu>
            </b-navbar-nav>
        </b-navbar>
    </div>
</template>

<script>
import { logger } from '../utils/util.js'

import ClearGameButton from '../components/ClearGameButton.vue'
import GameMenu from '../components/GameMenu.vue'
import GameInProgressIndicator from '../components/GameInProgressIndicator.vue'
import StartGameButton from '../components/StartGameButton.vue'

export default {
    name: 'GameNavbar',
    components: {
        GameMenu: GameMenu,
        StartGameButton: StartGameButton,
        GameInProgressIndicator: GameInProgressIndicator,
        ClearGameButton: ClearGameButton,
    },
    mounted() {
        this.$nextTick(() => {
            logger.debug('Game navbar mounted')
            this.$store.dispatch(
                'handleHeaderHeightChange',
                this.$el.clientHeight
            )
        })
    },
    computed: {
        playerHandle() {
            return this.$store.getters.playerHandle
        },
    },
}
</script>
