<template lang="pug">
.file-infos(v-if='fileName' v-model='fileName')
  p {{fileName}}
    a(@click="$emit('change')") [Change]
    b-collapse(:open='false')
      a(slot='trigger') [Infos]
      .infos
        hr
        h2 Infos
        ul
        li(v-for='info in infos' v-if="info") {{info}}
        hr
</template>
<script>
export default {
  props: {
    fileName: { type: String },
    infos: { type: Array },
  },
};
</script>
<style lang="scss">
.file-infos {
  margin-bottom: 3em;
}
</style>
