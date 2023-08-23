<template>
  <v-main>
    <v-container fluid justify="center">
      <v-row justify="center" class="h-100" align="center">
        <v-col cols="12" lg="4" md="5">
          <v-card v-if="passwordAlertType != 'success'">
            <v-card-title class="text-center">
              <v-img
                src="@/assets/the-strength-yard-logo-main.svg"
                max-height="150px"
                class="ma-3"
                inset
              ></v-img>
              <v-card-title>Change Password</v-card-title>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="resetPassword">
                <!-- <v-text-field v-model="emailAddress" label="Email Address" required></v-text-field> -->
                <v-text-field
                  v-model="password"
                  label="Current Password"
                  required
                  :rules="passwordRules"
                  class="mb-3"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  :type="showPassword ? 'text' : 'password'"
                ></v-text-field>
                <v-text-field
                  v-model="newPassword"
                  label="New Password"
                  required
                  :rules="passwordRules"
                  class="mb-3"
                  :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showNewPassword = !showNewPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                ></v-text-field>
                <v-text-field
                  v-model="confirmPassword"
                  label="Confirm Password"
                  required
                  :rules="confirmPasswordRules"
                  class="mb-3"
                  :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showConfirmPassword = !showConfirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                ></v-text-field>
                <v-card-text>
                  Password Strength: <b>{{ this.score.text }}</b></v-card-text
                >

                <v-progress-linear
                  :background-opacity="opacity"
                  :color="score.color"
                  :model-value="score.value"
                  striped
                  height="10"
                  class="mb-3"
                ></v-progress-linear>
                <v-btn color="teal" block type="submit" size="large"
                  >Change Password</v-btn
                >
                <!-- <p class="text-center mt-5">Don't have an account? <router-link
                                        to="/account/registration">Register here</router-link></p> -->
              </v-form>
            </v-card-text>
          </v-card>
          <v-card v-if="passwordAlert">
            <v-alert :type="passwordAlertType" :title="passwordAlertMessage">
              
                <v-card-actions v-if="passwordAlertType == 'success'">
                <v-spacer></v-spacer>
                <v-btn variant="outlined" text="Ok" to="/" >
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
import zxcvbn from "zxcvbn";

export default {
  name: "resetForm",
  setup() {
    const userStore = useUserStore();

    return {
      userStore,
    };
  },
  data() {
    return {
      password: "",
      newPassword: "",
      confirmPassword: "",
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 8) || "Password must be at least 8 characters",
        (v) =>
          (v && !!/[a-z]/.test(v)) ||
          "Password must contain at least one lowercase letter.",
        (v) =>
          (v && !!/[A-Z]/.test(v)) ||
          "Password must contain at least one uppercase letter.",
        (v) =>
          (v && !!/\d/.test(v)) ||
          "Password must contain at least one numeric character.",
        (v) =>
          (v && !!/[!@#$%^&*]/.test(v)) ||
          "Password must contain at least one special character.",
      ],
      confirmPasswordRules: [
        (v) => !!v || "Confirmation Password is required",
        (v) => v === this.confirmPassword || "Passwords do not match",
      ],
      passwordAlert: false,
      passwordAlertMessage: null,
      passwordAlertType: null,
      showPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
    };
  },
  methods: {
    async resetPassword() {
      try {
        const LoginResponse = await this.userStore.login(
          this.userStore.emailAddress,
          this.password
        );
        if (LoginResponse.status === 200) {
          const response = await this.userStore.resetPassword(
            this.userStore.userId,
            this.newPassword
          );
          console.log(response)
          if (response.status === 200) {
            this.passwordAlertMessage =
              "Success! Your password has been changed.";
            this.passwordAlertType = "success";
            this.passwordAlert = true;
          }

          if (this.newPassword !== this.confirmPassword) {
            console.log("new password not the same as confirm password");
          } else {
            console.log(response);
          }
        } else {
          throw new Error("Invalid Current Password");
        }
      } catch (error) {
        console.error(error);
        this.passwordAlertMessage = "Invalid Current Password";
        this.passwordAlertType = "error";
        this.passwordAlert = true;
      }
    },
  },
  computed: {
    score() {
      const result = zxcvbn(this.newPassword);

      switch (result.score) {
        case 4:
          return {
            text: "Very strong",
            color: "light-blue",
            value: 100,
          };
        case 3:
          return {
            text: "Strong",
            color: "light-green",
            value: 75,
          };
        case 2:
          return {
            text: "moderate",
            color: "yellow",
            value: 50,
          };
        case 1:
          return {
            text: "Weak",
            color: "orange",
            value: 25,
          };
        default:
          return {
            text: "Very weak",
            color: "red",
            value: 0,
          };
      }
    },
  },
};
</script>
