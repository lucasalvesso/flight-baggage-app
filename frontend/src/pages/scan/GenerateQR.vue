<template>
  <v-container>
    <v-card class="fill-height" style="margin: auto" elevation="12">
      <v-card-title class="justify-center">Gerar Etiqueta</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-autocomplete
              v-model="flight"
              filled
              :items="flights"
              item-value="value"
              :item-text="getTemplateSelectText"
              :error-messages="flightErrors"
              clearable
              return-object
              placeholder="Voos"
            >
              <template v-slot:item="{ item }">
                <span v-html="getTemplateSelect(item)" id="selectText"></span>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <v-textarea
              rows="2"
              v-model="additionalInfo"
              :error-messages="additionalInfoErrors"
              filled
              placeholder="Informações adicionais"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <div style="margin: auto">
          <v-btn color="primary" @click="genQR" :disabled="$v.$invalid">
            Gerar
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
    <v-card v-if="code" elevation="6" class="mt-6">
      <v-form id="printMe">
        <div class="flex-container">
          <span class="left_qr_color"></span>
          <div>
            <vue-qrcode :value="code" :class="code ? 'qr_code' : ''" />
          </div>
          <div class="qr_code_content">
            <div>
              {{
                "Aeronave: " +
                airplanes.find((opt) => opt.id === flight.airplane).name
              }}
            </div>
            <div>
              <strong>{{ "Numero do Voo: " + flight.flightNumber }}</strong>
            </div>
            <div>{{ "Date: " + getDateHour() }}</div>
            <div>{{ "Protocolo: " + (savedProtocol || "XXXXXXXXXXX") }}</div>
            <div>{{ "Informações adicionais: " + additionalInfo }}</div>
            <div class="highlight">
              {{ "Origem/Destino: " + getBases(flight) }}
            </div>
          </div>
          <span class="left_qr_color"></span>
        </div>
      </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="mr-12 mb-4" @click="save">
          Salvar e Imprimir
        </v-btn>
      </v-card-actions>
    </v-card>
    <print-content
      v-if="printDialog"
      title="PROTOCOLO"
      :element="'printMe'"
    ></print-content>
  </v-container>
</template>

<script>
import "../../../public/qr_code.css";
import VueQrcode from "vue-qrcode";
import moment from "moment";
import { required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import PrintContent from "../../components/PrintContent";

export default {
  name: "GenerateQR",
  mixins: [validationMixin],
  validations: {
    flight: { required: required },
    additionalInfo: { required: required },
  },
  components: {
    PrintContent,
    VueQrcode,
  },
  data() {
    return {
      code: "",
      savedProtocol: null,
      additionalInfo: null,
      flight: null,
      ticketColor: null,
      printDialog: false,
    };
  },
  computed: {
    flightErrors() {
      const errors = [];
      !this.$v.flight.required && errors.push(`O campo ${"voo"} é obrigatório`);
      return errors;
    },

    additionalInfoErrors() {
      const errors = [];
      !this.$v.additionalInfo.required &&
        errors.push(`O campo ${"informações adicionais"} é obrigatório`);
      return errors;
    },

    airplanes() {
      return this.$store.getters["getAirplanes"];
    },

    getTickets() {
      return this.$store.getters["getTickets"];
    },

    flights() {
      return this.$store.getters["getFlights"]
        .filter((opt) => opt.status === "opened")
        .map((opt) => {
          opt.dateTime = `${moment(opt.date).format("DD/MM/YYYY HH:mm")}`;
          opt.flight = `${this.getPlaneName(
            this.airplanes.find((air) => air.id === opt.airplane)
          )}`;
          opt.base = `${this.getBase("origin", opt.origin)}/${this.getBase(
            "destination",
            opt.destination
          )}`;
          opt.value = opt.id;
          return opt;
        });
    },

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
          return { text: opt.name, value: opt.id, color: opt.color };
        });
    },
    listBases() {
      return this.$store.getters["getBases"];
    },

    feedback() {
      return this.$store.getters["getFeedback"];
    },
  },

  watch: {
    flight(val) {
      if (val) {
        const dest = this.getDestinations.find(
          (opt) => opt.value === val.destination
        );
        this.ticketColor = dest.color;
        if (this.ticketColor)
          document.documentElement.style.setProperty(
            "--default-qrborder-color",
            this.ticketColor
          );
      }
    },
    async feedback(val) {
      if (val && val.code === 200) {
        this.savedProtocol = val.response.body;
        await this.genQR();
        this.$root.$emit("message-snackbar", {
          message: "Adicionado com sucesso",
          time: 4000,
          color: "success",
        });
        await this.print();
      } else {
        this.$root.$emit("message-snackbar", {
          message: "Deu ruim",
          time: 2000,
          color: "error",
        });
        this.cancelAdd();
      }
    },
  },

  methods: {
    getTemplateSelect(item) {
      return `<span>${item.dateTime} | ${item.flight} - <strong>${item.flightNumber} | </strong> ${item.base}</span>`;
    },
    getTemplateSelectText(item) {
      return this.extractContent(this.getTemplateSelect(item));
    },
    extractContent(s) {
      const span = document.createElement("span");
      span.innerHTML = s;
      return span.textContent || span.innerText;
    },
    getBase(type, id) {
      let obj;
      if (type === "destination") {
        obj = this.getDestinations.find((opt) => opt.value === id);
      } else if (type === "origin") {
        obj = this.getOrigins.find((opt) => opt.value === id);
      }

      if (obj) return obj.text;
    },
    getDateHour() {
      return moment(this.flight.date).format("DD/MM/YYYY  HH:mm");
    },

    getBases(flight) {
      return `${this.getBase("origin", flight.origin)}/${this.getBase(
        "destination",
        flight.destination
      )}`;
    },

    getPlaneName(plane) {
      return plane ? plane.name : "";
    },
    cancelAdd() {
      this.code = null;
      this.additionalInfo = null;
    },
    async save() {
      this.printDialog = true;
      const ticket = {
        protocol: null,
        airplane: this.flight.airplane,
        flight: this.flight.id,
        origin: this.flight.origin,
        destination: this.flight.destination,
        additionalInfo: this.additionalInfo,
        flightDate: this.flight.date,
        date: moment().toISOString(),
        status: "opened",
      };
      await this.$store.dispatch("fetchNew", {
        data: ticket,
        path: "tickets",
      });
    },
    async print() {
      const style = await this.getCustomCss();
      await this.$htmlToPaper("printMe", {
        windowTitle: this.savedProtocol,
        styles: style,
      });
      this.cancelAdd();
    },

    async getCustomCss() {
      const xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", document.location.origin + "/qr_code.css", false); // false for synchronous request
      xmlHttp.send(null);

      const style = document.createElement("style");
      const changedColor = xmlHttp.responseText.replace(
        "black",
        this.ticketColor
      );

      style.innerHTML = changedColor;
      const parsed = style.innerHTML.replace(/^['"].*['"]+/g, "");
      const blob = new Blob([parsed], { type: "octet/stream" });
      const url = window.URL.createObjectURL(blob);
      return [url];
    },
    genQR() {
      this.code = this.flight.id + "/" + this.savedProtocol;
    },
  },
};
</script>

<style></style>
