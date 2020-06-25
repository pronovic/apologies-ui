<template>
    <div>
        <b-dropdown-item
            ref="dropdown"
            v-if="visible"
            v-b-modal.joinGameModal
            v-b-tooltip.hover.left
            title="Join a previously-advertised game"
            >Join Game</b-dropdown-item
        >

        <!-- static is needed for tests to work, but doesn't work properly in live application -->
        <b-modal
            ref="modal"
            id="joinGameModal"
            :static="unittest"
            title="Join Game"
            ok-only
            size="xl"
            hide-footer
            @show="resetModal"
        >
            <b-container fluid>
                <b-row class="my-1">
                    <b-col cols="5">
                        <b-form-group
                            label="Filter"
                            label-for="filterInput"
                            label-size="sm"
                            label-cols-sm="1"
                            label-align-sm="right"
                        >
                            <b-input-group size="sm">
                                <b-form-input
                                    v-model="filter"
                                    type="search"
                                    id="filterInput"
                                    placeholder="Type to Search"
                                ></b-form-input>
                            </b-input-group>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-container>
            <b-table
                small
                striped
                bordered
                outlined
                head-variant="dark"
                table-variant="light"
                per-page="15"
                show-empty
                empty-text="There are no games available for you to join"
                empty-filtered-text="No games meet your filter criteria"
                :filter="filter"
                :current-page="currentPage"
                :items="games"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
            >
                <template v-slot:cell(actions)="row">
                    <b-button
                        size="sm"
                        @click="joinGame(row.item.game_id)"
                        class="mr-1"
                        >Join Game</b-button
                    >
                </template>
            </b-table>
            <b-pagination
                v-model="currentPage"
                :total-rows="rows"
                :per-page="15"
                size="sm"
                align="right"
            ></b-pagination>
        </b-modal>
    </div>
</template>

<script>
import { logger } from 'Utils/util'
import { joinGame, listAvailableGames } from 'Utils/client'

export default {
    name: 'JoinGameMenuItem',
    props: ['unittest'],
    data() {
        return {
            sortBy: 'game',
            sortDesc: false,
            currentPage: 1,
            filter: null,
            fields: [
                {
                    key: 'advertiser_handle',
                    label: 'Advertiser',
                    sortable: true,
                    sortDirection: 'asc',
                },
                {
                    key: 'name',
                    label: 'Game',
                    sortable: true,
                    sortDirection: 'asc',
                },
                {
                    key: 'players',
                    label: 'Players',
                    sortable: true,
                    sortDirection: 'asc',
                },
                {
                    key: 'available',
                    label: 'Remaining',
                    sortable: true,
                    sortDirection: 'asc',
                },
                {
                    key: 'invited_handles',
                    label: 'Invited?',
                    formatter: (value, key, item) => {
                        return value != null &&
                            value.includes(this.$store.getters.playerHandle)
                            ? 'Yes'
                            : 'No'
                    },
                    sortable: true,
                    sortByFormatted: true,
                    filterByFormatted: true,
                },
                { key: 'actions', label: 'Actions' },
            ],
        }
    },
    computed: {
        visible() {
            return !this.$store.getters.isGameJoined
        },
        rows() {
            return this.$store.getters.availableGames.length
        },
        games() {
            return this.$store.getters.availableGames
        },
    },
    methods: {
        resetModal() {
            this.sortBy = 'game'
            this.sortDesc = false
            this.currentPage = 1
            this.filter = null
            listAvailableGames() // will eventually fill them in
        },
        joinGame(gameId) {
            logger.info('Player selected game: ' + gameId)
            this.$nextTick(() => {
                this.$bvModal.hide('joinGameModal')
                joinGame(gameId)
            })
        },
    },
}
</script>
