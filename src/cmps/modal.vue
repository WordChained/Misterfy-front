<template>
  <section class="modal">
    <button @click="closeModal" class="btn-close">✖</button>
    <h3 class="msg-text">{{ msg.txt }}</h3>
   <section class="btns-container">
    <button @click="closeModal" class="btn-cancel">Cancel</button>
      <button @click="setOk" class="btn-ok" >Ok</button>
   </section>
  </section>
</template>

<script>
export default {
  props: {
    msg: {
      type: Object,
    },
  },
  methods: {
    setOk() {
      this.$emit("setOk");
          this.$emit("closeModal");
    },
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>

<style>
</style>