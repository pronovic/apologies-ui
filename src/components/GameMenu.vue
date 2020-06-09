<template>
    <div>
        <b-dropdown size="sm" id="dropdown-1" no-caret right class="p-0">
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
            <RunDemoGameMenuItem></RunDemoGameMenuItem>
        </b-dropdown>
    </div>
</template>

<script>
import AdvertiseGameMenuItem from './menu/AdvertiseGameMenuItem.vue'
import CancelGameMenuItem from './menu/CancelGameMenuItem.vue'
import ClearGameMenuItem from './menu/ClearGameMenuItem.vue'
import JoinGameMenuItem from './menu/JoinGameMenuItem.vue'
import QuitGameMenuItem from './menu/QuitGameMenuItem.vue'
import UnregisterMenuItem from './menu/UnregisterMenuItem.vue'
import RunDemoGameMenuItem from './menu/RunDemoGameMenuItem.vue'

export default {
    name: 'GameMenu',
    components: {
        AdvertiseGameMenuItem: AdvertiseGameMenuItem,
        CancelGameMenuItem: CancelGameMenuItem,
        ClearGameMenuItem: ClearGameMenuItem,
        JoinGameMenuItem: JoinGameMenuItem,
        QuitGameMenuItem: QuitGameMenuItem,
        UnregisterMenuItem: UnregisterMenuItem,
        RunDemoGameMenuItem: RunDemoGameMenuItem,
    },
}
</script>
