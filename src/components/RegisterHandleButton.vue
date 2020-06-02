<template>
    <div>
        <b-button v-b-modal="id" variant="primary">Register</b-button>

        <b-modal
            :id="id"
            ref="modal"
            title="Register Handle"
            @show="resetModal"
            @hidden="resetModal"
            @ok="handleOk"
        >
            <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group
                    :state="handleState"
                    label="Handle"
                    label-for="handle-input"
                    invalid-feedback="Enter a handle (2-20 characters)"
                >
                    <b-form-input
                        id="handle-input"
                        v-model="handle"
                        :state="handleState"
                        required
                    ></b-form-input>
                </b-form-group>
            </form>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'RegisterHandleButton',
    props: ['id'],
    data() {
        return {
            handle: '',
            handleState: null,
        }
    },
    methods: {
        checkFormValidity() {
            this.handleState =
                this.$refs.form.checkValidity() &&
                this.handle.length >= 2 &&
                this.handle.length <= 20
            return this.handleState
        },
        resetModal() {
            this.handle = ''
            this.handleState = null
        },
        handleOk(bvModalEvt) {
            bvModalEvt.preventDefault()
            this.handleSubmit()
        },
        handleSubmit() {
            if (!this.checkFormValidity()) {
                return
            }

            this.$nextTick(() => {
                this.$bvModal.hide(this.id)
                this.$router.push({
                    name: 'RegisterHandle',
                    params: { handle: this.handle },
                })
            })
        },
    },
}
</script>
