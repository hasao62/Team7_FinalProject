//tts.js
const fs = require('fs');
const path = require('path');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  StreamType,
  VoiceConnectionStatus,
  entersState,
} = require('@discordjs/voice');

const client = new TextToSpeechClient();

module.exports.TTS = async (message) => {
  const text = message.content.slice(5).trim();
  if (!text) return message.reply("Please provide text for TTS.");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.reply("Must be in a voice channel");

  const request = {
    input: { text },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);

    const audioPath = path.join(__dirname, 'output.mp3');
    fs.writeFileSync(audioPath, response.audioContent, 'binary');
    console.log('Audio content written to file:', audioPath);

    // Check if the audio file exists and is accessible before continuing
    fs.access(audioPath, fs.constants.F_OK | fs.constants.R_OK, (err) => {
      if (err) {
        console.error('TTS file not accessible or not fully created.');
        return message.reply('Issue with the TTS file generation.');
      }

      // Proceed with playing the audio if the file exists
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      entersState(connection, VoiceConnectionStatus.Ready, 20_000).then(() => {
        const player = createAudioPlayer();
        const resource = createAudioResource(audioPath, {
          inputType: StreamType.Arbitrary,
        });

        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
          connection.destroy();
          fs.unlinkSync(audioPath);  // Delete the file after playing
        });

        player.on('error', (err) => {
          console.error('Audio player error:', err);
          connection.destroy();
        });
      }).catch((err) => {
        console.error('Error connecting to the voice channel:', err);
        message.reply('Failed to join the voice channel.');
      });
    });

  } catch (err) {
    console.error('Error generating TTS:', err);
    message.reply('Error generating the TTS audio.');
  }
};
