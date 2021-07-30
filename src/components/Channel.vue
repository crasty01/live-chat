<template>
  <div class="channel">
    <div class="chat">
      <div class="chat-content">
        <Message v-for="message in messages" v-bind:key=message :message="message"/>
      </div>
    </div>
  </div>
</template>

<script>
import Message from '@/components/Message.vue';

export default {
  name: 'Channel',

  components: {
    Message,
  },

  data: () => ({
    messages: [],
  }),

  props: {
    channel: {
      type: String,
      required: true,
    },
  },

  created() {
    this.load();
    this.client = new this.$tmijs.Client({
      options: { debug: true },
      connection: {
        reconnect: true,
        secure: true,
      },
      channels: [this.channel],
    });
    this.client.connect().catch(console.error);
    this.client.on('message', (channel, tags, message, self) => {
      if (self) return;
      console.log(this.BADGELIST[this.channel]);
      if (!this.EMOTELIST[this.channel] || !this.BADGELIST[this.channel]) return;

      this.messages.push(this.createMessage({
        channel,
        message: this.$parseMessage(this, message, tags.emotes, channel.substring(1)),
        ...tags,
      }));
      if (this.messages.length > 50) this.messages.shift();
    });

    this.client.on('messagedeleted', (_, __, ___, tags) => {
      this.deleteMessageById(tags['target-msg-id']);
    });
    this.client.on('ban', (_, username) => {
      this.deleteMessageByUser(username);
    });
    this.client.on('timeout', (_, username) => {
      this.deleteMessageByUser(username);
    });
  },
  methods: {
    async load() {
      this.EMOTELIST[this.channel] = await this.$fetchtEmotes(this.channel);
      this.BADGELIST[this.channel] = await this.$fetchtBadges(this.channel);
    },
    createMessage(info) {
      return {
        ...this.unwrap(info, ['id', 'display-name', 'emotes', 'color', 'message']),
        badges: this.getBadges(info.badges),
      };
    },
    getBadges(b) {
      const badges = [];
      if (!b) return badges;
      Object.keys(b).forEach((key) => {
        badges.push(this.$getBadgeUrl(this.BADGELIST[this.channel][key][b[key]]));
      });
      return badges;
    },
    deleteMessageById(id) {
      this.messages = this.messages.filter((e) => e.id !== id);
    },
    deleteMessageByUser(username) {
      this.messages = this.messages.filter((e) => e.username !== username);
    },
    unwrap(object, props) {
      const unwraped = {};
      props.map((key) => {
        unwraped[key] = object[key];
        return key;
      });
      return unwraped;
    },
  },

};
</script>

<style lang="scss">
.channel {
  flex-basis: 25rem;
  flex-grow: 1;

  & .chat {
    height: 100vh;
    position: relative;
    width: 100%;
    overflow: hidden;

    & .chat-content {
      position: absolute;
      bottom: 0;
      display: grid;
      gap: .2rem;
      width: 100%;
      padding: .5rem;
    }
  }
}
</style>
