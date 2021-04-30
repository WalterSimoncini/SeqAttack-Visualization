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

        <div v-if="metrics != null">
            <div class="card">
                <div class="card-content">
                    <div class="content">
                        <div class="columns">
                            <div class="column metric-column-border">
                                <MetricsBlock
                                    :metricName="'Accuracy'"
                                    :originalValue="metrics.original.accuracy"
                                    :perturbedValue="metrics.perturbed.accuracy" />
                            </div>

                            <div class="column metric-column-border padded-metric">
                                <MetricsBlock
                                    :metricName="'Recall'"
                                    :originalValue="metrics.original.recall"
                                    :perturbedValue="metrics.perturbed.recall" />
                            </div>

                            <div class="column padded-metric">
                                <MetricsBlock
                                    :metricName="'F1'"
                                    :originalValue="metrics.original.f1"
                                    :perturbedValue="metrics.perturbed.f1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <br />
        </div>

        <div v-if="this.meta.length > 0">
            <h3 class="subtitle is-3">Attack Parameters</h3>

            <b-table
                :striped="true"
                :data="meta"
                :columns="columns"></b-table>

            <pre class="code-pre" v-highlightjs="command">
                <code></code>
            </pre>
        </div>

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
import MetricsBlock from "@/components/MetricsBlock.vue"


export default {
    name: "Attack",
    components: {
        TaggedSample,
        MetricsBlock
    },
    data: function () {
        return {
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
            let meta = [];

            this.metrics = dataset.metrics
            
            if ("meta" in dataset) {
                let metaKeys = Object.keys(dataset.meta);
                let command = "";

                for (let i = 0; i < metaKeys.length; i++) {
                    let key = metaKeys[i];
                    let value = dataset.meta[key];

                    if (key != "script") {
                        command = command.concat(`--${key.replaceAll("_", "-")} ${value} \\ \n`);
                    }

                    key = key.replaceAll("_", " ");

                    meta.push({
                        "property_name": key,
                        "value": value
                    })
                }

                this.command = `${dataset.meta.script} \\ \n${command}`;
                dataset = dataset.attacked_samples;
            }

            let successfulAttacks = dataset.filter(sample => sample.status.includes("SuccessfulAttackResult"));

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

</style>