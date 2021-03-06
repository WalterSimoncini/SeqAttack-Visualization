<template>
    <div class="container is-fluid app-container">
        <h1 class="title is-1">Adversarial NER Attacks</h1>

        <p>This is a demo website for the paper <a href="https://aclanthology.org/2021.emnlp-demo.35.pdf" target="_blank" rel="noopener">SeqAttack: On Adversarial Attacks for Named Entity Recognition</a>. The video below demonstrates how the website works.</p>
        <p>Check out <a href="https://github.com/WalterSimoncini/SeqAttack" target="_blank" rel="noopener">SeqAttack on GitHub</a></p>

        <br/>

        <iframe
            width="560"
            height="315"
            src="https://www.youtube-nocookie.com/embed/7LkIDdLSuVQ"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
        </iframe>

        <br/><br/>

        <div class="columns">
            <div class="column is-6">
                <h4 class="subtitle is-4">Prediction</h4>
                <p>Predicts named entities in the input text using a bert-base-cased model fine-tuned on <a href="https://www.clips.uantwerpen.be/conll2003/ner/" target="_blank" rel="noopener">CoNLL2003</a>. The recognized entities are person names (PER), locations (LOC), organizations (ORG) and miscellaneous (MISC)</p><br/>
                <PredictionTextField />
            </div>
        </div>

        <div class="columns">
            <div class="column is-6">
                <h4 class="subtitle is-4">Attack</h4>
                <p>
                    Run an attack against a BERT-based model trained on <a href="https://www.clips.uantwerpen.be/conll2003/ner/" target="_blank" rel="noopener">CoNLL2003</a>.
                    Attacks are executed using our framework <a href="https://github.com/WalterSimoncini/SeqAttack" target="_blank" rel="noopener">SeqAttack</a>.
                    The following attack strategies are supported:
                </p>

                <br/>

                <ul>
                    <li><a href="https://arxiv.org/pdf/1801.04354.pdf" target="_blank" rel="noopener">DeepWordBug</a>: character-level attack. Supports character insertions, deletions, replacements and swaps (ab → ba)</li>
                    <li><a href="https://arxiv.org/pdf/1801.04354.pdf" target="_blank" rel="noopener">DeepWordBug (constrained)</a>: same as above, but the algorithm cannot attack named entities</li>
                    <li><a href="https://arxiv.org/pdf/2004.09984.pdf" target="_blank" rel="noopener">BERT-Attack</a>: word replacements using a bert-base-cased masked language model</li>
                    <li><a href="https://arxiv.org/pdf/1804.06059v1.pdf" target="_blank" rel="noopener">SCPN</a>: paraphrase generation</li>
                </ul>

                <br/>

                <p><b>WARNING:</b> BERT-Attack and SCPN may need a long compute time, thus attacks are limited to 30 seconds. After the timeout the attack will be considered failed.</p>

                <br/>
                <AttackTextField />
            </div>
        </div>

        <br/><br/>

        <h4 class="subtitle is-4">Dataset Visualization</h4>

        <p>
            Visualize an attacked dataset. Sample datasets for various attack strategies can be downloaded at the links belows.<br/>
            For each sample the top row contains the original text (with its ground truth prediction) and the bottom row its perturbed counterpart.<br/>
            We recommend to reload the page before loading a new dataset
        </p>

        <br/>

        <a class="file-link" v-on:click="downloadDataset('deepwordbug.json')">deepwordbug.json</a>
        <a class="file-link" v-on:click="downloadDataset('deepwordbug-constraint.json')">deepwordbug-constraint.json</a>
        <a class="file-link" v-on:click="downloadDataset('bert-attack.json')">bert-attack.json</a>
        <a class="file-link" v-on:click="downloadDataset('scpn.json')">scpn.json</a>

        <br/><br/>

        <div class="file">
            <label class="file-label">
                <input class="file-input" type="file" id="file" ref="datasetFile" v-on:change="handleFileUpload()"/>

                <span class="file-cta header-btn">
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

        <div v-if="metrics != null">
            <div class="card">
                <div class="card-content">
                    <div class="content">
                        <p>Micro averaged metrics</p>

                        <div class="columns">
                            <div class="column metric-column-border">
                                <MetricsBlock
                                    metricName="Accuracy"
                                    :originalValue="metrics.original['micro avg'].precision"
                                    :perturbedValue="metrics.attacked['micro avg'].precision" />
                            </div>

                            <div class="column metric-column-border padded-metric">
                                <MetricsBlock
                                    metricName="Recall"
                                    :originalValue="metrics.original['micro avg'].recall"
                                    :perturbedValue="metrics.attacked['micro avg'].recall" />
                            </div>

                            <div class="column padded-metric">
                                <MetricsBlock
                                    metricName="F1"
                                    :originalValue="metrics.original['micro avg']['f1-score']"
                                    :perturbedValue="metrics.attacked['micro avg']['f1-score']" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <br />
            <br />

            <div class="columns">
                <div class="column">
                    <MetricsTable :metrics="metrics.original" tableTitle="Original Dataset" />
                </div>
                <div class="column">
                    <MetricsTable :metrics="metrics.attacked" tableTitle="Attacked Dataset" />
                </div>
            </div>

            <br />
        </div>

        <div v-if="this.meta.length > 0">
            <h3 class="subtitle is-3">Attack Parameters</h3>

            <b-table
                :striped="true"
                :data="meta"
                :columns="columns">
            </b-table>
        </div>

        <div v-for="(sample, sampleIndex) in samples" :key="sampleIndex">
            <h3 class="subtitle is-3">Attacked Sample</h3>

            <b-field>
                <b-switch v-model="sample.picked">
                    Pick Sample
                </b-switch>
            </b-field>

            <p><b>Original sample:</b> {{ sample.originalText }}</p>
            <p><b>Perturbed sample:</b> {{ sample.perturbedText }}</p>

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

        <b-button
            v-on:click="downloadSamples"
            id="download-button"
            type="is-primary">
            Download Picked
        </b-button>
    </div>
