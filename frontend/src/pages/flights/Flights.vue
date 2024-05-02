<template>
  <v-container>
    <v-card class="fill-height pa-4" style="margin: auto" elevation="12">
      <v-card-title class="justify-center">Lista de Voos</v-card-title>
      <v-card-text>
        <v-row dense class="mb-4">
          <v-spacer></v-spacer>
          <v-btn @click="dialog = true" color="primary">Adicionar</v-btn>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-progress-circular
              v-if="pageLoading"
              indeterminate
            ></v-progress-circular>
            <v-data-table v-else :items="list" :headers="headers">
              <template v-slot:item.date="{ item }">
                <span>{{ getDate(item.date) }}</span>
              </template>
              <template v-slot:item.status="{ item }">
                <span>{{ getStatus(item.status) }}</span>
              </template>
              <template v-slot:item.airplane="{ item }">
                <span>
                  {{
                    getPlaneName(
                      airplanes.find((opt) => opt.id === item.airplane)
                    )
                  }}
                </span>
              </template>
              <template v-slot:item.origin="{ item }">
                <span>
                  {{ getBase("origin", item.origin) }}
                </span>
              </template>
              <template v-slot:item.destination="{ item }">
                <span>
                  {{ getBase("destination", item.destination) }}
                </span>
              </template>
              <template v-slot:item.actions="{ item, index }">
                <v-btn
                  @click="
                    editFlight({
                      id: item.id,
                      date: item.date,
                      aero: item.airplane,
                      index: index,
                      origin: item.origin,
                      destination: item.destination,
                    })
                  "
                  icon
                  class="mr-2"
                >
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn
                  @click="
                    deleteFlight({
                      id: item.id,
                      aero: item.airplane,
                      date: item.date,
                      origin: item.origin,
                      destination: item.destination,
                      index: index,
                    })
                  "
                  icon
                >
                  <v-icon>delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
      <v-dialog v-model="dialog" persistent width="620px">
        <v-card class="fill-height pa-4" style="margin: auto" elevation="12">
          <v-card-title class="justify-center">
            {{ edit ? "Editar Voo" : "Novo Voo" }}
          </v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="6">
                <v-autocomplete
                  v-model="aero"
                  filled
                  item-text="name"
                  item-value="id"
                  :error-messages="aeroErrors"
                  :items="airplanes"
                  clearable
                  @blur="$v.aero.$touch()"
                  @change="$v.aero.$touch()"
                  placeholder="Aeronave"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="flightNumber"
                  filled
                  clearable
                  :error-messages="flightNumberErrors"
                  @blur="$v.aero.$touch()"
                  @change="$v.aero.$touch()"
                  placeholder="Número do Voo"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-menu
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :value="datePicker"
                      filled
                      :error-messages="dateErrors"
                      @blur="$v.datePicker.$touch()"
                      @change="$v.datePicker.$touch()"
                      append-icon="event"
                      placeholder="Data do Voo"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    locale="pt-br"
                    v-model="datePicker"
                    no-title
                    @input="
                      dateMenu = !dateMenu;
                      hourMenu = !hourMenu;
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-menu
                  v-model="hourMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :value="hourPicker"
                      filled
                      clearable
                      :error-messages="hourErrors"
                      @blur="$v.hourPicker.$touch()"
                      @change="$v.hourPicker.$touch()"
                      append-icon="watch_later"
                      placeholder="Hora do Voo"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    locale="pt-br"
                    :key="timePickerKey"
                    format="24hr"
                    v-model="hourPicker"
                    no-title
                    @input="hourMenu = !hourMenu"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-select
                  :items="getOrigins"
                  v-model="origin"
                  filled
                  label="Origem"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  :items="getDestinations"
                  v-model="destination"
                  :error-messages="destinationErrors"
                  filled
                  label="Destino"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="cancelAdd" class="mr-2">Cancelar</v-btn>
            <v-btn @click="addFlight" color="primary" :disabled="$v.$invalid">
              {{ editId ? "Editar" : "Salvar" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
    <v-dialog v-model="deleteDialog" persistent width="400px">
      <v-card>
        <v-card-title>Confirme a exclusão</v-card-title>
        <v-card-text>
          Deseja realmente excluir o voo
          <span class="text-subtitle-2">{{ getDate(this.date) }}</span>
          ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="deleteFlight({ type: 'confirm' })"
            class="mr-2"
            color="error"
            :loading="loading"
          >
            Excluir
          </v-btn>
          <v-btn @click="cancelAdd" :disabled="loading">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { required, minLength } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  name: "Flights",
  mixins: [validationMixin],
  validations: {
    destination: {
      required: required,
      valid: function (val, vm) {
        return val !== vm.origin;
      },
    },
    aero: { required: required },
    flightNumber: { required: required },
    datePicker: {
      required: required,
      minLength: minLength(10),
      dateValid: function (val) {
        return moment().diff(moment(val, "YYYY-MM-DD"), "days") <= 1;
      },
    },
    hourPicker: { required: required, minLength: minLength(5) },
  },
  data() {
    return {
      dialog: false,
      edit: false,
      editId: null,
      date: null,
      aero: null,
      flightNumber: null,
      origin: null,
      destination: null,
      hourPicker: null,
      datePicker: null,
      hourMenu: null,
      dateMenu: null,
      deleteDialog: false,
      loading: false,
      index: null,
      pageLoading: false,
      timePickerKey: 0,
    };
  },
  computed: {
    getOrigins() {
      return this.listBases
        .filter((opt) => opt.type === "origin")
        .map((opt) => {
          return { text: opt.name, value: opt.id };
        });
    },
    getDestinations() {
      return this.listBases
        .filter((opt) => opt.type === "destination")
        .map((opt) => {
          return { text: opt.name, value: opt.id };
        });
    },
    listBases() {
      return this.$store.getters["getBases"];
    },
    destinationErrors() {
      const errors = [];
      !this.$v.destination.required &&
        errors.push(`O campo ${"destino"} é obrigatório`);
      !this.$v.destination.valid &&
        errors.push("O destino deve ser diferente da origem");
      return errors;
    },
    aeroErrors() {
      const errors = [];
      !this.$v.aero.required &&
        errors.push(`O campo ${"aeronave"} é obrigatório`);
      return errors;
    },
    flightNumberErrors() {
      const errors = [];
      !this.$v.flightNumber.required &&
        errors.push(`O campo ${"Número do Voo"} é obrigatório`);
      return errors;
    },
    hourErrors() {
      const errors = [];
      !this.$v.hourPicker.required &&
        errors.push(`O campo ${"data"} é obrigatório`);
      !this.$v.hourPicker.minLength &&
        errors.push("Preencha o campo corretamente");
      return errors;
    },
    dateErrors() {
      const errors = [];
      !this.$v.datePicker.required &&
        errors.push(`O campo ${"hora"} é obrigatório`);
      !this.$v.datePicker.minLength &&
        errors.push("Preencha o campo corretamente");
      !this.$v.datePicker.dateValid && errors.push("Data inferior a um dia");
      return errors;
    },
    feedback() {
      return this.$store.getters["getFeedback"];
    },
    headers() {
      return [
        { value: "date", text: "Data" },
        { value: "airplane", text: "Aeronave" },
        { value: "origin", text: "Origem" },
        { value: "destination", text: "Destino" },
        { value: "status", text: "Status" },
        { value: "actions", text: "Ações", sortable: false, align: "end" },
      ];
    },
    list() {
      return this.$store.getters["getFlights"];
    },
    airplanes() {
      return this.$store.getters["getAirplanes"];
    },
  },
  async created() {
    // this.pageLoading = true;
  },
  watch: {
    airplanes() {
      this.pageLoading = false;
    },
    feedback(val) {
      if (val && val.code === 200) {
        this.$root.$emit("message-snackbar", {
          message: val.message || "Adicionado com sucesso",
          time: 2000,
          color: "success",
        });
      } else {
        this.$root.$emit("message-snackbar", {
          message: "Erro",
          time: 2000,
          color: "error",
        });
      }
      this.cancelAdd();
    },
  },
  methods: {
    getBase(type, id) {
      let obj;
      if (type === "destination") {
        obj = this.getDestinations.find((opt) => opt.value === id);
      } else if (type === "origin") {
        obj = this.getOrigins.find((opt) => opt.value === id);
      }

      if (obj) return obj.text;
    },
    getPlaneName(obj) {
      return obj ? obj.name : "";
    },
    getDate(date) {
      return moment(date).format("DD/MM/YYYY HH:mm");
    },
    getStatus(item) {
      switch (item) {
        case "opened":
          return "Em aberto";
        case "closed":
          return "Finalizado";
        case "ready":
          return "Pronto para embarque";
      }
    },
    cancelAdd() {
      this.dialog = false;
      this.edit = false;
      this.editId = null;
      this.aero = null;
      this.loading = false;
      this.deleteDialog = false;
      this.hourPicker = null;
      this.datePicker = null;
      this.hourMenu = null;
      this.dateMenu = null;
      this.timePickerKey += 1;
    },
    deleteFlight({ id, date, type, aero, index, origin, destination }) {
      if (type && type === "confirm") {
        this.loading = true;
        this.$store.dispatch("fetchDelete", {
          path: "flights",
          id: this.editId,
          index: this.index,
        });
      } else {
        this.editId = id;
        this.aero = aero;
        this.index = index;
        this.origin = origin;
        this.destination = destination;
        this.date = date;
        this.deleteDialog = true;
      }
    },
    editFlight({ id, date, aero, index, origin, destination }) {
      this.edit = true;
      this.editId = id;
      this.aero = aero;
      this.origin = origin;
      this.destination = destination;
      this.datePicker = moment(date).format("YYYY-MM-DD");
      this.hourPicker = moment(date).format("HH:mm");
      this.index = index;
      this.dialog = true;
    },
    addFlight() {
      const flight = {
        airplane: this.aero,
        id: uuidv4(),
        origin: this.origin,
        status: "opened",
        flightNumber: this.flightNumber,
        destination: this.destination,
        date: moment(
          `${this.datePicker} ${this.hourPicker}`,
          "YYYY-MM-DD HH:mm"
        ).toISOString(),
      };

      this.loading = true;
      if (this.edit) {
        this.$store.dispatch("fetchEdit", {
          path: "flights",
          index: this.index,
          body: flight,
        });
      } else {
        this.$store.dispatch("fetchNew", { path: "flights", data: flight });
      }
    },
  },
};
</script>

<style scoped></style>
