<template>
    <form @submit.prevent="search" class="filter-search-container">
      <input class="main-search" type="text" name="search" placeholder="Search for a station" v-model="name" autocomplete="off"/>
      <button><img src="../assets/icons/search.png"></button>
    </form>
</template>

<script>

export default {
  props:{
    filterName:{
type:String
    }
  },
  data() {
    return {
      name: ''
    }
  },
  created () {
    if(this.filterName==='*')this.name='';
    else this.name=this.filterName;
    
  },
  methods: {
    search() {
      this.$emit('search', this.name)
      //Emptying search
      // this.name='';

    }
  },
};
</script>

<style>
</style>