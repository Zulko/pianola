import Vue from 'vue';
import Buefy from 'buefy';
import VueResource from 'vue-resource';
import App from './App.vue';
import 'buefy/dist/buefy.css';

Vue.use(VueResource);
Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
