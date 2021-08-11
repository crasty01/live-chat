import { createRouter, createWebHistory } from 'vue-router';
import Channels from '../views/Channels.vue';

const routes = [
  {
    path: '/',
    name: 'Channels',
    component: Channels,
    props(route) {
      return {
        channels: typeof route.query.user === 'string' ? [route.query.user] : [...new Set(route.query.user)],
        horizontal: route.query.horizontal !== undefined,
      };
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
