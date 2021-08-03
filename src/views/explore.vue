<template>
  <main class="explore-container">
     <div v-show="!loaded" class="loader">
      <div class="loaderbar"></div>
      <div class="loaderbar"></div>
      <div class="loaderbar"></div>
      <div class="loaderbar"></div>
      <div class="loaderbar"></div>
      <div class="loaderball"></div>
    </div>
    <section class="explore">
      <ul class="tags-list">
        <!-- <li class="tag-preview">
          <router-link :to="'/explore/' + this.name" >All</router-link>
        </li> -->
        <li v-for="(tag, idx) in tags" :key="idx" class="tag-preview">
          <router-link :to="getUrl(tag)">
            <station-tag :tag="tag" />
          </router-link>
        </li>
      </ul>
    </section>
    <section ref="esl" v-show="loaded" class="explore-station-list">
      <template v-if="stations.length">
        <!-- <h3>{{filterTitle}}</h3> -->
        <div v-for="station in stations" :key="station._id">
          <station-preview :station="station" />
        </div>
        <!-- <div v-if="!noFilter" class="more-stations"> -->
        <!-- <h2 class="more-stations-title">More stations:</h2> -->
        <!-- <div v-for="station in stations" :key="'a'+station._id"> -->
        <!-- <station-preview :station="station" /> -->
        <!-- <station-list :stations="stations" /> -->
        <!-- </div> -->
        <!-- </div> -->
      </template>
      <h3 class="no-stations-msg" v-else>No stations found!</h3>
    </section>
   
  </main>
</template>

<script>
// import stationList from "@/cmps/station-list";
import stationPreview from "@/cmps/station-preview";
import stationTag from "@/cmps/station-tag";
export default {
  name: "explore",
  mounted() {
    
  },
  data() {
    return {
      loaded: false,
      stations: [],
    };
  },
  methods: {
    getUrl(tag) {
      let url = "/explore/";

      if (this.name) {
        url += this.name;
      } else url += "*";
      if (tag === "All") tag = "";
      url += "/" + tag;

      return url;
    },
    // getStationsByTag(tag){
    //   return this.stations.filter(station=>{
    //     return
    //   })
    // }
  },
  computed: {
    name() {
      return this.$route.params.name;
    },
    filteredStations() {
      return this.$store.getters.stationsToDisplay;
    },
    tags() {
      // console.log(this.$store.getters.tags);
      const tags = this.$store.getters.tags;
      return ["All", ...tags];
    },
    filterTitle() {
      let { name, tag } = this.$route.params;
      if (!name || name === "*")
        if (!tag) name = "All";
        else name = "";
      if (!tag) {
        if (name === "All") tag = "";
        else tag = "All";
      }
      name += " ";
      // return tag;
      return name + tag;
    },
    noFilter() {
      const { name, tag } = this.$route.params;
      return (!name || name === "*") && !tag;
    },
  },

  components: {
    // stationList,
    stationTag,
    stationPreview,
  },
  watch: {
    "$route.params": {
      immediate: true,
      async handler() {
        const { name, tag = "" } = this.$route.params;
        const filterBy = {
          name,
          tag,
        };
        if (!name || name === "*") filterBy.name = "";
        try {
          this.$store.commit({ type: "setFilter", filterBy });
          const data = await this.$store.dispatch({ type: "loadStations" });
          this.stations = data.filteredStations;
          this.loaded = true;
        } catch (err) {
          console.log("Error on set filter =>", err);
        }
      },
    },
  },
};
</script>
