<template>
    <div>
        <h4 class="subtitle is-4">{{ tableTitle }}</h4>

        <table class="table is-fullwidth">
            <thead>
                <tr>
                    <th>Class</th>
                    <th>Precision</th>
                    <th>Recall</th>
                    <th>F1</th>
                    <th>Support</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <HighlightedBlock
                            :token="'LOC'"
                            :sampleLabel="'B-LOC'"
                            :isPerturbed="false"
                            :showLabel="false" />
                    </td>

                    <td>{{ metrics.LOC.precision.toFixed(2) }}</td>
                    <td>{{ metrics.LOC.recall.toFixed(2) }}</td>
                    <td>{{ metrics.LOC["f1-score"].toFixed(2) }}</td>
                    <td>{{ metrics.LOC.support }}</td>
                </tr>
                <tr>
                    <td>
                        <HighlightedBlock
                            :token="'MISC'"
                            :sampleLabel="'B-MISC'"
                            :isPerturbed="false"
                            :showLabel="false" />
                    </td>

                    <td>{{ metrics.MISC.precision.toFixed(2) }}</td>
                    <td>{{ metrics.MISC.recall.toFixed(2) }}</td>
                    <td>{{ metrics.MISC["f1-score"].toFixed(2) }}</td>
                    <td>{{ metrics.MISC.support }}</td>
                </tr>
                <tr>
                    <td>
                        <HighlightedBlock
                            :token="'ORG'"
                            :sampleLabel="'B-ORG'"
                            :isPerturbed="false"
                            :showLabel="false" />
                    </td>

                    <td>{{ metrics.ORG.precision.toFixed(2) }}</td>
                    <td>{{ metrics.ORG.recall.toFixed(2) }}</td>
                    <td>{{ metrics.ORG["f1-score"].toFixed(2) }}</td>
                    <td>{{ metrics.ORG.support }}</td>
                </tr>
                <tr>
                    <td>
                        <HighlightedBlock
                            :token="'PER'"
                            :sampleLabel="'B-PER'"
                            :isPerturbed="false"
                            :showLabel="false" />
                    </td>

                    <td>{{ metrics.PER.precision.toFixed(2) }}</td>
                    <td>{{ metrics.PER.recall.toFixed(2) }}</td>
                    <td>{{ metrics.PER["f1-score"].toFixed(2) }}</td>
                    <td>{{ metrics.PER.support }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

import HighlightedBlock from "@/components/HighlightedBlock.vue"

export default {
  name: 'MetricsTable',
  components: {
      HighlightedBlock
  },
  props: {
    metrics: Object,
    tableTitle: String
  }
}

</script>

<style scoped>

td {
    vertical-align: middle;
}

</style>