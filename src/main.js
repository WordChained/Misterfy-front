import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vueDebounce from 'vue-debounce'
import './style/style.scss'
import VueSocialSharing from 'vue-social-sharing'
Vue.config.productionTip = false

Vue.use(VueSocialSharing);
import VueParticles from 'vue-particles'
Vue.use(VueParticles)


import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
import VueCarousel from 'vue-carousel';
Vue.use(VueCarousel);


Vue.use(vueDebounce, {
    defaultTime: '700ms'
})
Vue.use(VuePlyr, {
    plyr: {}
})


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')