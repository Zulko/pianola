<template lang="pug">
g.piano-key
  g(v-if='isBlackKey')
    rect(
      width='14'
      height='60',
      :style="`fill:${isPressed ? '#black' : '#222222'};z-index: 0;`"
      :x='keyCenterX - 7'
    )
    ellipse(
      v-if='isPressed',
      :cx='keyCenterX',
      :cy='40',
      :rx='6',
      :ry='18',
      style='fill: yellow;stroke:black;stroke-width:3'
    )
  g(v-else)
    rect(
      width='20'
      height='100',
      :style="`fill:${isPressed ? '#dddddd' : 'white'};stroke:black;stroke-width:1; z-index: 1;`"
      :x='keyCenterX - 10'
    )
    ellipse(
      v-if='isPressed',
      :cx='keyCenterX',
      :cy='80',
      :rx='5',
      :ry='15',
      style='fill: yellow;stroke:black;stroke-width:3'
    )
</template>

<script>
import { midiNoteIsBlackKey, midiNoteToOctaveAndNote } from './tools';

export default {
  props: {
    midiNote: { type: Number },
    isPressed: { type: Boolean },
  },
  data() {
    const { octave, note } = midiNoteToOctaveAndNote(this.midiNote);
    return {
      keyCenterX: 10 * (14 * octave + note + (note > 4)) - 90,
      isBlackKey: midiNoteIsBlackKey(this.midiNote),
    };
  },
  methods: {},
};
</script>
