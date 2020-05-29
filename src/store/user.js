const UserLoadStatus = {
    NOT_LOADED: 'Not Loaded',
    LOADED: 'Loaded',
    FAILED: 'Failed',
}

const user = {
    loadStatus: UserLoadStatus.NOT_LOADED,
    registered: false,
}

export { UserLoadStatus, user }
