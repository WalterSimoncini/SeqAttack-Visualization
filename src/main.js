import Vue from 'vue'
import App from './App.vue'

import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/default.css' // or other highlight.js theme

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import router from './router'

Vue.config.productionTip = false

Vue.use(Buefy);
Vue.use(VueHighlightJS);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
