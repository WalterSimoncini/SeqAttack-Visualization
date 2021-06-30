<template>
  <div>
    <div class="columns">
        <div class="column">
            <b-field>
                <b-input v-model="sample"></b-input>
            </b-field>
        </div>

        <div class="column is-3">
            <b-select v-model="attackStrategy" placeholder="Attack strategy">
                <option
                    v-for="option in attackStrategies"
                    :value="option"
                    :key="option">
                    {{ option }}
                </option>
            </b-select>
        </div>

        <div class="column is-2">
            <b-field>
                <b-button
                    v-on:click="attack"
                    type="is-primary">Attack</b-button>
            </b-field>
        </div>
    </div>

    <p v-if="this.labels != null && !this.isLoading" class="is-6"><b>Attack status:</b> {{ attackStatus }}<br/><br/></p>

    <div v-if="this.labels != null && !this.isLoading">
        <TaggedSample
            :sampleText="this.lastPredictedSample"
            :sampleLabels="this.labels"
            :differentIndices="[]" />
    </div>

    <div v-if="this.attackedLabels != null && !this.isLoading">
        <TaggedSample
            :sampleText="this.attackedSample"
            :sampleLabels="this.attackedLabels"
            :differentIndices="this.attackedIndices" />
    </div>

    <sync-loader color="#7957d5" :loading="isLoading"></sync-loader>
  </div>
</template>

<script>

const axios = require("axios");

import TaggedSample from "@/components/TaggedSample.vue"
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'

export default {
    name: "AttackTextField",
    components: {
        TaggedSample,
        SyncLoader
    },
    data() {
        return {
            sample: "My name is Wolfgang and I live in Berlin",
            lastPredictedSample: "My name is Wolfgang and I live in Berlin",
            labels: null,
            attackedLabels: null,
            attackedSample: null,
            attackStrategy: null,
            isLoading: false,
            attackStatus: "",
            api: axios.create({
                baseURL: process.env.VUE_APP_API_ROOT
            }),
            attackStrategies: [
                "deepwordbug",
                "deepwordbug-constraint",
                "bert-attack",
                "scpn"
            ],
            attackedIndices: []
        }
    },
    methods: {
        attack: function () {
            let formattedString = this.sample.replaceAll(" ", "%20");
            let component = this;

            component.isLoading = true;

            this.api.get(`attack?sample=${formattedString}&strategy=${this.attackStrategy}`).then(function (response) {
                if (response.status == 200) {
                    if (response.data.status === "ErrorAttackResult") {
                        component.$buefy.toast.open({
                            message: "Error attacking sample. Please retry with a different sample",
                            type: "is-danger"
                        })
                    } else {
                        component.lastPredictedSample = response.data.attacked_sample;
                        component.labels = response.data.original_labels;
                        component.attackedSample = response.data.perturbed_text;
                        component.attackedLabels = response.data.perturbed_labels;

                        let differentIndices = [];

                        let originalWords = component.lastPredictedSample.split(" ");
                        let attackedWords = component.attackedSample.split(" ");

                        for (let i = 0; i < attackedWords.length; i++) {
                            if (originalWords[i] != attackedWords[i]) {
                                differentIndices.push(i);
                            }
                        }

                        component.attackedIndices = differentIndices;
                        component.attackStatus = response.data.status.replaceAll("AttackResult", "");
                    }
                } else {
                    // Error handling
                    component.$buefy.toast.open({
                        message: "Error attacking sample. Please retry later",
                        type: "is-danger"
                    })
                }

                component.isLoading = false;
            }).catch(function (err) {
                // Error handling
                component.isLoading = false;
                console.log(err);

                component.$buefy.toast.open({
                    message: "Error attacking sample. Please retry later",
                    type: "is-danger"
                })
            })
        }
    }
}

</script>

<style scoped>

</style>
