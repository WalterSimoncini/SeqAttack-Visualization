<template>
  <div>
    <span v-for="(word, wordIndex) in sample" :key="wordIndex">
      <HighlightedBlock
        :token="word.word"
        :sampleLabel="word.label"
        :isPerturbed="word.isPerturbed"
        :showLabel="true" />
    </span>
  </div>
</template>

<script>

import HighlightedBlock from "@/components/HighlightedBlock.vue"

export default {
  name: 'TaggedSample',
  components: {
    HighlightedBlock
  },
  props: {
    sampleText: String,
    sampleLabels: Array,
    differentIndices: Array
  },
  data: function () {
    return {
      backgroundColorMap: {
        "O": "#FFFFFF",
        "B-MISC": "rgba(237, 233, 254)",
        "I-MISC": "rgba(237, 233, 254)",
        "B-PER": "rgba(252, 231, 243)",
        "I-PER": "rgba(252, 231, 243)",
        "B-ORG": "rgba(204, 251, 241)",
        "I-ORG": "rgba(204, 251, 241)",
        "B-LOC": "rgba(250, 232, 255)",
        "I-LOC": "rgba(250, 232, 255)",
      },
      textColorMap: {
        "O": "#000000",
        "B-MISC": "rgba(91, 33, 182)",
        "I-MISC": "rgba(91, 33, 182)",
        "B-PER": "rgba(157, 23, 77)",
        "I-PER": "rgba(157, 23, 77)",
        "B-ORG": "rgba(17, 94, 89)",
        "I-ORG": "rgba(17, 94, 89)",
        "B-LOC": "rgba(134, 25, 143)",
        "I-LOC": "rgba(134, 25, 143)",
      }
    }
  },
  computed: {
    sample: function () {
      let output = [];
      let words = this.sampleText.split(" ");

      for (let i = 0; i < words.length; i++) {
        output.push({
            word: words[i],
            label: this.sampleLabels[i],
            isPerturbed: this.differentIndices.includes(i)
        });
      }

      return output
    }
  }
}

</script>

<style scoped>

.word-tag {
    margin: 8px;
    font-size: 14px;
    padding-top: 20px;
    padding-bottom: 20px;
}

.label-tag {
    padding: 4px;
    border-radius: 8px;
    font-size: 10px;
    margin-left: 8px;
}

.per-tag {
    color: rgba(252, 231, 243);
    background-color: rgba(236, 72, 153);
}

.misc-tag {
    color: rgba(237, 233, 254);
    background-color: rgba(139, 92, 246);
}

.loc-tag {
    color: rgba(250, 232, 255);
    background-color: rgba(217, 70, 239);
}

.org-tag {
    color: rgba(204, 251, 241);
    background-color: rgba(20, 184, 166);
}

</style>