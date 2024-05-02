const router = {
  name: 'History',
  path: '/history',
  alias: '/',
  component: () => import(/* webpackChunkName: "register" */ './History.vue'),
};

module.exports = router;
