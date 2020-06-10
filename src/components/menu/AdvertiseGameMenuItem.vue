<template>
    <div>
        <b-dropdown-item
            v-if="visible"
            v-b-modal.advertiseGameModal
            v-b-tooltip.hover.left
            title="Advertise a new game"
            >Advertise Game</b-dropdown-item
        >

        <b-modal
            id="advertiseGameModal"
            ref="modal"
            title="Advertise Game"
            @show="resetModal"
            @hidden="resetModal"
            @ok="handleOk"
        >
            <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group
                    :state="nameState"
                    label="Name"
                    label-for="name-input"
                    invalid-feedback="Enter a name (2-35 characters)"
                >
                    <b-form-input
                        id="name-input"
                        v-model="name"
                        :state="nameState"
                        required
                    ></b-form-input>
                </b-form-group>
                <b-form-group label="Mode" label-for="mode-input">
                    <b-form-select
                        id="mode-input"
                        v-model="mode"
                        :options="modeOptions"
                    ></b-form-select>
                </b-form-group>
                <b-form-group label="Players" label-for="players-input">
                    <b-form-select
                        id="players-input"
                        v-model="players"
                        :options="playerOptions"
                    ></b-form-select>
                </b-form-group>
                <b-form-group label="Visibility" label-for="visibility-input">
                    <b-form-select
                        id="visibility-input"
                        v-model="visibility"
                        :options="visibilityOptions"
                    ></b-form-select>
                </b-form-group>
                <b-form-group
                    label="Invited Handles"
                    label-for="visibility-input"
                >
                    <b-form-tags
                        id="invitedHandles-input"
                        v-model="invitedHandles"
                    ></b-form-tags>
                </b-form-group>
            </form>
        </b-modal>
    </div>
</template>

<script>
import { advertiseGame } from '../../utils/client.js'
import { GameMode, GameVisibility } from '../../utils/constants.js'

export default {
    name: 'AdvertiseGameMenuItem',
    data() {
        return {
            name: '',
            nameState: null,
            mode: GameMode.STANDARD,
            players: 4,
            visibility: GameVisibility.PUBLIC,
            invitedHandles: [],
            modeOptions: [
                { value: GameMode.STANDARD, text: GameMode.STANDARD },
                { value: GameMode.ADULT, text: GameMode.ADULT },
            ],
            playerOptions: [
                { value: 2, text: '2 Players' },
                { value: 3, text: '3 Players' },
                { value: 4, text: '4 Players' },
            ],
            visibilityOptions: [
                { value: GameVisibility.PUBLIC, text: GameVisibility.PUBLIC },
                { value: GameVisibility.PRIVATE, text: GameVisibility.PRIVATE },
            ],
        }
    },
    computed: {
        visible() {
            return !this.$store.getters.isGameJoined
        },
    },
    methods: {
        checkFormValidity() {
            this.nameState =
                this.$refs.form.checkValidity() &&
                this.name.length >= 2 &&
                this.name.length <= 35
            return this.nameState
        },
        resetModal() {
            this.name = ''
            this.nameState = null
            this.mode = GameMode.STANDARD
            this.players = 4
            this.visibility = GameVisibility.PUBLIC
            this.invitedHandles = []
        },
        handleOk(bvModalEvt) {
            bvModalEvt.preventDefault()
            this.handleSubmit()
        },
        handleSubmit() {
            if (!this.checkFormValidity()) {
                return
            }

            const advertised = {
                name: this.name,
                mode: this.mode,
                players: this.players,
                visibility: this.visibility,
                invited_handles: this.invitedHandles.filter((handle) => {
                    return handle !== this.$store.getters.playerHandle
                }),
            }

            this.$nextTick(() => {
                this.$bvModal.hide('advertiseGameModal')
                advertiseGame(advertised)
            })
        },
    },
}
</script>
