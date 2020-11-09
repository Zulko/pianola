<template lang="pug">
.keyboard
  svg.keyboard-svg(

    :height='0.6 * scale * 100',
    viewBox="0 0 1040 100",
    preserveAspectRatio='none',
    xmlns="http://www.w3.org/2000/svg",
    style='background-color: blue;'
  )
    piano-key(
      v-for='midiNote in 88',
      v-if='!midiNoteIsBlackKey(midiNote)'
      :key='"white-" + midiNote',
      :midiNote='midiNote',
      :isPressed='pressedKeys.includes(midiNote + 21)'
    )
    piano-key(
      v-for='midiNote in 88',
      v-if='midiNoteIsBlackKey(midiNote)'
      :key='"black-" + midiNote',
      :midiNote='midiNote',
      :isPressed='pressedKeys.includes(midiNote + 21)'
    )
</template>

<script>
import PianoKey from './PianoKey.vue';
import { midiNoteIsBlackKey } from './tools';

console.log('bla', midiNoteIsBlackKey) //eslint-disable-line
export default {
  props: {
    pressedKeys: { default: () => ([]), type: Array },
    scale: { default: 1, type: Number },
  },
  components: {
    'piano-key': PianoKey,
  },
  methods: {
    midiNoteIsBlackKey(midiNote) {
      return midiNoteIsBlackKey(midiNote);
    },
  },
};
</script>
<style lang="scss">
.keyboard {
  width: 100%;
  margin: 0 auto;
  max-width: 1040px;
  .keyboard-svg {
    width: 100%;
  }
}
</style>
