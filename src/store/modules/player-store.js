export const playerStore = {
  strict: true,
  state: {
    currSongId: '',
    currSong: null,
    isPlaying: false
  },
  getters: {
    currSongId(state) { return state.currSongId },
    currSong(state) { return state.currSong },
    isPlaying(state) { return state.isPlaying }
  },
  mutations: {
    loadSongToPlayer(state, { songId }) {
      state.currSongId = songId
    },
    setCurrSong(state) {
      const currSongId = this.getters.currSongId
      const currStation = this.getters.currStation
      const currSong = currStation.songs.find(song => song.id === currSongId)
      state.currSong = currSong
    },
    clearCurrSong(state) {
      state.currSong = {}
      state.currSongId = ''
    },
    nextSong(state) {
      const currStation = this.getters.currStation
      let idx = currStation.songs.findIndex(song => song.id === state.currSongId)
      if (idx === currStation.songs.length - 1) idx = -1
      const nextSong = currStation.songs[idx + 1]
      state.currSongId = nextSong.id
    },
    prevSong(state) {
      const currStation = this.getters.currStation
      let idx = currStation.songs.findIndex(song => song.id === state.currSongId)
      if (!idx) idx = 1
      const nextSong = currStation.songs[idx - 1]
      state.currSongId = nextSong.id
    },
    isPlaying(state, { action }) {
      if (action) state.isPlaying = true
      else state.isPlaying = false
    },
  },
  actions: {

  }
}
