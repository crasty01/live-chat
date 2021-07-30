<template>
  <div v-if="this.channels" class="channles">
    <Channel :id=channel v-for="channel in this.channels" v-bind:key=channel :channel="channel"/>
  </div>
</template>

<script>
import Channel from '../components/Channel.vue';

export default {
  name: 'Home',
  components: {
    Channel,
  },
  props: {
    channels: {
      type: Array,
    },
  },
};
</script>

<style lang="scss">
.channles {
  display: flex;
  color: #f5f5f5;
}
</style>