</template>

<script>

import TaggedSample from "@/components/TaggedSample.vue"
import MetricsBlock from "@/components/MetricsBlock.vue"
import MetricsTable from "@/components/MetricsTable.vue"

import PredictionTextField from "@/components/PredictionTextField.vue"
import AttackTextField from "@/components/AttackTextField.vue"

import download from "downloadjs"

const axios = require("axios");

export default {
    name: "Visualize",
    components: {
        TaggedSample,
        MetricsBlock,
        MetricsTable,
        PredictionTextField,
        AttackTextField
    },
    data: function () {
        return {
            apiRoot: process.env.VUE_APP_API_ROOT,
            samples: [],
            columns: [
                {
                    field: "property_name",
                    label: 'Property Name',
                },
                {
                    field: "value",
                    label: 'Value',
                }
            ],
            meta: [],
            metrics: null
        }
    },
    mounted () {},
    methods: {
        downloadDataset (filename) {
            axios.get(`${process.env.VUE_APP_API_ROOT}/datasets/${filename}`).then(function (response) {
                download(JSON.stringify(response.data), filename, "application/json");
            })
        },
        downloadSamples () {
            let pickedSamples = [];

            for (let i = 0; i < this.samples.length; i++) {
                let sample = this.samples[i];

                if (sample.picked) {
                    pickedSamples.push([
                        sample.perturbedText, sample.groundTruth
                    ]);
                }
            }

            let outputJSON = {
                "samples": pickedSamples
            }

            download(JSON.stringify(outputJSON), "picked-samples.json", "application/json");
        },
        processSample(sample) {
            let differentIndices = [];
            let originalTokens = sample.original_text.split(" ");
            let perturbedTokens = sample.perturbed_text.split(" ");

            for (let i = 0; i < perturbedTokens.length; i++) {
                if (originalTokens[i] != perturbedTokens[i]) {
                    differentIndices.push(i);
                }
            }

            return {
                originalText: sample.original_text,
                perturbedText: sample.perturbed_text,
                originalLabels: sample.original_pred_labels,
                perturbedLabels: sample.perturbed_pred_labels,
                differentIndices: differentIndices,
                picked: false,
                groundTruth: sample.final_ground_truth
            }
        },
        processDataset (dataset) {
            let meta = [];

            this.metrics = dataset.metrics;
            
            if ("config" in dataset) {
                let metaKeys = Object.keys(dataset.config);

                for (let i = 0; i < metaKeys.length; i++) {
                    let key = metaKeys[i];
                    let value = dataset.config[key];

                    if (typeof value === "object" && value != null) {
                        value = JSON.stringify(value);
                    }

                    key = key.replaceAll("_", " ");

                    meta.push({
                        "property_name": key,
                        "value": value
                    })
                }
            }

            dataset = dataset.attacked_examples;

            let successfulAttacks = dataset.filter(sample => sample.status.includes("Successful"));

            this.meta = meta;
            this.samples = successfulAttacks.map(this.processSample);

            console.log(this.samples);
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

.code-pre {
    padding: 0px;
    background-color: white;
}

.metric-column-border {
    border-right: 2px solid rgba(0, 0, 0, 0.1);
}

.padded-metric {
    padding-left: 24px;
}

#download-button {
    position: fixed;
    bottom: 16px;
    right: 16px;
}

.header-btn {
    margin-right: 16px;
}

.file-link {
    margin-right: 16px;
    text-decoration: underline;
}

li {
    list-style-type: disc !important;
    margin-left: 16px;
}

</style>