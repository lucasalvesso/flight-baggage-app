const router = [
  {
    name: 'Scan',
    path: '/scan',
    component: () => import(/* webpackChunkName: "register" */ './Scan.vue'),
  },
  {
    name: 'Generate QR Code',
    path: '/genqr',
    component: () =>
      import(/* webpackChunkName: "register" */ './GenerateQR.vue'),
  },
];

module.exports = router;
