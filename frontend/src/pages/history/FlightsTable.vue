<template>
  <v-data-table :items="list" :headers="headers" height="270px">
    <template v-slot:item.date="{ item }">
      <span>{{ getDate(item.date) }}</span>
    </template>
    <template v-slot:item.status="{ item }">
      <span>{{ getStatus(item.status) }}</span>
    </template>
    <template v-slot:item.airplane="{ item }">
      <span>
        {{ getPlaneName(airplanes.find((opt) => opt.id === item.airplane)) }}
      </span>
    </template>
    <template v-slot:item.origin="{ item }">
      <span>
        {{ getBase('origin', item.origin) }}
      </span>
    </template>
    <template v-slot:item.destination="{ item }">
      <span>
        {{ getBase('destination', item.destination) }}
      </span>
    </template>
  </v-data-table>
</template>

<script>
import moment from 'moment';

export default {
  name: 'FlightsTable',
  tag: 'flights-table',
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
        { value: 'date', text: 'Data' },
        { value: 'airplane', text: 'Aeronave' },
        { value: 'origin', text: 'Origem' },
        { value: 'destination', text: 'Destino' },
        { value: 'status', text: 'Status' },
      ];
    },
  },
  methods: {
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
