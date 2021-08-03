<template>
  <section v-if="isOpen" class="img-results">
    <button @click="close" >X</button>
    <div class="unsplash-img-preview-container" v-for="img in imgs" :key="img.id">
      <img class="unsplash-img-preview" @click.stop="chooseImg(img.url)" :src="img.url" />
    </div>
  </section>
</template>

<script>
export default {
  props: {
    imgs: {
      type: Array,
    },
  },
  data() {
    return {
      isOpen: true,
    };
  },
  methods: {
    close() {
      this.isOpen = !this.isOpen;
      this.$emit('deleteResults')
    },
    chooseImg(img) {
      this.$emit("chosenImg", img);
      this.close();
    },
  },
  created () {
      console.log(this.imgs);
  },
};
</script>

<style>
</style>