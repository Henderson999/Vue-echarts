// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import echarts from 'echarts'
import VueRouter from 'vue-router'
import axios from 'axios'
import IndexPage from './components/index'

Vue.use(VueRouter)
Vue.prototype.axios = axios
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false


let router = new VueRouter({
	 mode:'history',
	 routes:[
	 {
	 	path:'/',
	 	component: IndexPage
	 }
	 ]
   })


/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  components: { IndexPage },
  template: '<IndexPage/>'
})
