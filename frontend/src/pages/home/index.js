const router = {
  name: 'Home',
  path: '/home',
  alias: '/',
  component: () => import(/* webpackChunkName: "register" */ './Home.vue'),
};

module.exports = router;
