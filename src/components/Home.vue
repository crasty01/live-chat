<template>
  <div v-if="this.channels" class="channles">
    <Channel :id=channel v-for="channel in this.channels" v-bind:key=channel :channel="channel"/>
  </div>
</template>

<script>
import Channel from './Channel.vue';

export default {
  name: 'Home',
  components: {
    Channel,
  },
  created() {
    const path = window.location.pathname.substring(1);
    if (path.length > 0) this.channels = path.split('/').filter((e) => e !== '').map((e) => e.toLowerCase());
    else this.channels = null;
  },
};
</script>

<style lang="scss">
.channles {
  display: flex;
}
</style>
