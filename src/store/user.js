const UserLoadStatus = {
    NOT_LOADED: 'Not Loaded',
    LOADED: 'Loaded',
    UNAVAILABLE: 'Handle Unavailable',
    ERROR: 'Error',
}

// TODO: should probably be a true Javascript class?
const user = {
    loadStatus: UserLoadStatus.NOT_LOADED,
    registered: false,
    player: null,
}

export { UserLoadStatus, user }
