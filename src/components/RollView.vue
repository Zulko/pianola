<template lang="pug">
.roll-view
  svg.roll-svg(
    :height='200',
    :viewBox='`${region[0]} 0 ${region[1] - region[0]} 88`',
    preserveAspectRatio='none',
    xmlns='http://www.w3.org/2000/svg'
  )
    rect.background(
      :width='duration',
      height='88',
      style='fill: #ebe9e4',
      :x='0',
      :y='0'
    )
    rect.segment(
      :width='segment[1] - segment[0]',
      height='88',
      style='fill: #fffaed',
      :x='segment[0]',
      :y='0'
    )
    rect.cursor(
      :width='0.2',
      height='88',
      style='fill: #d16060',
      :x='currentTime',
      :y='0'
    )
    rect.note(
      v-for='(note, i) in notes',
      :key='i',
      :width='note.duration',
      height='1',
      style='fill:black;',
      :x='note.timeSeconds',
      :y='88 + 21 - note.noteNumber'
    )
</template>

<script>
export default {
  props: {
    midiEvents: { type: Array },
    currentTime: { type: Number },
    region: { type: Array },
    segment: { type: Array },
  },
  data() {
    const notes = [];
    const noteOnEvents = {};
    this.midiEvents.forEach((event) => {
      if (event.subtype === 'noteOn') {
        noteOnEvents[event.noteNumber] = event;
      }
      if (event.subtype === 'noteOff') {
        const noteOnEvent = noteOnEvents[event.noteNumber];
        notes.push({
          ...noteOnEvent,
          duration: event.timeSeconds - noteOnEvent.timeSeconds,
        });
      }
    });
    const lastNote = notes.slice(-1)[0];
    const duration = Math.ceil(lastNote.timeSeconds + lastNote.duration);
    return { notes, duration };
  },
};
</script>
<style lang="scss">
.roll-view {
  width: 100%;
  margin: 0 auto;
  max-width: 1040px;
  .roll-svg {
    width: 100%;
  }
}
</style>
