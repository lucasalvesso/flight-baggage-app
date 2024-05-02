import Vue from "vue";
import App from "./App.vue";
import Amplify from "aws-amplify";
import aws_exports from "./aws-exports";
import VueMask from "v-mask";
import VueHtmlToPaper from "vue-html-to-paper";

import {
  applyPolyfills,
  defineCustomElements,
} from "@aws-amplify/ui-components/loader";

import router from "./router";
import vuetify from "./plugins/vuetify";
import pages from "@/pages";
import store from "./store";
import Vuelidate from "vuelidate";

Amplify.configure(aws_exports);
applyPolyfills().then(() => {
  defineCustomElements(window);
});

Vue.config.productionTip = false;
const basePath = document.location.origin;
const options = {
  name: "_blank",
  specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
  styles: [basePath + "/qr_code.css"],
  timeout: 1000, // default timeout before the print window appears
  autoClose: true, // if false, the window will not close after printing
  windowTitle: window.document.title, // override the window title
};

Vue.use(VueMask);
Vue.use(VueHtmlToPaper, options);

new Vue({
  router,
  pages,
  vuetify,
  store,
  Vuelidate,
  render: (h) => h(App),
}).$mount("#app");
