<template>
  <header class="header">
    <nav class="nav">
      <router-link to="/">
        <img :src="logo" alt="SoccerLive football" />
      </router-link>
      <router-link to="/leagues" class="nav-link">Лиги</router-link>
      <router-link to="/teams" class="nav-link">Команды</router-link>
    </nav>
  </header>
</template>

<script setup>
import logo from '@/assets/logo.png'
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 80px;
  background: #2e302c;
  padding: 1rem;
}

img {
  height: 70px;
  margin-right: 2rem;
}


.nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 10px;
  transition: all 0.3s ease;
  position: relative;
}

/* Hover effect */
.nav-link:hover {
  color: #a3ff9e;
  text-shadow: 0 0 5px rgba(163, 255, 158, 0.8);
}

/* Active route indicator */
.router-link-exact-active.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 80%;
  height: 2px;
  background-color: #a3ff9e;
  border-radius: 1px;
}
</style>
