import { stationService } from "@/services/station-service.js";
import { youtubeService } from "../../services/youtube-service";
import { socketService } from '../../services/socket-service';
// import { RegExp } from 'core-js/web';

export const stationStore = {
    strict: true,
    state: {
        stations: [],
        filteredStations: [],
        tags: [],
        currStation: null,
        currSong: null,
        filterBy: { name: '', tag: '' },
        sortBy: { tags: [] }
    },
    getters: {
        allStations({ stations }) { return stations },
        stationsToDisplay({ filteredStations }) { return filteredStations },
        tags({ stations }) {
            const tags = stations.reduce(
                (acc, station) => {
                    acc.push(...station.tags);
                    return acc;
                }, []
            );
            return new Set(tags);
        },
        currStation(state) { return state.currStation },
        filterBy(state) { return state.filterBy },
        sortBy(state) { return state.sortBy },
        likedByUsers(state) { return state.currStation.likedByUsers }
    },
    mutations: {
        setStations(state, { stations }) {
            state.stations = stations
        },
        seFilteredtStations(state, { filteredStations }) {
            state.filteredStations = filteredStations
        },
        setTags(state, { tags }) {
            state.tags = tags;
        },
        setFilter(state, { filterBy = { name: '', tag: '' } }) {
            state.filterBy = filterBy
        },
        removeStation(state, { stationId }) {
            const idx = state.stations.findIndex(station => station._id === stationId)
            state.stations.splice(idx, 1)
        },
        saveSong(state, { updatedStation }) {
            const idx = state.stations.findIndex(station => station._id === updatedStation._id)
            state.stations.splice(idx, 1, updatedStation)
            state.currStation = updatedStation
        },
        removeSong(state, { updatedStation }) {
            const idx = state.stations.findIndex(station => station._id === updatedStation._id)
            state.stations.splice(idx, 1, updatedStation)
            state.currStation = updatedStation
        },
        setCurrStation(state, { currStation }) {
            state.currStation = currStation
        },
        addStation(state, { updatedStation }) {
            state.stations.push(updatedStation)
            state.currStation = updatedStation;
        },
        updateStation(state, { updatedStation }) {
            const idx = state.stations.findIndex(station => station._id === updatedStation._id);
            if (idx > -1) state.stations.splice(idx, 1, updatedStation);
        },
        setListOrder(state, { list }) {
            state.currStation.songs = list
                //Reactive stations list
            const idx = state.stations.findIndex(station => station._id === state.currStation._id)
            state.stations.splice(idx, 1, state.currStation)
        }
    },
    actions: {
        async loadStations({ commit, state }) {
            try {
                const data = await stationService.query(state.filterBy)
                commit({ type: 'setStations', stations: data.stations })
                commit({ type: 'seFilteredtStations', filteredStations: data.filteredStations })
                return data;
            } catch (err) {
                console.log('Error on loadStations =>', err)
            }
        },
        async removeStation({ commit }, { stationId }) {
            try {
                await stationService.remove(stationId)
                commit({ type: 'removeStation', stationId })
            } catch (err) {
                console.log('Error on removeStation =>', err)
                throw err;
            }
        },
        async saveStation({ commit }, { station }) {
            try {
                const type = (station._id) ? 'updateStation' : 'addStation'
                const updatedStation = await stationService.save(station)
                commit({ type, updatedStation })
                return updatedStation;
            } catch (err) {
                console.log('Error on saveStation =>', err)
                throw err;
            }
        },
        async setFilter({ commit }, { sortBy, filterBy }) {
            try {
                const stations = await stationService.query(filterBy, sortBy)
                commit({ type: 'setFilter', sortBy, filterBy, stations })
                    // commit({ type: 'setStations', stations })
            } catch (err) {
                console.log('Error on setFilter =>', err)
            }
        },
        async addSong({ commit }, { song, stationId }) {
            const currStation = this.getters.currStation
            const isExist = currStation.songs.find(s => s.id === song.id.videoId)
            if (isExist) {
                var userMsg = {
                    txt: 'Song is already exist :]',
                    type: 'success'
                }
                this.commit({ type: "updateUserMsg", userMsg })
                setTimeout(() => {
                    this.commit({ type: "deleteMsg" })
                }, 2000)
                return
            }
            try {
                song.duration = await youtubeService.getDuration(song.id.videoId)
                song.snippet.title = await youtubeService.getTitle(song.snippet.title)
                const updatedStation = await stationService.saveSong(song, stationId)
                commit({ type: 'saveSong', updatedStation })
                socketService.emit('station updated', updatedStation)
                userMsg = {
                    txt: "Song Added",
                    type: "success",
                }
            } catch (err) {
                userMsg = {
                    txt: "Adding song Failed",
                    type: "error",
                }
                console.log('Error on addSong =>', err)
                throw err;
            } finally {
                this.commit({ type: "updateUserMsg", userMsg })
                setTimeout(() => {
                    this.commit({ type: "deleteMsg" })
                }, 2000)
            }
        },
        async removeSong({ state, commit }, { songId }) {
            try {
                const updatedStation = await stationService.removeSong(songId, state.currStation._id)
                commit({ type: 'removeSong', updatedStation })
                socketService.emit('station updated', updatedStation);
                return updatedStation;
            } catch (err) {
                console.log('Error on removeSong =>', err)
                throw err;
            }
        },
        async currStation({ commit }, { stationId }) {
            try {
                const currStation = await stationService.getById(stationId)
                commit({ type: 'setCurrStation', currStation })
            } catch (err) {
                console.log('Error on currStation =>', err)
            }
        },
        async setListOrder({ commit }, { list, stationId }) {
            commit({ type: 'setListOrder', list })
            try {
                const updatedStation = await stationService.saveSongList(list, stationId)
                socketService.emit('station updated', updatedStation);
            } catch (err) {
                console.log('Error on setListOrder =>', err)
            }
        }
    }
};