<template>
  <v-form @submit.prevent="register">
    <v-card
      elevation="12"
      width="400px"
      style="margin: auto"
      class="mt-12 pa-4"
    >
      <v-card-title>SignUp</v-card-title>
      <v-card-text>
        <v-text-field
          type="email"
          v-model="email"
          placeholder="Email address..."
        ></v-text-field>
        <v-text-field
          type="password"
          v-model="password"
          placeholder="password..."
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn type="submit" color="primary" class="text-right justify-end">
          Register
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
// import { Auth } from "aws-amplify";

export default {
  name: 'Register',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  created() {},
  methods: {
    async register() {
      try {
        // await Auth.signUp({
        //   email: this.email,
        //   password: this.password,
        // });
      } catch (error) {
        alert(error.message);
      }
    },
  },
};
</script>

<style scoped></style>
