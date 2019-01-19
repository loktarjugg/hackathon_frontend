import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'iview'
import Web3 from 'web3'
import 'iview/dist/styles/iview.css'
import '@/assets/scss/index.scss'
Vue.use(iView)

require('./bootstrap')

Vue.config.productionTip = false

window.addEventListener('load', function () {
  if (typeof window.ethereum !== 'undefined' ||
  (typeof window.web3 !== 'undefined')) {
    // Web3 browser user detected. You can now use the provider.
    const provider = window['ethereum'] || window.web3.currentProvider
    window.web3 = new Web3(provider)
  }

  /* eslint-disable no-new */
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})
