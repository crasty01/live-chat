<template>
  <div v-if="this.channels" class="channles" :class="{ horizontal }">
    <Channel
      :id=channel
      v-for="channel in this.channels"
      :key=channel
      :channel="channel"
      :horizontal="horizontal"
    />
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
    horizontal: {
      type: Boolean,
    },
  },
};
</script>

<style lang="scss">
.channles {
  display: flex;
  align-items: flex-end;
  //height: calc(100vh - 2rem);
  //height: 100vh;

  & .channel:not(:first-child) {
    margin-left: 1rem;
  }
}
</style>
