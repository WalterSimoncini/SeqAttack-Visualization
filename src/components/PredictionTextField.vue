<template>
  <div>
    <div class="columns">
        <div class="column">
            <b-field>
                <b-input v-model="sample"></b-input>
            </b-field>
        </div>

        <div class="column is-2">
            <b-field>
                <b-button
                    v-on:click="predict"
                    type="is-primary">Predict</b-button>
            </b-field>
        </div>
    </div>

    <div v-if="this.labels != null && !this.isLoading">
        <TaggedSample
            :sampleText="this.lastPredictedSample"
            :sampleLabels="this.labels"
            :differentIndices="[]" />
    </div>

    <sync-loader color="#7957d5" :loading="isLoading"></sync-loader>
  </div>
</template>

<script>

const axios = require("axios");

import TaggedSample from "@/components/TaggedSample.vue"
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'

export default {
    name: "PredictionTextField",
    components: {
        TaggedSample,
        SyncLoader
    },
    data() {
        return {
            sample: "My name is Wolfgang and I live in Berlin",
            lastPredictedSample: "My name is Wolfgang and I live in Berlin",
            labels: null,
            api: axios.create({
                baseURL: process.env.VUE_APP_API_ROOT
            }),
            isLoading: false
        }
    },
    methods: {
        predict: function () {
            let formattedString = this.sample.replaceAll(" ", "%20");
            let component = this;

            component.isLoading = true;

            this.api.get(`predict?sample=${formattedString}`).then(function (response) {
                if (response.status == 200) {
                    component.lastPredictedSample = response.data.sample;
                    component.labels = response.data.prediction;
                } else {
                    component.$buefy.toast.open({
                        message: "Error attacking sample. Please retry later",
                        type: "is-danger"
                    })
                }          
                
                component.isLoading = false;
            }).catch(function () {
                // Error handling
                component.isLoading = false;

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
