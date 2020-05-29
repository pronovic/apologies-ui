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
                    invalid-feedback="Handle is required"
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
    props: ['id'],
    data() {
        return {
            handle: '',
            handleState: null,
        }
    },
    methods: {
        checkFormValidity() {
            const valid = this.$refs.form.checkValidity()
            this.handleState = valid
            return valid
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

            this.$store.dispatch('registerPlayer', this.handle)

            this.$nextTick(() => {
                this.$bvModal.hide(this.id)
            })
        },
    },
}
</script>
