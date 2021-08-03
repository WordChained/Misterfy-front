<template>
	<section class="marquee">
		<marquee scrollamount="10">
			<span class="marquee">{{ currSong.title }}</span>
		</marquee>
	</section>
</template>

<script>
export default {
	created() {
		this.currSong = this.$store.getters.currSong
	},
	data() {
		return {
			currSong: ''
		}
	},

}
</script>
