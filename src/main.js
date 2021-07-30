import dayjs from 'dayjs';
import tmijs from 'tmi.js';

import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';

const create = async () => {
  const app = createApp(App);
  app.use(router);
  app.config.globalProperties.$dayjs = dayjs;
  app.config.globalProperties.$tmijs = tmijs;
  app.config.globalProperties.EMOTELIST = {};
  app.config.globalProperties.BADGELIST = {};
  app.config.globalProperties.$fetchtEmotes = async (name) => (await fetch(`https://emote-api-1.danielvondra.repl.co/${name}/emotes`)).json();
  app.config.globalProperties.$fetchtBadges = async (name) => (await fetch(`https://emote-api-1.danielvondra.repl.co/${name}/badges`)).json();
  app.config.globalProperties.$getEmoteUrl = (id, type, size = 2) => {
    switch (type) {
      case 'twitch':
        return `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/${size}.0`;
      case 'bttv':
        return `https://cdn.betterttv.net/emote/${id}/${size}x`;
      case 'ffz':
        return `https://cdn.frankerfacez.com/emote/${id}/${size}`;
      default:
        return '';
    }
  };
  app.config.globalProperties.$getBadgeUrl = (id, size = 2) => `https://static-cdn.jtvnw.net/badges/v1/${id}/${size}`;
  app.config.globalProperties.$replaceAt = (message, start, end, url) => {
    const alt = message.substring(start, end + 1);
    const emRep = `<img class="message-emote message-emote-twitch" alt="${alt}" src="${url}"/>`;
    return message.substring(0, start) + emRep + message.substring(end + 1, message.length);
  };
  app.config.globalProperties.$parseMessage = (_, ogMessage, emotes, channel) => {
    let message = ogMessage;
    message = message.replace(/</gm, '𧄟').replace(/>/gm, '𧄞').replace(/=/g, '𧄜');// .replace(/:/gm, '𧄝')
    let emoteList = [];
    if (emotes) {
      Object.keys(emotes).forEach((key) => {
        emotes[key].forEach((e) => {
          const pos = e.split('-');
          emoteList.push({ key, start: +pos[0], end: +pos[1] });
        });
      });
    }
    emoteList = emoteList.sort((a, b) => b.end - a.end);
    emoteList.forEach((e) => {
      message = _.$replaceAt(message, e.start, e.end, _.$getEmoteUrl(e.key, 'twitch'));
    });
    message = message.replace(/[a-z0-9:(\\/)-;<>.|&@"]+/gi, (key) => {
      if (_.EMOTELIST[channel].pleb[key] && _.EMOTELIST[channel].pleb[key].type !== 'twitch') {
        return `<img
          class="message-emote message-emote-${_.EMOTELIST[channel].pleb[key].type}" alt="${key}"
          src="${_.$getEmoteUrl(_.EMOTELIST[channel].pleb[key].id, _.EMOTELIST[channel].pleb[key].type)}"/>`;
      }
      return key;
    });
    return message.replace(/𧄟/g, '&lt;').replace(/𧄞/g, '&gt;').replace(/𧄝/g, '&#58;').replace(/𧄜/g, '&#61;');
  };

  app.mount('#app');
};

create();
