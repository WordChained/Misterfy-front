import { httpService } from './http-service.js'
import { stationService } from './station-service.js';

export const chatService = {
    query,
    add,
    getEmptyMsg,
    clearChatMsgs
}

async function query(stationId) {
    const station = await stationService.getById(stationId);
    return await station.msgs;
}
async function add(newMsg) {
    newMsg.sentAt = Date.now()
    try {
        httpService.post('station/chat/' + newMsg.stationId, newMsg);
    } catch (err) {
        console.log('Error on chat service =>', err)
    }
}

function getEmptyMsg() {
    return {
        from: {
            name: 'guest',
        },
        txt: ""
    }
}

async function clearChatMsgs(stationId) {
    const station = await stationService.getById(stationId);
    station.msgs = [];
    const updatedStation = await stationService.save(station);
    return updatedStation;

}

(async() => {
    // Dev Helper: Listens to when localStorage changes in OTHER browser

    // Here we are listening to changes for the station (comming from other browsers)
    window.addEventListener('storage', async() => {
        // if (!gWatchedStation) return;
        // const freshMsgs = await storageService.query(CHAT_KEY)
        // socketService.emit('chat new msg', freshMsgs)
        // const watchedStation = freshStations.find(station => station._id === gWatchedStation._id)
        // if (!watchedStation) return;
        // if (gWatchedUser.score !== watchedStation.score) {
        //     console.log('Watched user score changed - localStorage updated from another browser')
        //     socketService.emit(SOCKET_EVENT_USER_UPDATED, watchedStation)
        // }
        // gWatchedUser = watchedStation
    })
})()