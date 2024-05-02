<template>
  <v-app>
    <v-app-bar v-if="userIsLogged" app color="primary" dark>
      <v-btn
        icon
        class="ml-0"
        :disabled="$route.path === '/home'"
        @click="$router.push({ path: '/home' })"
      >
        <v-icon>home</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon class="mr-0" @click="signOut = true">
        <v-icon class="ml-3">logout</v-icon>
        <sign-out :value="signOut"></sign-out>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view v-if="userIsLogged" />
      <sign-in v-else-if="!!$route.path.includes('sign')"></sign-in>
      <v-dialog
        v-if="!userIsLogged && !$route.path.includes('signin')"
        v-model="dialog"
        transition="dialog-bottom-transition"
        max-width="600"
        persistent
      >
        <v-card>
          <v-toolbar color="primary" dark>Sua sessão está expirada!</v-toolbar>
          <v-card-text>
            <div class="text-h4 pa-4 mt-6">Faça login novamente</div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              color="primary"
              @click="
                dialog = false;
                $router.push({ path: 'signin' });
              "
            >
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar
        v-if="snackbar && snackbar.time"
        :timeout="snackbar.time"
        :value="true"
        :color="snackbar.color"
        absolute
        height="60"
        bottom
        class="mb-6"
      >
        {{ snackbar.message }}
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import moment from "moment";
import SignOut from "@/components/SignOut";
import SignIn from "@/pages/sign/SignIn";
export default {
  name: "App",
  components: { SignOut, SignIn },

  data: () => ({
    //
    dialog: false,
    signOut: false,
    connected: true,
    snackbar: {
      time: null,
      color: null,
      message: null,
    },
  }),
  computed: {
    userIsLogged() {
      return true;
      // return !!(this.currentSession && this.validTime(this.currentSession.exp));
    },
    currentSession() {
      return this.$store.getters.getCurrentSession;
    },

    getRoutes() {
      return this.$router.options;
    },

    flights() {
      return this.$store.getters["getFlights"];
    },

    getAuthRoutes() {
      return this.getRoutes.routes.filter((opt) => {
        if (opt.path === "/sign") {
          //
        } else {
          return opt;
        }
      });
    },
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(prev, curr, next) {
      if (
        !this.userIsLogged ||
        (this.currentSession && !this.validTime(this.currentSession.exp))
      ) {
        this.$store.dispatch("fetchCurrentSession");
      }
    },

    currentSession() {
      if (!this.userIsLogged) {
        this.dialog = true;
      }
    },
  },

  beforeDestroy() {
    this.signOut = false;
  },

  async created() {
    setInterval(() => {
      this.$store.dispatch("fetchCurrentSession");
    }, 1000 * 60 * 10);

    this.$root.$on("message-snackbar", (val) => {
      this.snackbar = val;
      setTimeout(() => {
        this.snackbar = {};
      }, val.time);
    });

    this.$root.$on("get-data", async () => {
      await this.getData();
    });

    this.$root.$on("saveStoredItems", async () => {
      const connected = await this.checkConnection();
      if (connected) {
        const items = localStorage.getItem("tickets");
        if (JSON.parse(items) && JSON.parse(items).length > 0) {
          this.$store.dispatch("fetchMemorySaved");
        }

        const flights = this.flights.filter((opt) => opt.status === "ready");
        for (const flight of flights) {
          const item = localStorage.getItem("flight-" + flight.id);
          if (item) {
            this.$store.dispatch("fetchMemorySaveFlight", JSON.parse(item));
          }
        }
      }
    });
  },
  destroyed() {
    localStorage.removeItem("tickets");
  },
  async mounted() {
    // const filterDateStart = moment().set({hour: 0, minutes: 0, seconds: 0}).unix();
    // const filterDateEnd = moment().set({hour: 23, minutes: 59, seconds: 59}).unix();
    // const ticketsFilter = {dtRange: `${filterDateStart}|${filterDateEnd}`};
    this.$root.$emit("get-data");
  },

  methods: {
    async checkConnection() {
      return navigator.onLine;
    },

    async getData() {
      const ticketsFilter = { status: "opened" };
      const work = [
        this.$store.dispatch("fetchData", { path: "bases" }),
        this.$store.dispatch("fetchData", { path: "flights" }),
        this.$store.dispatch("fetchData", { path: "planes" }),
        this.$store.dispatch("fetchData", {
          path: "tickets",
          filter: ticketsFilter,
        }),
      ];

      await Promise.allSettled(work);
    },
    validTime(time) {
      return time > moment().unix();
    },
  },
};
</script>
<style>
@import url("//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons");
</style>
