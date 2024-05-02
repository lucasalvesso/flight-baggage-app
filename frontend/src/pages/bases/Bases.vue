<template>
  <v-container>
    <v-card
      v-for="(type, index) of types"
      :key="index"
      class="fill-height pa-4 mb-4"
      style="margin: auto"
      elevation="12"
    >
      <v-card-title class="justify-center">
        {{ type === 'origin' ? 'Origens' : 'Destinos' }}
      </v-card-title>
      <v-card-text>
        <v-row dense class="mb-4">
          <v-spacer></v-spacer>
          <v-btn
            @click="
              dialog = true;
              typeSelected = type;
            "
            color="primary"
          >
            Adicionar
          </v-btn>
        </v-row>
        <v-row dense class="mt-2">
          <v-col cols="12" class="text-center">
            <v-progress-circular
              v-if="pageLoading"
              indeterminate
            ></v-progress-circular>
            <v-data-table
              v-else
              :items="type === 'origin' ? getOrigins : getDestinations"
              :headers="headers"
            >
              <template v-slot:item.date="{ item }">
                <span>{{ getDate(item.date) }}</span>
              </template>
              <template v-slot:item.actions="{ item, index }">
                <v-btn
                  @click="
                    deleteOrigin({ type: type, index: index, id: item.id })
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
    </v-card>
    <v-dialog v-model="dialog" persistent width="400px">
      <v-card class="fill-height pa-4" style="margin: auto" elevation="12">
        <v-card-title class="justify-center">
          {{ typeSelected === 'origin' ? 'Nova Origem' : 'Novo Destino' }}
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field v-model="name" filled label="Nome"></v-text-field>
            </v-col>
            <v-col v-if="typeSelected === 'destination'" cols="12">
              Cor
              <v-color-picker
                v-model="colorPicker"
                v-if="typeSelected === 'destination'"
                class="ma-2"
                hide-canvas
                hide-sliders
                hide-inputs
                show-swatches
                @update:color="setColor"
              ></v-color-picker>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="cancelAdd" class="mr-2" :disabled="loading">
            Cancelar
          </v-btn>
          <v-btn @click="addOrigin" color="primary" :loading="loading">
            {{ 'Salvar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog" persistent width="400px">
      <v-card>
        <v-card-title>Confirme a exclusão</v-card-title>
        <v-card-text>
          Deseja realmente excluir a aeronave {{ name }} ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="deleteOrigin({ confirm: true })"
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
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export default {
  name: 'Bases',
  data() {
    return {
      name: null,
      color: null,
      colorPicker: null,
      dialog: false,
      typeSelected: null,
      index: null,
      deleteDialog: false,
      itemId: null,
      loading: false,
      pageLoading: false,
    };
  },
  computed: {
    types() {
      return ['origin', 'destination'];
    },
    feedback() {
      return this.$store.getters['getFeedback'];
    },
    headers() {
      return [
        { value: 'name', text: 'Nome' },
        { value: 'date', text: 'Última Modificação' },
        { value: 'actions', text: 'Ações', sortable: false, align: 'end' },
      ];
    },
    getOrigins() {
      return this.list.filter((opt) => opt.type === 'origin');
    },
    getDestinations() {
      return this.list.filter((opt) => opt.type === 'destination');
    },
    list() {
      return this.$store.getters['getBases'];
    },
  },
  watch: {
    list() {
      this.pageLoading = false;
    },
    feedback(val) {
      if (val && val.code === 200) {
        this.$root.$emit('message-snackbar', {
          message: 'Adicionado com sucesso',
          time: 2000,
          color: 'success',
        });
      } else {
        this.$root.$emit('message-snackbar', {
          message: val.message,
          time: 2000,
          color: 'error',
        });
      }
      this.cancelAdd();
    },
  },
  created() {
    // this.pageLoading = true;
  },
  methods: {
    setColor(val) {
      this.color = val['hex'];
    },
    getDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    deleteOrigin({ type, index, confirm, id }) {
      if (confirm) {
        //

        const object = this.list.find((opt) => opt.id === this.itemId);
        this.$store.dispatch('fetchDelete', {
          path: 'bases',
          id: object.id,
          index: this.list.indexOf(object),
        });
      } else {
        this.typeSelected = type;
        this.index = index;
        this.deleteDialog = true;
        this.itemId = id;
      }
    },
    cancelAdd() {
      this.dialog = false;
      this.deleteDialog = false;
      this.loading = false;
      this.index = null;
      this.name = null;
    },
    addOrigin() {
      const base = {
        id: uuidv4(),
        name: this.name,
        type: this.typeSelected,
        date: moment().toISOString(),
      };

      if (this.typeSelected === 'destination') base.color = this.color;

      this.loading = true;
      this.$store.dispatch('fetchNew', { path: 'bases', data: base });
    },
  },
};
</script>

<style scoped></style>
