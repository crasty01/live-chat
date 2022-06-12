<template>
  <div v-if="this.channels" class="channels" :class="{ horizontal, badges }">
    <Channel
      :id=channel
      v-for="channel in this.channels"
      :key=channel
      :channel="channel"
      :horizontal="horizontal"
      :badges="badges"
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
    badges: {
      type: Boolean,
    },
  },
};
</script>

<style lang="scss">
.channels {
  display: flex;
  align-items: flex-end;
  //height: calc(100vh - 2rem);
  //height: 100vh;

  padding: 1rem;

  & .channel:not(:first-child) {
    margin-left: 1rem;
  }
}

.horizontal.channels {
  padding: calc((100vh - 38px) / 2) 0;
}
</style>
