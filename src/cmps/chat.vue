<template>
  <section v-if="msgs" class="chat-container">
      <button class="btn-close" @click="closeChat">✖</button>
    <section class="chat" ref="chat">
      <h2>The wall</h2>
      <ul class="clear-list msg-list">
        <li v-for="(msg, idx) in msgs" :key="idx">
          <chat-msg-preview :msg="msg" :userId="currUserId" :loggedinUser="loggedinUser" />
        </li>
      </ul>
    </section>
    <form @submit.prevent="" class="msg-form">
      <input type="text" v-model="msg.txt" placeholder="Say something nice" />
      <button class="btn-send" @click.stop="sendMsg">
        <svg
          width="25px"
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="paper-plane"
          class="chat-send-icon"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
          ></path>
        </svg>
      </button>
    </form>
    <!-- <button @click.stop="clearChatMsgs">Clear messages</button> -->
  </section>
</template>

<script>
import { chatService } from "@/services/chat-service.js";
import { socketService } from "@/services/socket-service.js";
import chatMsgPreview from "./chat-msg-preview.vue";
export default {
  props: {
    stationId: {
      type: String,
    },
  },

  async created() {
    socketService.emit("chat topic", this.stationId);
    socketService.on("chat addMsg", this.loadMsgs);
    if (!this.currUserId) {
      this.$store.commit({ type: "setUserId" });
    }
  },
  data() {
    return {
      msgs: [],
      msg: chatService.getEmptyMsg(),
    };
  },
  computed: {
    currUserId() {
      return this.$store.getters.currUserId;
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
  },
  methods: {
    async sendMsg() {
      if (!this.msg.txt) return;
      // const { chat } = this.$refs;

      this.msg.stationId = this.stationId;
      let sender = null;
      if (this.loggedinUser) {
        const { _id, username } = this.loggedinUser;
        sender = {
          _id,
          username,
        };
      } else {
        sender = {
          _id: this.currUserId,
          username: "guest" + this.currUserId,
        };
      }
      this.msg.from = sender;
      const copiedMsg = JSON.parse(JSON.stringify(this.msg));
      try {
        await chatService.add(this.msg);
        this.msg = chatService.getEmptyMsg();
        socketService.emit("chat newMsg", copiedMsg);
      } catch (err) {
        console.log("Error on chat add =>", err);
      }
    },
    async loadMsgs() {
      const { chat } = this.$refs;
      this.msgs = await chatService.query(this.stationId);
      this.$nextTick(() => {
        chat.scrollTo(0, chat.scrollHeight);
      });
    },

    async clearChatMsgs() {
      // debugger
      const updatedStation = await chatService.clearChatMsgs(this.stationId);
      // socketService.emit("station updated", updatedStation);
      this.$store.commit({
        type: "setCurrStation",
        currStation: updatedStation,
      });
    },
    closeChat(){
      this.$emit('closeChat');
    }
  },
  watch:{
stationId:{
  async handler(stationId){
    this.msgs=await chatService.query(stationId);
  },
  deep:true,
  immediate:true
}
  },
  destroyed() {
    socketService.off("chat addMsg", this.loadMsgs);
  },
  components: {
    chatMsgPreview,
  },
};
</script>

<style>
</style>