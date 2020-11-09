<template lang='pug'>
#app
  .header
    h1 Pianola
    h2 A web MIDI piano player
  midi-uploader(
    v-if='!midiFileData',
    @input='(fileData) => { midiFileData = fileData; }'
  )
  file-infos(
    v-if='midiFileData',
    :fileName='midiFileData.fileName',
    :infos='midiFileData.infos',
    @change='midiFileData = null'
  )
  player(v-if='midiFileData', :midiEvents='midiFileData.midiEvents')
</template>

<script>
import MidiUploader from './components/MidiUploader.vue';
import FileInfos from './components/FileInfos.vue';
import Player from './components/Player.vue';

export default {
  name: 'App',
  data() {
    return {
      midiFileData: null,
    };
  },
  components: {
    'midi-uploader': MidiUploader,
    'file-infos': FileInfos,
    player: Player,
  },
};
</script>

<style lang='scss'>
// @import 'https://cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css';
@import url('https://fonts.googleapis.com/css?family=Oswald|Limelight');
#app {
  font-family: 'Oswald', sans-serif;
  margin: 0 auto;
  max-width: 1040px;
  width: 90%;
  font-size: 18px;
  .header {
    h1 {
      font-family: 'Limelight', sans-serif;
      font-size: 6em;
      margin-bottom: 0;
      text-align: center;
    }
    h2 {
      margin-top: -1em;
      text-align: center;
      font-size: 2em;
    }
    margin-bottom: 3em;
  }
  .file-infos {
    .collapse {
      display: inline;
    }
    a {
      margin-left: 10px;
    }
    .infos {
      font-size: 0.8em;
      color: gray;
      h2 {
        font-size: 2em;
        color: black;
      }
    }
  }
}
</style>
