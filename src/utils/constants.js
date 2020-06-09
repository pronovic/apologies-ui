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

const GameMode = {
    STANDARD: 'STANDARD',
    ADULT: 'ADULT',
}

const GameVisibility = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE",',
}

const PlayerState = {
    QUIT: 'QUIT',
    DISCONNECTED: 'DISCONNECTED',
}

const Colors = {
    BLACK: 'black',
    WHITE: 'white',
    GREY: '#cccccc',
    PURPLE: '#666699',
    OFF_WHITE: '#f4f3db',
    BLUE: '#0099cc',
    LIGHT_BLUE: '#e6f9fe',
    RED: '#cc3300',
    LIGHT_RED: '#fed9cd',
    GREEN: '#339933',
    LIGHT_GREEN: '#ecf9ec',
    YELLOW: '#ffcc00',
    LIGHT_YELLOW: '#fff5cc',
}

const Cards = {
    CARD_1: 'CARD_1',
    CARD_2: 'CARD_2',
    CARD_3: 'CARD_3',
    CARD_4: 'CARD_4',
    CARD_5: 'CARD_5',
    CARD_7: 'CARD_7',
    CARD_8: 'CARD_8',
    CARD_10: 'CARD_10',
    CARD_11: 'CARD_11',
    CARD_12: 'CARD_12',
    CARD_APOLOGIES: 'CARD_APOLOGIES',
}

export {
    UserLoadStatus,
    ServerStatus,
    GameStatus,
    GameMode,
    GameVisibility,
    PlayerState,
    Colors,
    Cards,
}
