import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from '@/routes/index'
import localforage from 'localforage'
import Vlf from 'vlf'

Vue.use(Vlf, localforage)

Vue.config.productionTip = false

localforage.config({
  driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
  name: 'myApp',
  version: 1.0,
  size: 4980736, // Size of database, in bytes. WebSQL-only for now.
  storeName: 'keyvaluepairs', // Should be alphanumeric, with underscores.
  description: 'some description',
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
