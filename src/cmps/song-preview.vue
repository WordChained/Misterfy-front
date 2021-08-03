<template>
  <section
    @mouseover=" isHover = true"
    @mouseleave="isHover = false"
    class="song-preview"
  >
    <span v-if="narrowMediaQuery||isHover">
      <img
        v-if="!isRunning || song.id !== togglePlayPause"
        @click.stop="play(song.id)"
        class="song-preview-play-btn"
        src="../assets/icons/play-button-triangle.png"
      />
      <img
        v-if="isRunning && song.id === togglePlayPause"
        @click.stop="play(song.id)"
        class="song-preview-pause-btn"
        src="../assets/icons/pause-lines.png"
      />
    </span>
    <span v-else-if="!isHover && song.id === togglePlayPause && isRunning"
      ><equalizer
    /></span>
    <h3 v-else>{{ idx + 1 }}</h3>
    <img class="thumbnail" :src="song.imgUrl" />
    <h3 class="song-title">{{ song.title }}</h3>
    <h3 class="duration">{{ song.duration }}</h3>
    <!-- <button @click.stop="like">
			<img src="../assets/icons/like.png" class="like-song" v-if="!isLiked" />
			<img src="../assets/img/heart.png" class="liked" v-else />
		</button> -->
    <img
      @click.stop="toggleRemove"
      :class="{ removing: isRemove }"
      class="details-btn"
      src="@/assets/icons/ellipsis.png"
    />

    <transition name="slide-in">
      <svg
        v-if="isRemove"
        width="20px"
        class="song-preview-remove-btn"
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="trash-alt"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        @click.stop="openModal"
      >
        <path
          d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"
        ></path>
      </svg>
    </transition>
  </section>
</template>

<script>
import { eventBusService } from "@/services/eventBus-service.js";
import { socketService } from "@/services/socket-service.js";

import equalizer from "@/cmps/equalizer";
export default {
  props: {
    song: {
      type: Object,
    },
    idx: {
      type: Number,
    },
  },
  components: {
    equalizer,
  },
  created() {
    socketService.on("refresh station", this.refreshStation);
    // eventBusService.on("removeSong", this.removeSong);
  },
  data() {
    return {
      isRemove: false,
      isHover: false,
      isLiked: false,
      confirmMsg: null,
    };
  },
  computed: {
    isRunning() {
      return this.$store.getters.isPlaying;
    },
    togglePlayPause() {
      return this.$store.getters.currSongId;
    },
    narrowMediaQuery() {
      return window.matchMedia("(max-width: 600px)").matches;
    },
  },
  methods: {
    play(songId) {
      if (
        this.$store.getters.currSongId &&
        songId !== this.$store.getters.currSongId
      ) {
        this.$store.commit({ type: "loadSongToPlayer", songId });
        this.$store.commit({ type: "setCurrSong", songId });
      } else if (songId === this.$store.getters.currSongId) {
        eventBusService.$emit("togglePlay");
      } else {
        this.$store.commit({ type: "loadSongToPlayer", songId });
        this.$store.commit({ type: "setCurrSong", songId });
      }
    },
    toggleRemove() {
      this.isRemove = !this.isRemove;
    },
    //use socket inside backend controller
    async removeSong() {
      const songId = this.song.id;
      let userMsg = null;
      try {
        await this.$store.dispatch({
          type: "removeSong",
          songId,
        });
        userMsg = {
          txt: "Song Removed",
          type: "success",
        };
      } catch (err) {
        userMsg = {
          txt: "Removing Song Failed!",
          type: "error",
        };
      } finally {
        this.$store.commit({ type: "updateUserMsg", userMsg });
        setTimeout(() => {
          this.$store.commit({ type: "deleteMsg" });
        }, 2000);
      }
    },
    refreshStation(savedStation) {
      this.$store.commit({
        type: "setCurrStation",
        currStation: savedStation,
      });
    },
    openModal() {
      const msg = {
        txt: "Are you sure you want to remove this song?",
        type: "confirm",
        songId: this.song.id,
      };
      eventBusService.$emit("removeSong", msg);
    },
  },
};
</script>
