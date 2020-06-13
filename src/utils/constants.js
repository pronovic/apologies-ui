/** The status of a user in the web UI. */
const UserLoadStatus = {
    NOT_LOADED: 'Not Loaded',
    LOADED: 'Loaded',
    UNAVAILABLE: 'Handle Unavailable',
    ERROR: 'Error',
}

/** The status of the backend websocket server. */
const ServerStatus = {
    SERVER_SHUTDOWN: 'Server Shutdown',
    WEBSOCKET_IDLE: 'Websocket Idle',
    WEBSOCKET_INACTIVE: 'Websocket Inactive',
    WEBSOCKET_ERROR: 'Websocket Error',
    PLAYER_IDLE: 'Player Idle',
    PLAYER_INACTIVE: 'PlayerInactive',
}

/** The status of a game. */
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

/** Game modes. */
const GameMode = {
    STANDARD: 'STANDARD',
    ADULT: 'ADULT',
}

/** Game visibilities. */
const GameVisibility = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE',
}

/** Player states. */
const PlayerState = {
    QUIT: 'QUIT',
    DISCONNECTED: 'DISCONNECTED',
}

/** Player types. */
const PlayerType = {
    HUMAN: 'HUMAN',
    PROGRAMMATIC: 'PROGRAMMATIC',
}

/** Player colors. */
const PlayerColor = {
    RED: 'RED',
    YELLOW: 'YELLOW',
    BLUE: 'BLUE',
    GREEN: 'GREEN',
}

/** HTML colors for squares, pawns, etc. */
const Colors = {
    BLACK: 'black',
    WHITE: 'white',
    GREY: '#cccccc',
    PURPLE: '#666699',
    MAGENTA: '#ff00ff',
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

/** Cards available to be played. */
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
    PlayerType,
    PlayerColor,
    Colors,
    Cards,
}
