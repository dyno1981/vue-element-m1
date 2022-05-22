import Vue from 'vue'
import VueRouter from 'vue-router'
import auth from '@/routes/auth'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [...auth],
})
