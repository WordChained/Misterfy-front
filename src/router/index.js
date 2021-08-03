import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '@/views/home.vue'
import explore from '../views/explore.vue';
import dashboard from '../views/dashboard.vue';
import stationDetails from '../cmps/station-details.vue';
import stationAdd from '../cmps/station-add.vue';
import signupLogin from '@/views/signup-login.vue';
Vue.use(VueRouter)
const routes = [{
    path: '/',
    name: 'home',
    component: home
},
{
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
        import( /* webpackChunkName: "about" */ '../views/About.vue')
},
{
    path: '/explore/:name?/:tag?',
    component: explore
},
{
    path: '/dashboard',
    component: dashboard
},
{
    path: '/details/:stationId',
    component: stationDetails
},
{
    path: '/add',
    component: stationAdd
},
{
    path: '/signup',
    component: signupLogin
},
]

const router = new VueRouter({
    routes
})

export default router