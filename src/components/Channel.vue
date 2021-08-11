<template>
  <div class="channel">
    <div class="chat">
      <Message v-for="message in messages" :key=message :message="message"/>
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
    max: 0,
  }),

  props: {
    channel: {
      type: String,
      required: true,
    },
  },

  created() {
    this.generateMax();
    this.populate();
    this.load();
    window.addEventListener('resize', this.resize);
    this.client = new this.$tmijs.Client({
      // options: { debug: true },
      connection: {
        reconnect: true,
        secure: true,
      },
      channels: [this.channel],
    });
    this.client.connect().catch(console.error);
    this.client.on('message', (channel, tags, message, self) => {
      if (self) return;
      if (!this.EMOTELIST[this.channel] || !this.BADGELIST[this.channel]) return;

      this.messages.push(this.createMessage({
        channel,
        message: this.$parseMessage(this, message, tags.emotes, channel.substring(1)),
        ...tags,
        placeholder: false,
      }));
      if (this.messages.length > this.max) this.deleteMessages();
    });

    this.client.on('messagedeleted', (_, __, ___, tags) => {
      this.deleteMessageById(tags['target-msg-id']);
      this.populate();
    });
    this.client.on('ban', (_, username) => {
      this.deleteMessageByUser(username);
      this.populate();
    });
    this.client.on('timeout', (_, username) => {
      this.deleteMessageByUser(username);
      this.populate();
    });
  },
  updated() {
    this.scrollToEnd();
  },
  methods: {
    async load() {
      this.EMOTELIST[this.channel] = await this.$fetchtEmotes(this.channel);
      this.BADGELIST[this.channel] = await this.$fetchtBadges(this.channel);
    },
    resize() {
      this.generateMax();
      this.populate();
      this.deleteMessages();
    },
    generateMax() {
      this.max = this.horizontal ? 50 : Math.floor((window.innerHeight - (16 * 2)) / 40) + 2;
    },
    deleteMessages() {
      this.messages = this.messages.slice(this.messages.length - this.max);
    },
    populate() {
      if (this.max - this.messages.length <= 0) return;
      new Array(this.max - this.messages.length).fill(0).map(() => this.createMessage({
        channel: this.channel,
        id: null,
        'display-name': 'placeholder',
        message: '',
        badges: [],
        placeholder: true,
      })).forEach((e) => this.messages.unshift(e));
    },
    scrollToEnd() {
      const container = this.$el.querySelector('.chat');
      // container.scrollTop = container.scrollHeight;
      container.scrollLeft = container.scrollWidth - container.clientWidth;
    },
    createMessage(info) {
      return {
        ...this.unwrap(info, ['id', 'display-name', 'message', 'placeholder']),
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
  width: 100%;

  & .chat {
    //max-height: 100vh;
    max-height: calc(100vh - 2rem);
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: .2rem;
    width: 100%;
    overflow: scroll;
    //padding: .5rem;

    scroll-behavior: smooth;

    //-ms-overflow-style: none;
    //scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.horizontal .channel {
  & .chat {
    flex-direction: row;
  }
}
</style>
