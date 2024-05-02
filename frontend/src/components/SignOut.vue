<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="350">
      <v-card>
        <v-card-title class="text-h5">Sign Out</v-card-title>
        <v-card-text>Confirm Sign out?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="logout" class="mx-4">
            Sign Out
          </v-btn>
          <v-btn color="error" text @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { Auth } from 'aws-amplify';

export default {
  name: 'SignOut',
  tag: 'sign-out',
  props: {
    value: Boolean,
  },
  data() {
    return {
      dialog: false,
    };
  },
  watch: {
    value(val) {
      this.dialog = val;
    },
  },
  created() {},
  methods: {
    async logout() {
      try {
        await Auth.signOut({
          email: this.email,
          password: this.password,
        }).then(() => {
          this.$store.commit('setCurrentSession', {});
          this.dialog = false;
        });
      } catch (error) {
        this.$root.$emit('message-snackbar', {
          message: 'Erro ao fazer logout',
          timeout: 2000,
          color: 'error',
        });
      }
      this.dialog = false;
      this.$router.push({ path: '/signin' });
    },
  },
};
</script>

<style scoped></style>
