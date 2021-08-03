<template>
  <section v-if="results" class="song-results">
    <draggable v-model="myList" v-bind="dragOptions" :delay="400"
      delay-on-touch-only=true>
      <div
        v-for="song in results"
        :key="song.id.videoId"
        @end="addSong(this.song)"
        class="search-result"
        @click.stop="addSong(song)"
        @mousedown="getCurrSong(song)"
      >
        {{ song.snippet.title }}
      </div>
    </draggable>
  </section>
</template>

<script>
import draggable from "vuedraggable";
// import {socketService} from "@/services/socket-service.js";
// import { youtubeService } from '@/services/youtube-service.js'

export default {
  components: {
    draggable,
  },
  props: {
    results: {
      type: Array,
    },
  },
  data() {
    return {
      song: "",
    };
  },
  created(){
  
  },
  computed: {
    myList: {
      get() {
        // console.log(this.$store.state.stationStore.currStation.songs);
        return this.$store.state.stationStore.currStation.songs;
      },
      set() {
        this.addSong(this.song);
      },
    },
    dragOptions() {
      return {
        animation: 300,
        group: "songs",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
  methods: {
    async addSong(song) {
      const { stationId } = this.$route.params;
        this.$store.dispatch({ type: "addSong", song, stationId })
    },
    getCurrSong(song) {
      this.song = song;
    },
  },
}
</script>
