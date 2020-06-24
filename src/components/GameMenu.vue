<template>
    <div>
        <b-dropdown size="sm" id="game-menu" no-caret right class="p-0">
            <template v-slot:button-content>
                <b-button size="md" variant="secondary" class="p-1">
                    <b-icon icon="list" aria-label="Menu"></b-icon>
                </b-button>
            </template>
            <UnregisterMenuItem></UnregisterMenuItem>
            <b-dropdown-divider></b-dropdown-divider>
            <JoinGameMenuItem></JoinGameMenuItem>
            <AdvertiseGameMenuItem></AdvertiseGameMenuItem>
            <QuitGameMenuItem></QuitGameMenuItem>
            <CancelGameMenuItem></CancelGameMenuItem>
            <ClearGameMenuItem></ClearGameMenuItem>
            <ToggleAutoplayMenuItem></ToggleAutoplayMenuItem>
        </b-dropdown>
    </div>
</template>

<script>
import AdvertiseGameMenuItem from 'Components/menu/AdvertiseGameMenuItem.vue'
import CancelGameMenuItem from 'Components/menu/CancelGameMenuItem.vue'
import ClearGameMenuItem from 'Components/menu/ClearGameMenuItem.vue'
import JoinGameMenuItem from 'Components/menu/JoinGameMenuItem.vue'
import QuitGameMenuItem from 'Components/menu/QuitGameMenuItem.vue'
import UnregisterMenuItem from 'Components/menu/UnregisterMenuItem.vue'
import ToggleAutoplayMenuItem from 'Components/menu/ToggleAutoplayMenuItem.vue'

export default {
    name: 'GameMenu',
    components: {
        AdvertiseGameMenuItem: AdvertiseGameMenuItem,
        CancelGameMenuItem: CancelGameMenuItem,
        ClearGameMenuItem: ClearGameMenuItem,
        JoinGameMenuItem: JoinGameMenuItem,
        QuitGameMenuItem: QuitGameMenuItem,
        UnregisterMenuItem: UnregisterMenuItem,
        ToggleAutoplayMenuItem: ToggleAutoplayMenuItem,
    },
}
</script>
