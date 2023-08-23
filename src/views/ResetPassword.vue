<template>
  <v-main>
    <v-container fluid justify="center" class="mt-5">
      <v-row justify="center" class="h-100" align="center">
        <v-col cols="12" lg="4" md="5">
          <v-card v-if="emailAlertType != 'success'">
            <v-card-title class="text-center">
              <v-img
                src="@/assets/the-strength-yard-logo-main.svg"
                max-height="150px"
                class="ma-3"
                inset
              ></v-img>
              <v-card-title>Reset Password</v-card-title>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="resetPassword" validate-on="submit">
                <v-text-field
                  v-model="emailAddress"
                  label="Email Address"
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
                  class="my-3 "
      
                  >Reset Password</v-btn
                >
                <v-btn
                  block
                  variant="outlined"
                  to="/account/login"
                  prepend-icon="mdi-arrow-left"
                  size="large"
    
                >
                  Back to login
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
          <v-card v-if="emailAlert" class="justify-content mt-5" align="center">
            <v-alert :type="emailAlertType" :title="emailAlertMessage">
              <v-card-actions v-if="emailAlertType == 'success'">
                <v-spacer></v-spacer>
                <!-- <v-btn variant="outlined" text="Ok" to="/"> </v-btn> -->
                <v-btn
                  block
                  variant="outlined"
                  to="/account/login"
                  prepend-icon="mdi-arrow-left"
                  size="large"
                  class="mr-4"
                >
                  Back to login
                </v-btn>
              </v-card-actions>
            </v-alert>
          </v-card>
        </v-col>
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

    return {
      userStore,
    };
  },
  data() {
    return {
      // temp state
      emailAddress: "",
      password: "",
      loading: false,
      rules: [
        (value) => {
          if (value) return true;

          return "This field cannot be empty.";
        },
      ],
      emailAlertType: true,
      emailAlert: false,
      emailAlertMessage: null,
    };
    
  },
  methods: {
    async resetPassword() {
      try {
        this.loading = true;
        const response = await this.userStore.resetPassword(this.emailAddress);
        this.loading = false;
        if (response.status === 200){
            this.emailAlert = true;
            this.emailAlertMessage = "Success! Please check your email to reset your password.";
            this.emailAlertType = "success";
        }

        console.log(response);

        console.log("Reset password success");
      } catch (error) {
        console.console.log("Reset password error: ", error);
      }
    },
  },
};
</script>
