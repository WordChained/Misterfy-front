<template>
  <header>
    <div v-if="isCreating" class="screen-cover"></div>
    <span class="logo" @click="goHome">
      <img class="logo-img" src="../assets/logo/logo-no-txt.png" alt="" />
      <img class="logo-txt" src="../assets/logo/logo-txt.png" />
    </span>
    <filter-text-search @search="search" :filterName="filterName" />
    <div class="user-greeting" v-if="loggedinUser">
      <img v-if="loggedinUser.imgUrl" class="user-img" :src="loggedinUser.imgUrl">
      <img v-else src="../assets/icons/user.png" >
    <h3>  Hello
      <span class="user-name">{{ getFirstName }}</span>!</h3>
    <!-- <h2 class="user-greeting" >Hello {{ getFirstName }}</h2> -->
    </div>
    <div class="hamburger-container">
      <svg
        class="hamburger"
        @click="toggleNavEntry"
        height="32px"
        id="Layer_1"
        style="enable-background: new 0 0 32 32"
        version="1.1"
        viewBox="0 0 32 32"
        width="32px"
        xml:space="preserve"
      >
        <path
          d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"
        />
      </svg>
    </div>
    <nav class="main-nav" :class="{ 'nav-open': isNavBurgerOpen }">
      <filter-text-search @search="search"  :filterName="filterName" />
      <button class="creatify-btn nav-link" @click.stop="toggleCreating">
        Creatify
      </button>
      <span class="sep">|</span>
      <router-link class="nav-link" to="/explore" @click.native="exploreClicked"
        >Explore</router-link
      ><span class="sep">|</span>
      <router-link class="nav-link" to="/about" @click.native="toggleNavEntry">About</router-link
      ><span class="sep">|</span>
      <template v-if="!loggedinUser">
        <router-link to="/signup" @click.native="toggleNavEntry">Signup/Login</router-link></template
      >
      <template v-else
        ><button class="logout-btn" @click="logout">Logout</button></template
      >
    </nav>
    <station-add v-if="isCreating" @closeModal="toggleCreating" />
  </header>
</template>

<script>
import filterTextSearch from "@/cmps/filter-text-search";
// import { youtubeService } from "@/services/youtube-service.js";
import stationAdd from "@/cmps/station-add.vue";
export default {
  data() {
    return {
      isCreating: false,
      // 1080px or lower
      isNavBurgerOpen: false,
    };
  },
  methods: {
    exploreClicked() {
      this.scrollTop();
      this.toggleNavEntry();
    },
    scrollTop() {
      window.scrollTo(0, 0);
    },
    goHome() {
      this.$router.push("/").catch((err) => {
        //When same route appears
        if (err.name != "NavigationDuplicated") {
          throw err;
        }
      });
      window.scrollTo(0, 0);
    },
    search(name) {
      this.toggleNavEntry();
      if(!name){
        const {path} = this.$route;
        console.log(name);
          if (name !== "" || !path.includes("explore")) return
      }
      //   //Preventing duplicated route error
      // if (currName && currName === name) return;
      if (!name) name = "*";
      let url = "/explore/" + name;
      if (this.tag) url += "/" + this.tag;

      this.$router.push(url).catch((err) => {
        //When same route appears
        if (err.name != "NavigationDuplicated") {
          throw err;
        }
      });
    },

    toggleCreating() {
      return (this.isCreating = !this.isCreating);
    },
    async logout() {
      await this.$store.dispatch({ type: "logout" });
    },
    toggleNavEntry() {
      this.isNavBurgerOpen = !this.isNavBurgerOpen;
    },
  },
  computed: {
    getFirstName() {
     let firstName = this.loggedinUser.fullname.substr(
        0,
        this.loggedinUser.fullname.indexOf(" ")
      );
      if(!firstName) return this.loggedinUser.fullname
      else return firstName
    },
    tag() {
      return this.$route.params.tag;
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    filterName(){
      return this.$route.params.name||'';
    }
  },

  components: {
    filterTextSearch,
    stationAdd,
  },
};
</script>
