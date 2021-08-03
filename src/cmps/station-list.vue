<template>
  <section class="station-list">
    <carousel
      v-if="$route.name === 'home'"
      :per-page="numOfSlides"
      :mouse-drag="true"
      ref="carousel"
      :navigationEnabled="true"
      :paginationEnabled="false"
      :loop="true"
      :navigationNextLabel="nextLabel"
      :navigationPrevLabel="prevLabel"
      :count="numOfSlides"
    >
      <slide v-for="station in stations" :key="station._id">
        <station-preview :station="station" />
      </slide>
    </carousel>
    <template v-else>
      <station-preview
        class="your-picks-carousel"
        :station="station"
        v-for="station in stations"
        :key="station._id"
      />
    </template>
  </section>
</template>

<script>
// carousel autoplay
// :autoplay="true"
//  :autoplayTimeout="1000"
//       :autoplayHoverPause="false"
//speed of the carousel sliding
//      :speed="500"
import stationPreview from "./station-preview.vue";
import { Carousel, Slide } from "vue-carousel";
export default {
  name: "explore",
  props: {
    stations: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  computed: {
    widerMediaQuery() {
      return window.matchMedia("(max-width: 1260px)").matches;
    },
    wideMediaQuery() {
      return window.matchMedia("(max-width: 1080px)").matches;
    },
    normalMediaQuery() {
      return window.matchMedia("(max-width: 800px)").matches;
    },
    narrowMediaQuery() {
      return window.matchMedia("(max-width: 600px)").matches;
    },
    mobileMediaQuery() {
      return window.matchMedia("(max-width: 500px)").matches;
    },
    numOfSlides() {
      if (this.narrowMediaQuery) {
        return 1;
      }
      if (this.normalMediaQuery) {
        return 2;
      }
      if (this.wideMediaQuery) {
        return 3;
      }
      else if (this.widerMediaQuery) {
        return 4;
      }
      else {
        return 5;
      }
    },
    nextLabel() {
      return '<button class="btn-next" ><svg width="30px" fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 330 330" style="enable-background:new 0 0 330 330;" xml:space="preserve"><path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394	l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393	C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"/></svg></path></svg></button>';
    },
    prevLabel() {
      return '<button class="btn-prev" ><svg width="30px" fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 330 330" style="enable-background:new 0 0 330 330;" xml:space="preserve"><path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394	l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393	C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"/></svg></path></svg></button>';
    },
  },
  methods: {},

  mounted() {
    //Hacked way to make stations appear on start
    if (this.$refs["carousel"]) {
      setTimeout(() => {
        this.$refs["carousel"].onResize();
        this.$refs["carousel"].goToPage(0);
      }, 200);
    }
  },

  components: {
    stationPreview,
    Carousel,
    Slide,
  },
};
</script>
