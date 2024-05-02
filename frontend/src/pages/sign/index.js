// import VueRouter from "vue-router";
const router = [
  {
    name: 'SigUp',
    path: '/signup',
    component: () => import(/* webpackChunkName: "signup" */ './SignUp.vue'),
  },
  {
    name: 'SigIn',
    path: '/signin',
    component: () => import(/* webpackChunkName: "signin" */ './SignIn.vue'),
  },
];

module.exports = router;
