const router = [
  {
    name: 'Bases',
    path: '/bases',
    component: () => import(/* webpackChunkName: "register" */ './Bases.vue'),
  },
];

module.exports = router;
