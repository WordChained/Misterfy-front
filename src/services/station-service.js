// import axios from 'axios'
import { httpService } from './http-service.js'
import { utilService } from './util-service.js';
// import { storageService } from './async-storage-service.js'

// const STATION_KEY = 'station'
// const IMG_URL = 'https://is4-ssl.mzstatic.com/image/thumb/Purple124/v4/6a/e4/59/6ae45956-8b3d-0ff2-81f8-587c7c65b515/source/256x256bb.jpg'
export const stationService = {
    query,
    getById,
    remove,
    save,
    getEmptyStation,
    saveSong,
    removeSong,
    saveSongList
}

// const STATION_URL = 'http://127.0.0.1:3030/api/station/'

async function query(filterBy) {
    // let stations = await storageService.query(STATION_KEY)
    // if (!stations || !stations.length) {
    //   stations = gStations
    //   storageService.postMany(STATION_KEY, stations)
    // }
    // return stations

    try {
        const data = await httpService.get(`station`, { filterBy })
            // const data = await httpService.get(`station`, { params: filterBy })
        return data
    } catch (err) {
        console.log('Error on station service =>', err)
    }
}

async function getById(stationId) {
    // const station = await storageService.get(STATION_KEY, stationId)
    // return station
    try {
        const station = await httpService.get(`station/${stationId}`)
        return station
    } catch (err) {
        console.log('Error on station service =>', err)
    }
}

async function remove(stationId) {
    try {
        const removedStation = await httpService.delete(`station/${stationId}`)
        return removedStation
    } catch (err) {
        console.log('Error on station service =>', err)
        throw err;
    }
    // return storageService.remove(STATION_KEY, stationId)

}

async function save(station) {
    // if (station._id) {
    //     const updatedStation = await storageService.put(STATION_KEY, station)
    //     return updatedStation
    // }
    // if (!station.imgUrl) {
    //     station.imgUrl = IMG_URL
    // }
    // const addedStation = await storageService.post(STATION_KEY, station)
    // return addedStation

    // station = JSON.parse(JSON.stringify(station))
    try {
        if (!station._id) {
            const newStation = await httpService.post(`station/`, station)
            return newStation
        } else {
            const updatedStation = await httpService.put(`station/`, station)
            return updatedStation
        }
    } catch (err) {
        console.log('Error on station service =>', err)
        throw err;
    }

    // user = await httpService[method](`station/${station._id}`, station)
    // Handle case in which admin updates other station's details
    // if (getLoggedinUser()._id === station._id) _saveLocalUser(station)
    // }
}

function getEmptyStation() {
    const station = {
        _id: '',
        name: '',
        imgUrl: '',
        description: '',
        tags: [],
        createdAt: Date.now(),
        // createdBy: {},
        likedByUsers: _getRandNum(),
        songs: []
    }
    return station
}

async function saveSong(song, stationId) {
    try {
        const station = await getById(stationId);
        const newSong = {
            id: song.id.videoId,
            title: song.snippet.title,
            imgUrl: song.snippet.thumbnails.high.url.replace('https:', ''),
            addedBy: '',
            duration: song.duration
        };
        station.songs.push(newSong);
        const updatedStation = await save(station)
        return updatedStation
    } catch (err) {
        console.log('Error on station service =>', err)
        throw err;
    }

}

async function removeSong(songId, stationId) {
    try {
        const station = await getById(stationId)
        const idx = station.songs.findIndex(song => song.id === songId)
        station.songs.splice(idx, 1)
        const updatedStation = await save(station)
        return updatedStation
    } catch (err) {
        console.log('Error on station service =>', err)
        throw err;
    }
}

async function saveSongList(list, stationId) {
    try {
        const station = await getById(stationId)
        station.songs = [...list]
        const updatedStation = await save(station)
        return updatedStation;
        // return updatedStation.songs
    } catch (err) {
        console.log('Error on station service =>', err)
    }
}

function _getRandNum() {
    return utilService.getRandomInt(1000, 59999);
}