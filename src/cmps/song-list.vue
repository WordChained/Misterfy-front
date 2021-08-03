<template>
  <section class="songs-list-container">
    <ul class="songs-list">
      <draggable
      :delay="400"
      delay-on-touch-only=true
        class="list-group"
        v-model="mySongs"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
        group="songs"
      >
        <li
          class="song-draggable"
          v-for="(song, idx) in mySongs"
          :key="song._id"
        >
          <song-preview :song="song" :idx="idx"  />
        </li>
      </draggable>
    </ul>
  </section>
</template>

<script>
import songPreview from "@/cmps/song-preview";
import draggable from "vuedraggable";
export default {
  data() {
    return {
      stationId: this.$route.params.stationId,
      currSongId: null,
      //   drag: true,
    };
  },
  components: {
    songPreview,
    draggable,
  },
  computed: {
    
    mySongs: {
      get() {
        return this.currStation.songs;
      },
      set(list) {
        this.$store.dispatch({
          type: "setListOrder",
          list,
          stationId: this.stationId,
        });
      },
    },
    currStation() {
      return this.$store.getters.currStation;
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
 
};
</script>

<style>
</style>