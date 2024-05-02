<template>
  <v-form @submit.prevent="login">
    <v-card
      elevation="12"
      width="400px"
      style="margin: auto"
      class="mt-12 pa-4"
    >
      <v-card-title>Login</v-card-title>
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
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
// import { Auth } from "aws-amplify";

export default {
  name: "Login",
  tag: "sign-in",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  created() {},
  methods: {
    async login() {
      try {
        // await Auth.signIn({
        //   username: this.email,
        //   password: this.password,
        //   // eslint-disable-next-line no-unused-vars
        // }).then(async (user) => {
        //   // if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        //   //   await Auth.completeNewPassword(user, 'Aer@@2018', {email: 'lcsalves@hotmail.com'})
        //   // }
        // });
        this.$router.push({ path: "/home" });
      } catch (error) {
        this.$root.$emit("message-snackbar", {
          message: "Houve um erro no login",
          time: 20000,
          color: "error",
        });
      }
    },
  },
};
</script>

<style scoped></style>
