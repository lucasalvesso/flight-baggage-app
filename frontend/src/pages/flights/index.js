const router = [
  {
    name: 'Flights',
    path: '/flights',
    component: () => import(/* webpackChunkName: "register" */ './Flights.vue'),
  },
  {
    name: 'Planes',
    path: '/planes',
    component: () => import(/* webpackChunkName: "register" */ './Planes.vue'),
  },
];

module.exports = router;
