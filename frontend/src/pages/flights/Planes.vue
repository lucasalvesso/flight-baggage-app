<template>
  <v-container>
    <v-card class="fill-height pa-4" style="margin: auto" elevation="12">
      <v-card-title class="justify-center">Lista de Aeronaves</v-card-title>
      <v-card-text>
        <v-row dense class="mb-4">
          <v-spacer></v-spacer>
          <v-btn @click="dialog = true" color="primary">Adicionar</v-btn>
        </v-row>
        <v-row dense class="mt-2">
          <v-col cols="12" class="text-center">
            <v-progress-circular
              v-if="pageLoading"
              indeterminate
            ></v-progress-circular>
            <v-data-table v-else :items="list" :headers="headers">
              <template v-slot:item.date="{ item }">
                <span>{{ getDate(item.date) }}</span>
              </template>
              <template v-slot:item.actions="{ item, index }">
                <v-btn
                  @click="
                    editAero({ id: item.id, name: item.name, index: index })
                  "
                  icon
                  class="mr-2"
                >
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn
                  @click="
                    deleteAero({ id: item.id, name: item.name, index: index })
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
      <v-dialog v-model="dialog" persistent width="400px">
        <v-card class="fill-height pa-4" style="margin: auto" elevation="12">
          <v-card-title class="justify-center">
            {{ edit ? 'Editar Aeronave' : 'Nova Aeronave' }}
          </v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="name"
                  v-mask="'AA-AAA'"
                  :counter="6"
                  filled
                  :error-messages="nameErrors"
                  @input="name = name.toUpperCase()"
                  @change="$v.name.$touch()"
                  @blur="$v.name.$touch()"
                  placeholder="Identificação"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="cancelAdd" class="mr-2" :disabled="loading">
              Cancelar
            </v-btn>
            <v-btn
              @click="addAero"
              color="primary"
              :loading="loading"
              :disabled="$v.$invalid"
            >
              {{ edit ? 'Editar' : 'Salvar' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
    <v-dialog v-model="deleteDialog" persistent width="400px">
      <v-card>
        <v-card-title>Confirme a exclusão</v-card-title>
        <v-card-text>
          Deseja realmente excluir a aeronave {{ this.name }} ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="deleteAero({ type: 'confirm' })"
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
import { TheMask } from 'vue-the-mask';
import { required, minLength } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';

export default {
  name: 'Planes',
  comments: { TheMask },
  mixins: [validationMixin],
  validations: {
    name: { required: required, minLength: minLength(6) },
  },
  data() {
    return {
      name: null,
      dialog: false,
      deleteDialog: false,
      loading: false,
      edit: false,
      index: null,
      editId: null,
      pageLoading: false,
    };
  },
  computed: {
    nameErrors() {
      const errors = [];
      !this.$v.name.minLength && errors.push('Preencha o campo corretamente');
      !this.$v.name.required &&
        errors.push(`O campo ${'identificação'} é obrigatório`);
      return errors;
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
    list() {
      return this.$store.getters['getAirplanes'];
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
    getDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    deleteAero({ id, name, type, index }) {
      if (type && type === 'confirm') {
        this.loading = true;
        this.$store.dispatch('fetchDelete', {
          path: 'planes',
          id: this.editId,
          index: this.index,
        });
      } else {
        this.editId = id;
        this.index = index;
        this.name = name;
        this.deleteDialog = true;
      }
    },
    editAero({ id, name, index }) {
      this.edit = true;
      this.editId = id;
      this.name = name;
      this.index = index;
      this.dialog = true;
    },
    cancelAdd() {
      this.dialog = false;
      this.deleteDialog = false;
      this.edit = false;
      this.loading = false;
      this.index = null;
      this.editId = null;
      this.name = null;
    },
    addAero() {
      const aero = {
        name: this.name,
        id: this.editId || uuidv4(),
        date: moment().toISOString(),
      };

      this.loading = true;
      if (this.edit) {
        this.$store.dispatch('fetchEdit', {
          path: 'planes',
          index: this.index,
          body: aero,
        });
      } else {
        this.$store.dispatch('fetchNew', { path: 'planes', data: aero });
      }
    },
  },
};
</script>

<style scoped></style>
