<template>
  <v-app>
    <AppFooter />
    <router-view class="main"/>
    <AppHeader />
  </v-app>
</template>

<script>
  import AppHeader from './layouts/Footer.vue'
  import AppFooter from './layouts/Header.vue'
  export default {
    name: 'App',
    components: { AppFooter, AppHeader },
  }
</script>

<style>
  .main{
    height: 100%;
  }
</style>