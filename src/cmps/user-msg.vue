<template>
<transition name="slide-fade">
   <div v-if="msg" class="msg" :class="msgClass" >
        {{msg.txt}}
    </div>
    </transition>
</template>

<script>
export default {
  computed: {
        msgClass() {
            if (!this.msg) return;
            return `msg-${this.msg.type}`
        },
        msg(){
            return this.$store.getters.userMsg
        }
    },
}
</script>
