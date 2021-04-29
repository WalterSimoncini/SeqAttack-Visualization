<template>
    <div class="container is-fluid app-container">
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

import jsonSamples from '@/datasets/sample.json';

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
    mounted () {
        let successfulAttacks = jsonSamples.filter(sample => sample.status.includes("SuccessfulAttackResult"));
        this.samples = successfulAttacks.map(this.processSample);

        console.log(this.samples);
    },
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
        }
    }
};

</script>

<style scoped>
</style>