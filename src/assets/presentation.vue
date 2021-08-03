/*~~ Vue player component ~~*/
<template>
  <section class="player" v-if="songId">
    <section class="player-controls">
      <span @click.stop="prevSong">
        <img class="player-previous-btn" src="../assets/icons/next.png" />
      </span>
      <span v-if="isPlay" @click.stop="togglePlay">
        <img class="player-play-btn" src="../assets/icons/play-button.png" />
      </span>
      <span v-else @click.stop="togglePlay">
        <img class="player-pause-btn" src="../assets/icons/pause.png" />
      </span>
      <span @click.stop="nextSong">
        <img class="player-forward-btn" src="../assets/icons/next.png" />
      </span>
    </section>
    <vue-plyr ref="plyr">
      <div class="plyr__video-embed" id="player">
        <iframe :src="src" allowtransparency allow="autoplay"></iframe>
      </div>
    </vue-plyr>
  </section>
</template>

<script>
export default {
  /*~~ Computed source from youtube embed and "Plyr" library ~~*/
  computed: {
    src() {
      return `https://www.youtube.com/embed/${this.songId}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`;
    },
  },
};
</script>


<script>

/*~~ CODE FROM YOUTUBE SERVICE ~~*/

/*~~ Calculation of song info to duration ~~*/
async function getDuration(youtubeId) {
    const res = await axios.get(`${DETAILS_URL}?id=${youtubeId}&part=contentDetails&key=${YT_API_KEY}`)
    let duration = res.data.items[0].contentDetails.duration
    try {
        duration = duration.substring(2)
        duration = duration.replace('M', ':')
        duration = duration.split(':')
        duration[1] = duration[1].replace('S', '')
        duration[1] = duration[1].padStart(2, '0')
        duration = duration.join(':')
        return duration.toString()
    } catch (err) {
        return null
    }
}
/*~~ Calculation of song info to redable title ~~*/

function getTitle(title) {
    // Removes HTML char codes
    let output = he.decode(title);
    // Removes 'Official Video' brackets
    const officialVideoRegex = /[([].?(official.?video)?(official music video)?.?[)\]]/ig
    output = output.replace(officialVideoRegex, '');
    return output;
}
</script>
