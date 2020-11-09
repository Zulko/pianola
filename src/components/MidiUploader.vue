<template lang="pug">
.midi-uploader
  b-upload(@input='parseMidi' :multiple='false' :drag-drop='true')
    section.section
      .content.has-text-centered
        p
          b-icon(icon='upload' size='is-large')
        p Drop a one-track MIDI file
  .load-example
    a(@click="loadExample('/example_midi.mid')") Load an example
</template>

<script>
import midiFileParser from 'midi-file-parser';

export default {
  methods: {
    parseMidi(file, fileName) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawMidiData = midiFileParser(e.target.result);
        const { midiEvents, infos } = this.midiDataToInfoAndEventTimes(rawMidiData);
        this.$emit('input', {
          fileName: fileName || file.name,
          midiEvents,
          infos,
        });
      };
      reader.readAsBinaryString(file);
    },
    midiDataToInfoAndEventTimes(midiData) {
      const processedData = {
        infos: [],
        midiEvents: [],
      };
      const midiSettings = {
        beatsPerTick: 1.0 / midiData.header.ticksPerBeat,
        secondsPerTick: 0,
      };
      midiData.tracks.forEach((track) => {
        let currentTime = 0;
        track.forEach((event) => {
          // console.log(event) //eslint-disable-line
          if (event.deltaTime) {
            currentTime += event.deltaTime * midiSettings.secondsPerTick;
          }
          if (event.subtype === 'setTempo') {
            const secondsPerBeat = event.microsecondsPerBeat / 1000000;
            midiSettings.secondsPerTick = secondsPerBeat * midiSettings.beatsPerTick;
          }
          if (event.type === 'meta') {
            processedData.infos.push(event.text);
          }
          if (['noteOn', 'noteOff'].includes(event.subtype)) {
            processedData.midiEvents.push({ ...event, timeSeconds: currentTime });
          }
        });
      });
      processedData.midiEvents.sort((e1, e2) => e1.timeSeconds - e2.timeSeconds);
      // console.log('events', processedData.midiEvents.slice(-1)[0]) //eslint-disable-line
      return processedData;
    },
    loadExample(url) {
      const self = this;
      this.$http.get(url, { responseType: 'blob' }).then((response) => {
        self.parseMidi(response.bodyBlob, url.split('/').slice(-1)[0]);
      });
    },
  },
  // mounted() {
  //   this.loadExample('/example_midi.mid');
  // },
};
</script>
<style lang="scss">
.midi-uploader {
  text-align: center;
}
</style>
