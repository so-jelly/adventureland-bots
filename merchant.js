function mainLoop() {
    try {

    } catch (e) {

    }
    setTimeout(() => {
        mainLoop()
    }, Math.max(250, parent.character.ping))
}

function attackLoop() {
    try {

    } catch (e) {

    }
    setTimeout(() => {
        attackLoop()
    }, Math.max(250, parent.character.ping))
}

mainLoop()
attackLoop()