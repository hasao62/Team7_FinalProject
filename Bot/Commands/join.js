//join.js
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports.Join = async (message) => {
  const voiceChannel = message.member?.voice?.channel;
  if (!voiceChannel) {
    return message.reply("Must be in a voice channel");
  }

  joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    selfDeaf: false,
  });

  return message.reply(`Joined ${voiceChannel.name}`);
};