<template>
  <section class="signup-login">
<vue-particles
        style="z-index: 0; height: 100%; width: 100%; position: absolute; left: 0; top: 0"
        color="#dedede"
      ></vue-particles>
    <template class="wraper" >
    <section class="signup" style="z-index: 1;">
      <h2 class="title">Sign up</h2>
      <form @submit.prevent="signup">
        Upload your profile picture
        <input type="file" @change="handleImg" />
        <h3>Username:</h3>
        <input
          type="text"
          placeholder="Enter username"
          v-model="signupCreds.username"
        />
        <h3>Fullname:</h3>
        <input
          type="text"
          placeholder="Enter full name"
          v-model="signupCreds.fullname"
        />
        <h3>Password</h3>
        <input
          type="password"
          autocomplete="false"
          v-model="signupCreds.password"
        />
        <button>Sign up</button>
      </form>
    </section>
    <section class="login" style="z-index: 1;">
      <h2 class="title">Already a user?</h2>
      <h2 class="log-in">Log in</h2>
      <form @submit.prevent="login">
        <input
          type="text"
          placeholder="username"
          v-model="loginCred.username"
        />
        <input
          type="password"
          autocomplete="false"
          v-model="loginCred.password"
        />
        <!-- <select v-model="loginCred.username">
          <option value="">Select User</option>
          <option v-for="user in users" :key="user._id" :value="user.username">
            {{ user.fullname }}
          </option>
        </select> -->
        <button>Login</button>
      </form>
    </section>
  </template>
    </section>

</template>

<script>
import { uploadImg } from "@/services/img-upload-service.js";
export default {
  data() {
    return {
      signupCreds: {
        imgUrl: "",
        fullname: "",
        username: "",
        password: "",
      },
      loginCred: {
        username: "",
        password: "",
      },
      imgLoaded: true,
    };
  },
  created() {
    this.loadUsers();
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },

    users() {
      return this.$store.getters.users;
    },
  },
  methods: {
    async handleImg(ev) {
      if (!ev.target.files[0]) return;
      const file = ev.target.files[0];
      const fileType = file["type"];
      if (!fileType.includes("image")) return;
      try {
        this.imgLoaded = false;
        const savedImg = await uploadImg(file);
        console.log(savedImg.url);
        this.signupCreds.imgUrl = savedImg.url;
        this.imgLoaded = true;
      } catch (err) {
        console.log("Error on handle img =>", err);
      }
    },
    loadUsers() {
      this.$store.dispatch({ type: "loadUsers" });
    },
    async signup() {
      await this.$store.dispatch({
        type: "signup",
        userCred: this.signupCreds,
      });
      this.$router.push("/").catch((err) => {
        //When same route appears
        if (err.name != "NavigationDuplicated") {
          throw err;
        }
      });
    },
    async login() {
      try {
        await this.$store.dispatch({ type: "login", userCred: this.loginCred });
        this.$router.push("/").catch((err) => {
        //When same route appears
        if (err.name != "NavigationDuplicated") {
          throw err;
        }
      });
      } catch (err) {
        let userMsg = {};
        if (err.request.status === 401) {
          userMsg = { txt: "Invalid username and/or password!", type: "error" };
        } else {
          userMsg = {
            txt: "We are having some issues, please try again later!",
            type: "error",
          };
        }
          this.$store.commit({ type: "updateUserMsg", userMsg });
        setTimeout(() => {
          this.$store.commit({ type: "deleteMsg" });
        }, 2000);

      }
    },
  },
  components: {
  },
};
</script>

<style>
</style>