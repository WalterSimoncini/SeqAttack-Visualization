<template>
  <div>
    <h4 class="subtitle is-4 metrics-subtitle">
      {{ this.metricName }}
    </h4>

    <p class="is-size-3 metrics-value">
        {{ this.perturbedValue.toFixed(5) }}
    </p>

    <p class="is-size-6">
        Original: {{ this.originalValue.toFixed(5) }} (<i class="fas fa-long-arrow-alt-down"></i> {{ (metricChange * 100).toFixed(2) }}%)
    </p>
  </div>
</template>

<script>

export default {
  name: 'MetricsBlock',
  props: {
    metricName: String,
    originalValue: Number,
    perturbedValue: Number
  },
  computed: {
    metricChange: function () {
      // Percentage points change in the metric
      return (1 - (this.perturbedValue / this.originalValue)).toFixed(2)
    }
  }
}

</script>

<style scoped>

.metrics-subtitle {
    margin-bottom: 8px !important;
}

.metrics-value {
    margin-bottom: 0px !important;
}

</style>
