<template>
    <div>
        <b-navbar
            toggleable="lg"
            type="dark"
            variant="secondary"
            id="gameNavbar"
        >
            <b-navbar-brand ref="brand">Apologies</b-navbar-brand>
            <b-navbar-nav class="ml-auto">
                <StartGameButton></StartGameButton>
                <GameInProgressIndicator></GameInProgressIndicator>
                <ClearGameButton></ClearGameButton>
                <b-nav-text ref="handle" class="text-white font-italic">
                    {{ playerHandle }}
                </b-nav-text>
                <GameMenu></GameMenu>
            </b-navbar-nav>
        </b-navbar>
    </div>
</template>

<script>
import { logger } from 'Utils/util'

import ClearGameButton from 'Components/ClearGameButton.vue'
import GameMenu from 'Components/GameMenu.vue'
import GameInProgressIndicator from 'Components/GameInProgressIndicator.vue'
import StartGameButton from 'Components/StartGameButton.vue'

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
