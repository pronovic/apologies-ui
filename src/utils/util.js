function sleep(waitMs) {
    return new Promise((resolve) => setTimeout(resolve, waitMs))
}

export { sleep }
