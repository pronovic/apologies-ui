const UserLoadStatus = {
    NOT_LOADED: 'Not Loaded',
    LOADED: 'Loaded',
    UNAVAILABLE: 'Handle Unavailable',
    ERROR: 'Error',
}

const ServerStatus = {
    SERVER_SHUTDOWN: 'Server Shutdown',
    WEBSOCKET_IDLE: 'Websocket Idle',
    WEBSOCKET_INACTIVE: 'Websocket Inactive',
    WEBSOCKET_ERROR: 'Websocket Error',
    PLAYER_IDLE: 'Player Idle',
    PLAYER_INACTIVE: 'PlayerInactive',
}

const GameStatus = {
    GAME_JOINED: 'Joined Game',
    GAME_STARTED: 'Game Started',
    GAME_CANCELLED: 'Game Cancelled',
    GAME_COMPLETED: 'Game Completed',
    GAME_IDLE: 'Game Idle',
    GAME_INACTIVE: 'Game Inactive',
    PLAYER_QUIT: 'Player Quit',
    DISCONNECTED: 'Disconnected',
}

const Colors = {
    BLUE: '#0099cc',
    RED: '#cc3300',
    GREEN: '#339933',
    YELLOW: '#ffcc00',
    PURPLE: '#666699',
}

export { UserLoadStatus, ServerStatus, GameStatus, Colors }
