<template lang='pug'>
.player
  b-field(label='Time')
    b-slider.time-segment-selector(
      v-model='currentTime',
      :custom-formatter='timeTooltipFormatter',
      :step='0.1',
      :min='0',
      :max='duration'
      indicator
    )
  b-field(label='Region selector')
    b-slider.time-segment-selector(
      v-model='timeRegion',
      :custom-formatter='timeTooltipFormatter',
      :min='0',
      :max='duration'
    )
  b-field(label='Segment selector')
    b-slider.time-segment-selector(
      v-model='timeSegment',
      :min='timeRegion[0]',
      :max='timeRegion[1]',
      :step='0.1',
      :custom-formatter='timeTooltipFormatter'
    )

  roll-view(
    :currentTime='currentTime',
    :midiEvents='midiEvents',
    :region='timeRegion',
    :segment='timeSegment'
  )
  piano-keyboard(:pressedKeys='pressedKeys')
  b-field.controls(grouped)
    b-button(@click='isPlaying = !isPlaying') {{ isPlaying ? "Pause" : "Play" }}
    b-field(label='Speed factor', label-position='on-border')
      b-select(v-model='speedFactor')
        option(
          v-for='i in [10, 20, 50, 80, 100, 120, 150, 200]',
          :key='i',
          :value='i / 100',
        ) {{i + '%'}}
</template>

<script>
import sfPlayer from 'soundfont-player';
import PianoKeyboard from './PianoKeyboard/PianoKeyboard.vue';
import RollView from './RollView.vue';

export default {
  props: {
    midiEvents: { type: Array },
    readingInterval: { type: Number, default: 0.5 },
  },
  data() {
    const duration = this.midiEvents.slice(-1)[0].timeSeconds;
    return {
      pressedKeys: [],
      duration,
      timeRegion: [0, duration],
      timeSegment: [0, duration],
      currentTime: 0,
      lastRead: {
        time: 0,
        index: 0,
      },
      speedFactor: 1,
      isPlaying: false,
      audioContext: null,
      instrumentName: 'acoustic_grand_piano',
      instrument: null,
      volumeFactor: 1,
      noteSounds: {},
      nextLoopTimeOut: null,
    };
  },
  components: {
    'piano-keyboard': PianoKeyboard,
    'roll-view': RollView,
  },
  methods: {
    timeTooltipFormatter(val) {
      return `${Math.floor(val / 60)}:${(val % 60).toFixed(1)}`;
    },
    playLoop() {
      const [segmentStart, segmentEnd] = this.timeSegment;
      const nextTime = Math.min(
        segmentEnd,
        this.currentTime + this.speedFactor * this.readingInterval,
      );
      let { midiEvents } = this;
      if (this.currentTime > this.lastRead.time) {
        midiEvents = midiEvents.slice(this.lastRead.index, midiEvents.length);
      }
      const incomingEvents = midiEvents.filter(
        (e) => e.timeSeconds >= this.currentTime && e.timeSeconds < nextTime,
      );
      const self = this;
      incomingEvents.forEach((e) => {
        setTimeout(() => {
          if (e.subtype === 'noteOff') {
            self.noteSounds[e.noteNumber].stop();
            self.pressedKeys = this.pressedKeys.filter(
              (note) => note !== e.noteNumber,
            );
          } else {
            self.noteSounds[e.noteNumber] = self.instrument.play(
              e.noteNumber,
              self.audioContext.currentTime,
              { gain: e.velocity / 128 },
            );
            self.pressedKeys = [...this.pressedKeys, e.noteNumber];
          }
        }, (1000 * (e.timeSeconds - this.currentTime)) / this.speedFactor);
      });
      this.nextLoopTimeOut = setTimeout(() => {
        if (self.isPlaying) {
          const time = self.currentTime + self.speedFactor * self.readingInterval;
          if (time > segmentEnd) {
            self.currentTime = segmentStart;
            self.pressedKeys = [];
          } else {
            self.currentTime = time;
          }
          self.playLoop();
        }
      }, 1000 * this.readingInterval);
    },
    releaseAllNotes() {
      this.pressedKeys.forEach((note) => this.noteSounds[note].stop());
      this.pressedKeys = [];
    },
  },
  watch: {
    isPlaying(playing) {
      if (playing) {
        this.playLoop();
      } else {
        const self = this;
        setTimeout(() => {
          self.releaseAllNotes();
        }, 1000 * 1.5 * this.readingInterval);
      }
    },
    timeSegment: {
      deep: true,
      handler(val) {
        this.releaseAllNotes();
        [this.currentTime] = val;
      },
    },
  },
  mounted() {
    const self = this;
    this.audioContext = new AudioContext({ latencyHint: 'interactive' });
    sfPlayer.instrument(
      this.audioContext,
      this.instrumentName,
      { soundfont: 'MusyngKite' },
    ).then((instrument) => { self.instrument = instrument; });
  },
  beforeDestroy() {
    clearTimeout(this.nextLoopTimeOut);
  },
};
</script>

<style>
.controls {
  margin-top: 2em;
}
</style>
