<template>
  <v-main>
    <v-container fluid class="login-bg" justify="center">
      <v-row justify="center" class="h-100" align="center">
          <v-card class="pa-3 w-100" max-width="400px">
            <v-card-title class="text-center">
              <v-img
                src="@/assets/the-strength-yard-logo-main.svg"
                max-height="150px"
                class="ma-3"
                inset
              ></v-img>
              <v-card-title>Member Login</v-card-title>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="login" validate-on="submit">
                <v-text-field
                  v-model="emailAddress"
                  label="Email Address"
                  :rules="rules"
                  class="mt-3"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPassword = !showPassword"
                  :rules="rules"
                  class="mt-3"
                  required
                ></v-text-field>
                <v-btn
                  color="teal"
                  block
                  type="submit"
                  size="large"
                  :disabled="loading"
                  :loading="loading"
                  class="mt-3"
                  >Login</v-btn
                >
                <p class="text-center mt-5">
                  Don't have an account?
                  <router-link to="/account/registration"
                    >Register here</router-link
                  >
                </p>
                <p class="text-center mt-5">
                  Forget Password?
                  <router-link to="/account/reset-password"
                    >Click here</router-link
                  >
                </p>
              </v-form>
            </v-card-text>
          </v-card>
        
      </v-row>
    </v-container>
  </v-main>
</template>

<style scoped>
.login-bg {
  width: 100vw;
  height: 100vh;
  background-image: url("/src/assets/login_splash.jpg");
  background-size: cover;
}
</style>

<script>
import { useUserStore } from "@/store/user";

export default {
  name: "LoginForm",
  setup() {
    const userStore = useUserStore();

    return {
      userStore,
    };
  },
  data() {
    return {
      // temp state
      emailAddress: "",
      password: "",
      showPassword: false,
      loading: false,
      rules: [
        (value) => {
          if (value) return true;

          return "This field cannot be empty.";
        },
      ],
    };
  },
  methods: {
    async login() {
      this.loading = true;
      const response = await this.userStore.login(
        this.emailAddress,
        this.password
      );
      this.loading = false;

      console.log(response);

      if (response == null || response.status != 200) {
        console.log("invalid login details");
      } else {
        console.log("Login Successful");
        this.$router.push({ path: "/" });
      }
    },
  },
};
</script>
