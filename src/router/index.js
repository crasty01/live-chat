import { createRouter, createWebHistory } from 'vue-router';
import Channels from '../views/Channels.vue';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/:all(.*)*',
    redirect: '/',
  },
  {
    path: '/users/:users(.*)*',
    name: 'Channels',
    component: Channels,
    props(route) {
      return { channels: route.params.users };
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
