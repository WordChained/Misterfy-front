<template>
  <section class="player-img" v-if="station && currSong" @click="goStation">
    <img :src="currSong.imgUrl" />
  </section>
</template>
<script>
export default {
  computed: {
    currSong() {
      return this.$store.getters.currSong;
    },
    currSongImg() {
      const currSong = this.$store.getters.currSong;
      const { imgUrl } = currSong;
      return imgUrl;
    },
    station() {
      const stations = this.$store.getters.stationsToDisplay;
      return stations.find((station) =>
        station.songs.some((song) => song.id === this.currSong.id)
      );
    },
  },
  methods: {
    goStation() {
      if (this.station) {
        this.$store.commit({
          type: "setCurrStation",
          currStation: this.station,
        });
        this.$router.push("/details/" + this.station._id).catch((err) => {
          //When same route appears
          if (err.name != "NavigationDuplicated") {
            throw err;
          }
        });
      }
    },
  },
};
</script>