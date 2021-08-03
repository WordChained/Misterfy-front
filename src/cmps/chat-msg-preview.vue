<template>
  <section class="chat-msg-preview" :class="msgSender" >
    <section class="msg-info" :class="msgSender" >
    <section>
          <h3 class="msg-sender">{{ msg.from.username}}</h3>
      <span class="msg-sent-time">{{ formattedDate }}</span>
    </section>
      <section class="msg-text">
      {{ msg.txt }}
    </section>
    </section>
    
  </section>
</template>

<script>
export default {
  props: {
    msg: {
      type: Object,
    },
    userId: {
      type: Number,
    },
    loggedinUser:{
      type:Object
    }
  },
  computed: {
    formattedDate() {
      return new Date(this.msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12:false });
    },
    msgSender(){
        return {sender: (this.loggedinUser && this.loggedinUser._id===this.msg.from._id)||(this.userId===this.msg.from._id)};
    }
  },
};
</script>

<style>
</style>