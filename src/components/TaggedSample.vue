<template>
  <div>
    <div v-if="sample != null">
      <span
        class="tag word-tag"
        :style="word.style"
        v-for="(word, wordIndex) in sample" :key="wordIndex">
        {{ word.word }}

        <span class="label-tag per-tag" v-if="word.label.includes('PER')">
            {{ word.label }}
        </span>

        <span class="label-tag misc-tag" v-if="word.label.includes('MISC')">
            {{ word.label }}
        </span>

        <span class="label-tag loc-tag" v-if="word.label.includes('LOC')">
            {{ word.label }}
        </span>

        <span class="label-tag org-tag" v-if="word.label.includes('ORG')">
            {{ word.label }}
        </span>
      </span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TaggedSample',
  props: {
    sampleText: String,
    sampleLabels: Array,
    differentIndices: Array
  },
  data: function () {
    return {
      sample: null,
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
  mounted () {
    let output = [];
    let words = this.sampleText.split(" ");

    for (let i = 0; i < words.length; i++) {
      let fontWeight = "normal";
      let textDecoration = "initial";

      if (this.sampleLabels[i] != "O") fontWeight = "bold";

      if (this.differentIndices.includes(i)) {
        textDecoration = "3px solid #ff005c";
      }

      output.push({
          word: words[i],
          label: this.sampleLabels[i],
          style: {
              "background-color": this.backgroundColorMap[this.sampleLabels[i]],
              "color": this.textColorMap[this.sampleLabels[i]],
              "font-weight": fontWeight,
              "border-bottom": textDecoration,
              "border-radius": "0px"
          }
      });
    }

    this.sample = output;
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
