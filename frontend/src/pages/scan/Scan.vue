<template>
  <v-container>
    <v-card class="fill-height pa-4" style="margin: auto" elevation="12">
      <v-card-text class="pa-2">
        <div class="mb-6 elevation-12">
          <div
            class="v-card__title justify-center text--black mb-1 justify-space-between"
          >
            <span style="margin: auto">
              {{
                openedTickets.length > 0
                  ? "Etiquetas em aberto"
                  : "Sem etiquetas em aberto"
              }}
            </span>
            <v-btn @click="refresh" color="primary" small>
              Atualizar
              <v-icon>refresh</v-icon>
            </v-btn>
          </div>

          <v-card class="d-flex flex-row-reverse mr-4" flat>
            <v-card v-for="(n, i) of filters" :key="i" class="pa-1" flat>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <span v-if="n.type === 'text'" class="mr-2 pa-4">
                    {{ n.text }}
                  </span>
                  <v-btn
                    v-else-if="n.type === 'button'"
                    :color="n.color"
                    @click="actionFilter(n.value)"
                    x-small
                  >
                    {{ n.text }}
                  </v-btn>
                  <v-btn
                    v-else
                    color="primary"
                    dark
                    outlined
                    v-bind="attrs"
                    v-on="on"
                    x-small
                  >
                    {{ n.text }}
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) of getOptionFilter(n.value)"
                    :key="index"
                    @click="selectFilter(n.value, item.value)"
                  >
                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card>
          </v-card>

          <v-simple-table v-if="openedTickets.length > 0" height="270px">
            <template v-slot:default>
              <thead>
                <tr>
                  <th
                    v-for="(opt, index) of headers"
                    :key="index"
                    class="text-left"
                  >
                    {{ opt.text }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(opt, index) of getOpenedTicketsFiltered"
                  :key="index"
                >
                  <td>
                    {{
                      getTicketName(
                        flights.find((fl) => fl.value === opt.flight)
                      )
                    }}
                  </td>
                  <td>{{ opt.protocol }}</td>
                  <td>
                    <v-btn icon @click="setCurrent(opt.protocol, index)">
                      <v-icon>touch_app</v-icon>
                    </v-btn>
                  </td>
                  <td>
                    <v-btn icon @click="deleteCurrent(opt.protocol)">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
        <div v-for="(item, index) of ItemsMenu" :key="index" class="mt-0 pa-6">
          <v-hover v-slot:default="{ hover }">
            <v-card
              elevation="12"
              :class="hover ? 'blue lighten-4' : 'green lighten-5'"
              hover
              :disabled="openedTickets.length === 0"
              class="mb-n4"
              height="100px"
              @click="setDialog(item.dialog)"
            >
              <v-card-title>
                <span class="mt-4" style="margin: auto">{{ item.name }}</span>
              </v-card-title>
            </v-card>
          </v-hover>
        </div>
      </v-card-text>
      <v-dialog v-model="dialog" width="400px" persistent>
        <v-card v-if="current">
          <v-card-title>Confirme as informações</v-card-title>
          <v-card-text>
            <div>{{ "Data: " + getDateHour(current.flightDate) }}</div>
            <div>
              {{
                "Aeronave: " +
                airplanes.find((opt) => opt.id === current.airplane).name
              }}
            </div>
            <div>{{ "Protocolo: " + current.protocol }}</div>
            <div>
              {{
                current.additional_info
                  ? "Informações adicionais: " + current.additional_info
                  : ""
              }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="mr-2" @click="cancelAdd">Cancelar</v-btn>
            <v-btn color="primary" @click="saveTicket" :loading="loading">
              Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
    <v-dialog v-model="dialogManualScan" persistent>
      <v-card>
        <v-card-title class="justify-center">Selecione o Voo</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="flight"
            filled
            :items="flights"
            return-object
            placeholder="Voo"
          ></v-autocomplete>
          <v-select
            v-if="flight"
            :items="scanTickets"
            v-model="current"
            @input="dialog = true"
            item-text="protocol"
            return-object
            clearable
            filled
            placeholder="Etiqueta"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-2" @click="dialogManualScan = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="readyFlightDialog" persistent>
      <v-card>
        <v-card-title class="justify-center">Voo Pronto</v-card-title>
        <v-card-text class="text-subtitle-1">
          {{ readyFlight ? readyFlight.text : "" }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!--          <v-btn @click="readyFlightDialog = false" color="error">-->
          <!--            Cancelar-->
          <!--          </v-btn>-->
          <v-btn class="mr-2" @click="letFlight" color="primary">
            Liberar Voo
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogScanQR" persistent>
      <v-card>
        <v-card-title class="justify-center">
          Faça a leitura do QR code da etiqueta na bagagem
        </v-card-title>
        <v-card-text>
          <div
            class="text-subtitle-2 error--text underlineOnHover"
            @click="setDialog('dialogManualScan')"
          >
            {{ "Problemas com a leitura do código?" }}
          </div>
          <qrcode-stream @decode="onDecode" @init="onInit"></qrcode-stream>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-2" @click="dialogScanQR = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog" persistent width="400px">
      <v-card>
        <v-card-title>Confirme a exclusão</v-card-title>
        <v-card-text>Deseja realmente excluir a etiqueta?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="deleteCurrent(selectedProtocol, true)"
            class="mr-2"
            color="error"
            :loading="loading"
          >
            Excluir
          </v-btn>
          <v-btn @click="deleteDialog = false" :disabled="loading">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { QrcodeStream } from "vue-qrcode-reader";
import moment from "moment";

export default {
  components: { "qrcode-stream": QrcodeStream },
  name: "Scan",
  data() {
    return {
      result: "",
      error: "",
      deleteDialog: false,
      selectedProtocol: null,
      flight: null,
      filter: {
        flights: null,
        origins: null,
      },
      currentIndex: null,
      current: null,
      loading: false,
      dialog: false,
      readyFlight: null,
      readyFlightDialog: false,
      dialogScanQR: false,
      dialogManualScan: false,
    };
  },
  computed: {
    filters() {
      return [
        { type: "button", text: "Limpar Filtro", color: "error" },
        { text: "Origem", value: "origins" },
        { text: "Voo", value: "flights" },
        { type: "text", text: "Filtros" },
      ];
    },

    origins() {
      return this.listBases
        .filter((opt) => opt.type === "origin")
        .map((opt) => {
          return { text: opt.name, value: opt.id };
        });
    },
    destinations() {
      return this.listBases
        .filter((opt) => opt.type === "destination")
        .map((opt) => {
          return { text: opt.name, value: opt.id, color: opt.color };
        });
    },
    listBases() {
      return this.$store.getters["getBases"];
    },

    headers() {
      return [
        { text: "Voo", value: "flight" },
        { text: "Protocolo", value: "protocol" },
        { text: "Validar", value: "actions" },
        { text: "Excluir", value: "actions" },
      ];
    },

    openedTickets() {
      return this.tickets
        .filter((opt) => opt.status === "opened")
        .map((opt) => {
          return {
            protocol: opt.protocol,
            flight: opt.flight,
            date: opt.flightDate,
            origin: opt.origin,
          };
        })
        .sort((a, b) => {
          return moment(a.date) - moment(b.date);
        });
    },

    ItemsMenu() {
      return [
        { name: "Leitura", dialog: "dialogScanQR" },
        // { name: 'Seleção Manual', dialog: 'dialogManualScan' },
      ];
    },

    scanTickets() {
      return this.flight
        ? this.tickets.filter(
            (opt) => opt.flight === this.flight.id && opt.status === "opened"
          )
        : [];
    },

    airplanes() {
      return this.$store.getters["getAirplanes"];
    },

    flights() {
      return this.$store.getters["getFlights"].filter((opt) => {
        if (this.tickets.find((tik) => tik.flight === opt.id)) {
          opt.text = `${moment(opt.date).format(
            "DD/MM/YYYY HH:mm"
          )} ${this.getPlaneName(
            this.airplanes.find((air) => air.id === opt.airplane)
          )} | ${this.getBases({
            origin: opt.origin,
            destination: opt.destination,
          })}`;
          opt.value = opt.id;
          return opt;
        }
      });
    },
    tickets() {
      return this.$store.getters["getTickets"];
    },
    feedback() {
      return this.$store.getters["getFeedback"];
    },

    getOpenedTicketsFiltered() {
      return this.openedTickets.filter(
        (opt) =>
          (this.filter.flights ? opt.flight === this.filter.flights : opt) &&
          (this.filter.origins ? opt.origin === this.filter.origins : opt)
      );
    },

    anyReadyFlight() {
      return this.flights.filter(
        (opt) =>
          opt.status === "opened" &&
          this.tickets
            .filter((tik) => tik.flight === opt.id)
            .every((tik) => tik.status === "scanned")
      );
    },
  },
  watch: {
    anyReadyFlight(val) {
      if (val && val.length > 0) {
        this.readyFlight = val[0];
        this.saveFlight(this.readyFlight);
        this.readyFlightDialog = true;
      }
    },
    result(val) {
      const opt = this.tickets.find(
        (opt) =>
          opt.protocol === val.split("/")[1] && opt.flight === val.split("/")[0]
      );
      if (val && opt) {
        this.current = opt;
        this.dialog = true;
      }
    },

    feedback(val) {
      if (val && val.code === 200) {
        this.$root.$emit("message-snackbar", {
          message: "Adicionado com sucesso",
          time: 2000,
          color: "success",
        });
      } else {
        this.$root.$emit("message-snackbar", {
          message: "Não foi possível realizar a operação",
          time: 2000,
          color: "error",
        });
      }
      this.cancelAdd();
    },
  },

  mounted() {
    setInterval(() => {
      this.$root.$emit("saveStoredItems");
    }, 30000);
  },

  methods: {
    deleteCurrent(protocol, type = false) {
      this.selectedProtocol = protocol;
      if (type) {
        const ticket = this.tickets.find((opt) => opt.protocol === protocol);
        this.$store.dispatch("fetchDelete", {
          path: "tickets",
          id: `${ticket.flight}/${protocol}`,
          index: this.tickets.findIndex((opt) => opt.protocol === protocol),
        });
      } else {
        this.deleteDialog = true;
      }
    },

    getBase(type, id) {
      let obj;
      if (type === "destination") {
        obj = this.destinations.find((opt) => opt.value === id);
      } else if (type === "origin") {
        obj = this.origins.find((opt) => opt.value === id);
      }

      if (obj) return obj.text;
    },
    getBases(flight) {
      return `${this.getBase("origin", flight.origin)}/${this.getBase(
        "destination",
        flight.destination
      )}`;
    },
    saveFlight(val) {
      val.status = "ready";
      this.$store.dispatch("memorySaveFlight", {
        path: "flights",
        body: val,
        oldData: this.readyFlight,
      });
    },

    letFlight() {
      this.readyFlightDialog = false;
      // const body = { ...this.readyFlight };
      // body.status = 'closed';
      // this.$store.dispatch('fetchEdit', {
      //   path: 'flights',
      //   body: body,
      //   oldData: this.readyFlight,
      // });
    },
    actionFilter(val) {
      switch (val) {
        case "cancel":
          this.filter.flights = null;
          this.filter.origins = null;
      }
    },
    selectFilter(type, item) {
      this.filter[type] = item;
    },

    getOptionFilter(val) {
      return this[val];
    },

    refresh() {
      const tickets = localStorage.getItem("tickets");
      if (JSON.parse(tickets) && JSON.parse(tickets).length > 0) {
        this.$root.$emit("message-snackbar", {
          message:
            "Não foi possível concluir a operação pois você está sem conexão com a internet",
          time: 2000,
          color: "warning",
        });
      } else {
        const ticketsFilter = { status: "opened" };
        this.$store.dispatch("fetchData", { path: "flights", type: "force" });
        this.$store.dispatch("fetchData", {
          path: "tickets",
          filter: ticketsFilter,
          type: "force",
        });
      }
    },

    setCurrent(protocol, index) {
      this.currentIndex = index;
      this.current = this.tickets.find((opt) => opt.protocol === protocol);
      this.dialog = true;
    },

    getTicketName(val) {
      if (val) {
        return val.text;
      }
    },

    setDialog(dialog, value = true) {
      this[dialog] = value;
    },

    getPlaneName(obj) {
      return obj ? " - " + obj.name : "";
    },

    cancelAdd() {
      this.current = null;
      this.dialog = false;
      this.deleteDialog = false;
      this.loading = false;
      this.currentIndex = null;
      this.dialogManualScan = false;
    },

    getDateHour(opt) {
      return moment(opt).format("DD/MM/YYYY  HH:mm");
    },

    saveTicket() {
      this.loading = true;
      const ticket = { ...this.current };
      if (!this.currentIndex)
        this.currentIndex = this.openedTickets.findIndex(
          (opt) => opt.protocol === ticket.protocol
        );
      ticket.status = "scanned";
      this.$store.dispatch("memorySave", {
        type: "fetchEdit",
        data: {
          path: "tickets",
          body: ticket,
          oldData: this.current,
          index: this.currentIndex,
        },
      });
    },

    onDecode(decodedString) {
      // ...
      this.result = decodedString;
    },

    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        }
      }
    },
  },
};
</script>

<style>
.underlineOnHover:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
