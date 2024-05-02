<template>
  <v-data-table :items="list" :headers="headers" height="270px">
    <template v-slot:item.flight="{ item }">
      <span>
        {{ getTicketName(item) }}
      </span>
    </template>
    <template v-slot:item.protocol="{ item }">
      <span>
        {{ item.protocol }}
      </span>
    </template>
    <template v-slot:item.status="{ item }">
      <span>{{ getStatus(item.status) }}</span>
    </template>
  </v-data-table>
</template>

<script>
import moment from 'moment';

export default {
  name: 'TicketsTable',
  tag: 'tickets-table',
  props: {
    list: Array,
  },
  computed: {
    airplanes() {
      return this.$store.getters['getAirplanes'];
    },
    listBases() {
      return this.$store.getters['getBases'];
    },
    getOrigins() {
      return this.listBases
        .filter((opt) => opt.type === 'origin')
        .map((opt) => {
          return { text: opt.name, value: opt.id };
        });
    },
    getDestinations() {
      return this.listBases
        .filter((opt) => opt.type === 'destination')
        .map((opt) => {
          return { text: opt.name, value: opt.id };
        });
    },
    headers() {
      return [
        { text: 'Voo', value: 'flight' },
        { text: 'Protocolo', value: 'protocol' },
        { text: 'Status', value: 'status' },
      ];
    },
  },
  methods: {
    getTicketName(val) {
      if (val) {
        return `${moment(val.flightDate).format(
          'DD/MM/YYYY HH:mm'
        )} ${this.getPlaneName(
          this.airplanes.find((air) => air.id === val.airplane)
        )} | ${this.getBases({
          origin: val.flightOrigin,
          destination: val.flightDestination,
        })}`;
      }
    },
    getBases(flight) {
      return `${this.getBase('origin', flight.origin)}/${this.getBase(
        'destination',
        flight.destination
      )}`;
    },
    getBase(type, id) {
      let obj;
      if (type === 'destination') {
        obj = this.getDestinations.find((opt) => opt.value === id);
      } else if (type === 'origin') {
        obj = this.getOrigins.find((opt) => opt.value === id);
      }

      if (obj) return obj.text;
    },
    getPlaneName(obj) {
      return obj ? obj.name : '';
    },
    getDate(date) {
      return moment(date).format('DD/MM/YYYY HH:mm');
    },
    getStatus(item) {
      switch (item) {
        case 'opened':
          return 'Em aberto';
        case 'closed':
          return 'Finalizado';
        case 'ready':
          return 'Pronto para embarque';
      }
    },
  },
};
</script>

<style scoped></style>
