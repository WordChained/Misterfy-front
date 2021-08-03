<template>
  <div id="app" class="main-layout">
    <template>
      <app-header />
      <user-msg />
      <router-view />
      <section class="player-container" v-if="currSong">
        <player-img />
        <player :key="this.$store.getters.currSongId" />
      </section>
    </template>
<app-footer v-if="isAbout"/>
  </div>
</template>

<script>
import appHeader from "@/cmps/app-header";
import playerImg from "@/cmps/player-img";
import player from "@/cmps/player";
import userMsg from "@/cmps/user-msg";
import appFooter from '@/cmps/app-footer'
export default {
  components: {
    appHeader,
    playerImg,
    player,
    userMsg,
    appFooter,
  },
  async created() {
   await this.$store.dispatch({ type: "loadStations" });
  },
  computed: {
    currSong() {
      return this.$store.getters.currSong;
    },
    isAbout(){
      return this.$route.name === 'About'
    }

  },

};
</script>


