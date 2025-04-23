// index.js
process.env.GOOGLE_APPLICATION_CREDENTIALS = ""; // Google Cloud API Key
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { TTS } = require('./Commands/tts'); 
const { Join } = require('./Commands/join');
const { Help } = require('./Commands/help');

const { getVoiceConnection } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  //calls tts function
  if (message.content.startsWith('!tts')) {
    await TTS(message); 
  }
  //calls join function
  if (message.content === '!join' || message.content === '!Join') {
    await Join(message);
  }
  //calls help function
  if (message.content === '!help' || message.content === '!Help') {
    await Help(message);
  }
});

// disconnect bot if it is alone in VC
client.on('voiceStateUpdate', (oldState, newState) => {
  const voiceChannel = oldState.channel || newState.channel;
  if (!voiceChannel) return;

  const bots = voiceChannel.members.find(member => member.id === client.user.id);
  const users = voiceChannel.members.filter(member => !member.user.bot);

  if (bots && users.size === 0) {
    const connection = getVoiceConnection(voiceChannel.guild.id);
    if (connection) {
      console.log('Bot is alone. Sad D:');
      connection.destroy();
    }
  }
});

client.login(process.env.DISCORD_TOKEN);  // Token from env 