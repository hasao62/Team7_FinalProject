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

      // play the audio if the file exists
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      entersState(connection, VoiceConnectionStatus.Ready, 30_000) 
        .then(() => {
          const player = createAudioPlayer();
          console.log("Creating audio resource");

          const resource = createAudioResource(audioPath, {
            inputType: StreamType.Arbitrary,
          });
  // debug
          if (!resource) {
            console.error('Audio resource creation failed.');
            return message.reply('Failed creating audio resource.');
          }

          console.log("Audio resource created");

          player.play(resource);
          connection.subscribe(player);

          // Listen for errors in the player
          player.on('error', (err) => {
            console.error('Audio player error', err);
            connection.destroy();
          });

          player.on(AudioPlayerStatus.Idle, () => {
            console.log('Audio finished');
            connection.destroy();
            fs.unlinkSync(audioPath);  // delete file after playing
          });

          player.on(AudioPlayerStatus.Playing, () => {
            console.log('Audio playing');
          });

          player.on(AudioPlayerStatus.Paused, () => {
            console.log('Audio paused.');
          });
          
          // debug
          setTimeout(() => {
            if (player.state.status !== AudioPlayerStatus.Playing) {
              console.error('Audio not playing after delay');
            }
          }, 5000);
        })
        
        // debug
        .catch((err) => {
          console.error('Error connecting to voice channel:', err);
          message.reply('Failed to join voice channel.');
        });
    });
    
   // debug
  } catch (err) {
    console.error('Error generating TTS:', err);
    message.reply('Error generating the TTS audio.');
  }
};
