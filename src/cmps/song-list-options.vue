<template>
	<section class="song-list-options">
		<svg
			@click.stop="like"
			:class="{ liked: isLiked }"
			v-if="!isLiked"
			class="like-station-btn"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			width="30px"
			viewBox="0 0 50 50"
			version="1.1"
			fill="white"
		>
			<g id="surface1">
				<path
					d="M 44.765625 6.28125 C 39.121094 1.53125 30.398438 2.246094 25 7.742188 C 19.601562 2.246094 10.878906 1.523438 5.234375 6.28125 C -2.109375 12.460938 -1.035156 22.539062 4.199219 27.882812 L 21.328125 45.332031 C 22.304688 46.328125 23.613281 46.882812 25 46.882812 C 26.398438 46.882812 27.695312 46.335938 28.671875 45.339844 L 45.800781 27.890625 C 51.023438 22.550781 52.121094 12.472656 44.765625 6.28125 Z M 42.460938 24.589844 L 25.332031 42.039062 C 25.097656 42.273438 24.902344 42.273438 24.667969 42.039062 L 7.539062 24.589844 C 3.976562 20.957031 3.253906 14.082031 8.25 9.875 C 12.050781 6.679688 17.910156 7.160156 21.582031 10.898438 L 25 14.386719 L 28.417969 10.898438 C 32.109375 7.140625 37.96875 6.679688 41.75 9.863281 C 46.738281 14.074219 45.996094 20.988281 42.460938 24.589844 Z M 42.460938 24.589844 "
				/>
			</g>
		</svg>
		<img @click.stop="like" src="../assets/icons/heart.png" v-else />
		<img
			:class="{ open: isSearch }"
			class="plus-btn"
			@click.stop="toggleSearch"
			src="../assets/svg/plus-solid.svg"
		/>
		<img
			class="options-prev-btn"
			@click.stop="prevSong"
			src="../assets/icons/next.png"
		/>
		<img
			@click.stop="playStation"
			class="options-play-btn"
			src="../assets/icons/play-button.png"
		/>
		<img
			class="options-next-btn"
			@click.stop="nextSong"
			src="../assets/icons/next.png"
		/>
		<img
			@click.stop="toggleRemove"
			:class="{ removing: isRemoving }"
			class="options-ellipsis-btn"
			src="../assets/icons/ellipsis.png"
		/>

		<transition name="slide-in">
			<img
				class="remove-list-btn"
				v-if="isRemoving"
				src="../assets/svg/trash-alt-solid.svg"
				@click.stop="removeStation"
				@blur="toggleRemove"
			/>
		</transition>
		<form @submit.prevent class="song-list-search" :class="{ open: isSearch }">
			<input
				v-debounce="search"
				type="text"
				v-model="txt"
				v-if="isSearch"
				placeholder="Search for a song"
				@input="displayLoader"
			/>
		</form>
		<song-results ref="results" :results="results.items" v-if="isSearch" />
		<div v-if="isSearch && loader" class="lds-facebook">
			<div></div>
			<div></div>
			<div></div>
		</div>
	</section>
</template>

<script>
import songResults from "@/cmps/song-results.vue";
import { youtubeService } from "@/services/youtube-service.js";
export default {
	data() {
		return {
			isSearch: false,
			txt: "",
			results: [],
			isRemoving: false,
			loader: false,
			confirmMsg: null,
		};
	},
	computed: {
		isPlaying() {
			return this.$store.state.playerStore.isPlaying;
		},
		currSong() {
			return this.$store.getters.currSong;
		},
		currStation() {
			return this.$store.getters.currStation;
		},
		isLiked() {
			const user = this.$store.getters.loggedinUser;
			if (!user) return;
			const likedStation = user.likedStations.find(
				(s) => s._id === this.currStation._id
			);
			if (likedStation) return true;
			return false;
		},
	},

	methods: {
		displayLoader() {
			this.loader = true;
		},
		toggleSearch() {
			this.$emit("opened");
			this.isSearch = !this.isSearch;
			this.txt = "";
			this.results = [];
		},
		async search(query) {
			if (!query) {
				this.results = [];
				this.loader = false;
				return;
			}
			try {
				this.results = await youtubeService.query(query);
				this.loader = false;
			} catch (err) {
				console.log("Error on YouTube query =>", err);
			}
		},
		like() {
			if (!this.$store.getters.loggedinUser) {
				const userMsg = {
					txt: 'Must be logged in to like',
					type: "error",
				}
				this.$store.commit({ type: "updateUserMsg", userMsg });
				setTimeout(() => {
					this.$store.commit({ type: "deleteMsg" });
				}, 2000);
			} else {
				this.$store.dispatch({ type: "likedStation", station: this.currStation });
			}
		},
		playStation() {
			if (!this.currStation.songs || !this.currStation.songs.length) return;
			const songId = this.$store.getters.currStation.songs[0].id;
			this.$store.commit({ type: "loadSongToPlayer", songId });
			this.$store.commit({ type: "setCurrSong" });
		},
		nextSong() {
			this.$store.commit({ type: "nextSong" });
			this.$store.commit({ type: "setCurrSong" });
		},
		prevSong() {
			this.$store.commit({ type: "prevSong" });
			this.$store.commit({ type: "setCurrSong" });
		},
		removeStation() {
			const msg = {
				txt: 'Are you sure you want to remove this station?',
				type: 'confirm'
			}
			this.$emit("removeStation", msg);
		},
		toggleRemove() {
			this.isRemoving = !this.isRemoving;
		}
	},
	components: {
		songResults,
	},
};
</script>
