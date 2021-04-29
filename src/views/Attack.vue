<template>
    <div class="container is-fluid app-container">
        <h1 class="title is-1">Adversarial NER Attacks Browser</h1>

        <div class="file">
            <label class="file-label">
                <input class="file-input" type="file" id="file" ref="datasetFile" v-on:change="handleFileUpload()"/>

                <span class="file-cta">
                <span class="file-icon">
                    <i class="fas fa-file-upload"></i>
                </span>
                <span class="file-label">
                    Open Dataset
                </span>
                </span>
            </label>
        </div>

        <br/>

        <div v-for="(sample, sampleIndex) in samples" :key="sampleIndex">
            <h3 class="subtitle is-3">Attacked Sample</h3>

            <ul>
                <li>
                    <b>Original sample:</b> {{ sample.originalText }}
                </li>
                <li>
                    <b>Perturbed sample:</b> {{ sample.perturbedText }}
                </li>
            </ul>

            <br />

            <TaggedSample
                :sampleText="sample.originalText"
                :sampleLabels="sample.originalLabels"
                :differentIndices="sample.differentIndices" />

            <TaggedSample
                :sampleText="sample.perturbedText"
                :sampleLabels="sample.perturbedLabels"
                :differentIndices="sample.differentIndices" />
            <hr />
        </div>
    </div>
</template>

<script>

import TaggedSample from "@/components/TaggedSample.vue"

export default {
    name: "Attack",
    components: {
        TaggedSample
    },
    data: function () {
        return {
            samples: []
        }
    },
    mounted () {},
    methods: {
        processSample(sample) {
            let differentIndices = [];
            let originalTokens = sample.attacked_sample.split(" ");
            let perturbedTokens = sample.perturbed_text.split(" ");

            for (let i = 0; i < perturbedTokens.length; i++) {
                if (originalTokens[i] != perturbedTokens[i]) {
                    differentIndices.push(i);
                }
            }

            return {
                originalText: sample.attacked_sample,
                perturbedText: sample.perturbed_text,
                originalLabels: sample.original_labels,
                perturbedLabels: sample.perturbed_labels,
                differentIndices: differentIndices
            }
        },
        processDataset (dataset) {
            let successfulAttacks = dataset.filter(sample => sample.status.includes("SuccessfulAttackResult"));
            this.samples = successfulAttacks.map(this.processSample);
        },
        handleFileUpload () {
            let file = this.$refs.datasetFile.files[0];

            let reader = new FileReader();

            reader.readAsText(file, "UTF-8");

            reader.onload = evt => {
                this.processDataset(JSON.parse(evt.target.result));
            }

            reader.onerror = evt => {
                console.error(evt);
            }
        }
    }
};

</script>

<style scoped>

.file-cta {
    border-radius: 0px;
    border-color: rgba(0, 0, 0, 0);
    background-color: #ecf0f1;
}

</style>