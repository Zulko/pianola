function midiNoteToOctaveAndNote(midiNote) {
  return {
    octave: Math.floor((midiNote + 8) / 12),
    note: (midiNote + 8) % 12,
  };
}
function midiNoteIsBlackKey(midiNote) {
  const { note } = midiNoteToOctaveAndNote(midiNote);
  return [1, 3, 6, 8, 10].includes(note);
}

export {
  midiNoteToOctaveAndNote,
  midiNoteIsBlackKey,
};
