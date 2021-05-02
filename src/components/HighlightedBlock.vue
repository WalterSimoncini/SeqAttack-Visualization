<template>
  <div style="display: inline">
    <span class="tag word-tag" :style="blockStyle">
        {{ token }}

        <span :class="`label-tag ${classMap[sampleLabel]}`" v-if="showLabel && sampleLabel != 'O'">
            {{ sampleLabel }}
        </span>
    </span>
  </div>
</template>

<script>

export default {
  name: 'HighlightedBlock',
  props: {
    token: String,
    sampleLabel: String,
    isPerturbed: Boolean,
    showLabel: Boolean
  },
  data: function () {
    return {
      blockStyle: null,
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
      },
      classMap: {
        "O": "",
        "B-MISC": "misc-tag",
        "I-MISC": "misc-tag",
        "B-PER": "per-tag",
        "I-PER": "per-tag",
        "B-ORG": "org-tag",
        "I-ORG": "org-tag",
        "B-LOC": "loc-tag",
        "I-LOC": "loc-tag",
      }
    }
  },
  mounted () {
    let fontWeight = "normal";
    let textDecoration = "initial";

    if (this.sampleLabel != "O") fontWeight = "bold";

    if (this.isPerturbed) {
        textDecoration = "3px solid #ff005c";
    }

    this.blockStyle = {
        "background-color": this.backgroundColorMap[this.sampleLabel],
        "color": this.textColorMap[this.sampleLabel],
        "font-weight": fontWeight,
        "border-bottom": textDecoration,
        "border-radius": "0px"
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