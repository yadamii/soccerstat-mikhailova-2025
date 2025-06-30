/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import Home from '@/components/Home.vue'
import Leagues from '@/components/Leagues.vue'
import Matches from '@/components/Matches.vue'
import Teams from '@/components/Teams.vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import TeamMatches from '@/components/TeamMatches.vue'

const routes = [
  { path: '/', component: Home},
  { path: '/matches', component: Matches},
  { path: '/teams', component: Teams},
  { path: '/team/:id', component: TeamMatches},
  { path: '/leagues', component: Leagues},
  { path: '/league', component: Matches},
] 
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
