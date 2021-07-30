<template>
  <div class="message">
    <img
      v-bind:key=badge
      v-for="badge of message.badges"
      :src="badge"
      alt="badge"
      class="message-badge"
    >
    <span class="message-name" >
      {{ message['display-name'] }}
    </span>&ensp;<span class="message-text" v-html="message.message"></span>
  </div>
</template>

<script>
export default {
  name: 'Message',
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  created() {
    console.log(this.message);
  },
};
</script>

<style lang="scss">
.message {
  padding: 0.4rem 0.8rem;
  border-radius: 0.25rem;
  width: 100%;
  word-break: break-word;
  white-space: pre-line;
  background-color: #09090b;

  & .message-name {
    font-weight: 900;

    &::after {
      content: ":"
    }
  }

  & .message-emote {
    display: inline-block;
    max-height: 1.8em;
    max-width: 1.8em;
    margin-bottom: -0.5em;
    margin-top: -0.5em;
    user-select: text;
  }

  & .message-badge {
    display: inline-block;
    max-height: 1.2em;
    user-select: text;
    margin-bottom: -0.2em;
    margin-top: -0.2em;
    margin-right: .2rem;
  }
}
</style>
