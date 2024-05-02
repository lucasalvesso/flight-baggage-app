<template>
  <v-container>
    <h3>Histórico</h3>
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      style="margin: auto"
    ></v-progress-linear>
    <div v-for="(item, index) of ItemsMenu" :key="index" class="mt-6">
      <v-hover v-slot:default="{ hover }">
        <v-card
          elevation="12"
          :class="hover ? 'blue lighten-4' : 'green lighten-5'"
          hover
          :disabled="loading"
          height="100px"
          @click="open(item)"
        >
          <v-card-title>
            <v-icon class="ml-12 mt-4 justify-start" large>
              {{ item.icon }}
            </v-icon>
            <span class="mt-4" style="margin: auto">{{ item.name }}</span>
          </v-card-title>
        </v-card>
      </v-hover>
    </div>
    <v-dialog v-if="payload" v-model="dialog" width="700px">
      <v-card>
        <v-card-text>
          <flights-table
            v-if="selectedMenu === 'flights'"
            :list="payload"
          ></flights-table>
          <tickets-table
            v-else-if="selectedMenu === 'tickets'"
            :list="payload"
          ></tickets-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="cancel">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import FlightsTable from "./FlightsTable";
import TicketsTable from "./TicketsTable";
export default {
  name: "History",
  components: {
    FlightsTable,
    TicketsTable,
  },
  data: () => ({
    dialog: false,
    loading: false,
    selectedMenu: null,
  }),
  computed: {
    payload() {
      return this.$store.getters["getHistory"];
    },
    ItemsMenu() {
      return [
        { path: "tickets", name: "Bagagens" },
        { path: "flights", name: "Voos" },
      ];
    },
  },
  watch: {
    payload(val) {
      if (val.length > 0) {
        this.loading = false;
        this.dialog = true;
      }
    },
  },
  methods: {
    cancel() {
      this.dialog = false;
      this.$store.commit("setHistory", []);
    },
    open(item) {
      this.loading = true;
      this.selectedMenu = item.path;
      this.$store.dispatch("fetchHistory", {
        path: item.path,
      });
    },
  },
};
</script>
