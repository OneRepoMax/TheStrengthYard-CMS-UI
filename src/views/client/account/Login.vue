<template>
  <v-main class="h-screen">
    <v-container fluid justify="center" class="h-100">
      <v-row justify="center" class="h-100" align="center">
        <v-expand-transition>
          <v-card class="pa-3 w-100" max-width="400px">
            <v-card-title class="text-center">
              <v-img src="@/assets/the-strength-yard-logo-main.svg" max-height="150px" class="ma-3" inset></v-img>
              <v-card-title>Member Login</v-card-title>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="login" validate-on="submit">
                <v-text-field v-model="formatEmailAddress" label="Email Address" :rules="rules" class="mt-3"
                  required></v-text-field>
                <v-text-field v-model="this.password" label="Password" :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPassword = !showPassword" :rules="rules" class="mt-3" required></v-text-field>
                <v-btn color="teal" block type="submit" size="large" :disabled="loading" :loading="loading"
                  class="mt-3">Login</v-btn>
                <p class="text-center mt-5">
                  Don't have an account?
                  <router-link to="/account/registration">Register here</router-link>
                </p>
                <p class="text-center mt-5">
                  Forget Password?
                  <router-link to="/account/reset-password">Click here</router-link>
                </p>
              </v-form>
            </v-card-text>
            <v-card v-if="loginAlert">
              <v-alert type="error" title="Invalid Login Credentials"
                text="Please check your login credentials and try again later." closable>
              </v-alert>
            </v-card>
          </v-card>
        </v-expand-transition>

      </v-row>
    </v-container>
  </v-main>
</template>
  
<script>
import { useUserStore } from "@/store/user";

export default {
  name: "LoginForm",
  setup() {
    const userStore = useUserStore();

    userStore.$reset();

    return {
      userStore,
    };
  },
  data() {
    return {
      // temp state
      emailAddress: "",
      showPassword: false,
      password: "",
      loading: false,
      loginAlert: false,
      rules: [
        (value) => {
          if (value) return true;

          return "This field cannot be empty.";
        },
      ],
    };
  },
  computed: {
    formatEmailAddress: {
      get() {
        return this.emailAddress
      },
      set(value) {
        this.emailAddress = value.trim()
      }
    }
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
        this.loginAlert = true;
      } else {
        console.log("Login Successful");
        if (response.data[0].UserType.toUpperCase() == "A") {
          this.$router.push({ path: "/admin/account" })
        } else {
          this.$router.push({ path: "/" });
        }
      }
    },
  },
};
</script>