import express from 'express';
import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import axios from 'axios';
import cors from 'cors'

export const app = express();

app.use(cors());

const client = new Client({
  puppeteer: {
    headless: true,
  },
  authStrategy: new LocalAuth(),
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message_create', async msg => {
  if (msg.body === '!cat') {
    const { data } = await axios('https://aws.random.cat/meow');

    const media = await MessageMedia.fromUrl(data.file);

    media.mimetype = 'image/png';
    media.filename = 'CustomImageName.png';
    msg.reply(media, undefined, { sendMediaAsSticker: true });
  }
  
  if (msg.body === '!dog') {
    const { data } = await axios('https://dog.ceo/api/breeds/image/random');

    const media = await MessageMedia.fromUrl(data.message);

    media.mimetype = 'image/png';
    media.filename = 'CustomImageName.png';
    msg.reply(media, undefined, { sendMediaAsSticker: true });
  }

  if (msg.body === '!capivara') {
    const { data } = await axios(
      'https://api.capy.lol/v1/capybara?json=true',
    );

    const media = await MessageMedia.fromUrl(data.data.url, {
      unsafeMime: true,
    });

    media.mimetype = 'image/png';
    media.filename = 'CustomImageName.png';
    msg.reply(media, undefined, { sendMediaAsSticker: true });
  }

  if (msg.hasMedia && msg.body === '!sticker') {
    const media = await msg.downloadMedia();

    msg.reply(media, undefined, { sendMediaAsSticker: true });
  }
});

client.initialize();

app.listen(3000, () => {
  console.log('Server running on port 3000');
})