<template>
  <!-- <section> -->
    <section
      ref="grid"
      class="station-details"
      v-if="currStation && stationId === currStation._id"
    >
      <button title="Chat with others who view this station"
        class="btn-open-chat"
        v-if="!isChatOpened"
        @click="isChatOpened = true"
      >
        <img src="../assets/icons/chat-bubbles-with-ellipsis.png" />
      </button>
      <div v-if="confirmMsg || isChatOpened" class="screen-cover"></div>
      <chat
        :stationId="stationId"
        class="section-details-chat"
        :class="{ 'chat-opened': isChatOpened }"
        @closeChat="closeChat"
      />
      <img ref="img" class="station-details-img" :src="currStation.imgUrl" v-if="currStation.imgUrl"  />
      <img ref="img" class="station-details-img" src="../assets/img/station-img.jpg" v-else  />
      <section v-if="currStation" class="station-details-info">
        <h2 class="title">{{ currStation.name }}</h2>
     <section class="station-details-extras" :class="{opened:isInfoExtrasOpen}">
          <h4 class="tags">Genres: {{ getTags }}</h4>
        <h4 class="author">
          Created By: <span>{{ currStation.createdBy.username }}</span>
        </h4>
        <h4 class="listeners">Listeners: {{ formatNumber(currStation.likedByUsers+getRandNum) }}</h4>
        <h4 class="details-likes-count"><img class="details-like-count-heart" src="../assets/icons/like.png" />
       {{ formatNumber(currStation.likedByUsers) }}</h4>
     </section>
        <img  class="station-info-extras" title="Display more" src="../assets/icons/info.png" @click="toggleInfoExtras">
        <div class="share-options">
          <ShareNetwork
            network="facebook"
            :url="getUrl"
            title="Check out my station!"
            description="This is a cool playlist i made and i think you might like"
            quote="Listening is Everything"
            hashtags="music"
          >
            <img
              class="facebook-icon"
              src="../assets/social-icons/facebook.png"
            />
          </ShareNetwork>
          <ShareNetwork
            network="whatsapp"
            :url="getUrl"
            title="Check out my station!"
            description="This is a cool playlist i made and i think you might like"
            quote="Listening is Everything"
          >
            <img
              class="whatsapp-icon"
              src="../assets/social-icons/whatsapp.png"
            />
          </ShareNetwork>
        </div>
      </section>
      <song-list-options
        @search="search"
        @opened="opened"
        @removeStation="openModal"
      />

      <template v-if="confirmMsg">
        <modal
          :msg="confirmMsg"
          @closeModal="confirmMsg = null"
          @setOk="setOk"
        />
      </template>
      <section class="station-list-container" :class="{ open: isOpen }">
        <song-list :songs="currStation.songs" />
      </section>
      <vue-particles
        style="z-index: -1; height: 90%; width: 100%; position: absolute"
        color="#dedede"
      ></vue-particles>
    </section>
    <!-- <section v-else >
      <div class="loader">
        <div class="loader__bar"></div>
        <div class="loader__bar"></div>
        <div class="loader__bar"></div>
        <div class="loader__bar"></div>
        <div class="loader__bar"></div>
        <div class="loader__ball"></div>
      </div>
    </section> -->
  <!-- </section> -->
</template>

<script>
import { youtubeService } from "@/services/youtube-service.js";
import { eventBusService } from "@/services/eventBus-service.js";
import { utilService } from "@/services/util-service.js";
import songListOptions from "@/cmps/song-list-options.vue";
import songList from "@/cmps/song-list";
import chat from "@/cmps/chat";
import modal from "@/cmps/modal";
import { socketService } from "@/services/socket-service.js";
export default {
	async created() {
		socketService.on("station updated", this.updateStation);
		const { stationId } = this.$route.params;
		try {
			await this.$store.dispatch({ type: "currStation", stationId });
			socketService.emit("station watch", stationId);
			eventBusService.$on("removeSong", this.openModal)
			eventBusService.$on("loginMsg", this.openModal)
		} catch (err) {
			console.log("Error on curr station dispatch =>", err);
		}
	},
	data() {
		return {
			isSearch: false,
			isOpen: false,
			mainColor: null,
			likedStations: [],
			confirmMsg: null,
			isSharing: false,
			isChatOpened: false,
      isInfoExtrasOpen:false
		};
	},

  computed: {
    getUrl() {
      return `https://misterfy.herokuapp.com/#/details/${this.currStation._id}`;
    },
    getRandNum() {
      return utilService.getRandomInt(10, 9999);
    },
    stationId() {
      return this.$route.params.stationId;
    },
    getTags() {
      return this.currStation.tags.join(",");
    },
    currStation() {
      return this.$store.getters.currStation;
    },
    mainImg() {
      return this.$store.getters.currStation.imgUrl;
    },
    getMainColor() {
      return this.mainColor;
    },
  },

  methods: {
    toggleSharing() {
      this.isSharing = !this.isSharing;
    },
    async search(query) {
      try {
        await youtubeService.query(query);
      } catch (err) {
        console.log("Error on YouTube query =>", err);
      }
    },
    async removeStation() {
      const { stationId } = this.$route.params;
      let userMsg = {};
      try {
        await this.$store.dispatch({ type: "removeStation", stationId });
        this.$store.commit({ type: "clearCurrSong" });
        userMsg = {
          txt: "Station Removed",
          type: "success",
        };
        this.$router.push("/");
      } catch (err) {
        userMsg = {
          txt: "Removing station failed",
          type: "error",
        };
      } finally {
        this.$store.commit({ type: "updateUserMsg", userMsg });
        setTimeout(() => {
          this.$store.commit({ type: "deleteMsg" });
        }, 2000);
      }
    },
    opened() {
      this.isOpen = !this.isOpen;
    },

    updateStation(updatedStation) {
      this.$store.commit({
        type: "setCurrStation",
        currStation: updatedStation,
      });
    },
    openModal(msg) {
      this.confirmMsg = msg;
    },
    setOk() {
      if (this.confirmMsg.songId) {
        this.removeSong();
      } else this.removeStation();
    },
    async removeSong() {
      const songId = this.confirmMsg.songId;
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
    closeChat() {
      this.isChatOpened = false;
    },
     formatNumber(number) {
      let count = number;
      if (count < 1000) return count;
      count /= 1000;
      const countStr = Math.round(count * 10) / 10 + "K";
      if (count < 1000) return countStr;
      count /= 1000;
      return Math.round(count * 10) / 10 + "M";
    },
    toggleInfoExtras(){
      this.isInfoExtrasOpen=!this.isInfoExtrasOpen;
    }
  },
  // watch: {
  //   currStation: {
  //      handler() {
  //       const {currSong}=this.$store.getters;
	components: {
		songList,
		chat,
		modal,
		songListOptions,
	},
};
</script>
