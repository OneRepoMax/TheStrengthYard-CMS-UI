<template>
    <v-main>
        <v-container fluid class="login-bg" justify="center">
            <v-row justify="center" class="h-100" align="center">
                <v-col cols="12" lg="4" md="5">
                    <v-card>
                        <v-card-title class="text-center">
                            <v-img src="@/assets/the-strength-yard-logo-main.svg" max-height="150px" class="ma-3"
                                inset></v-img>
                            <v-card-title>Reset Password</v-card-title>
                        </v-card-title>
                        <v-card-text>
                            <v-form @submit.prevent="resetPassword" validate-on="submit">
                                <v-text-field v-model="emailAddress" label="Email Address" :rules="rules" class="mt-3"
                                    required></v-text-field>

                                <v-btn color="teal" block type="submit" size="large" :disabled="loading" :loading="loading"
                                    class="mt-3">Reset Password</v-btn>

                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
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
        async resetPassword() {
            try {
                this.loading = true;
                const response = await this.userStore.resetPassword(
                    this.emailAddress,
                );
                this.loading = false;

                console.log(response);

                console.log("Reset password success");

            }

             catch(error) {
            console.console.log("Reset password error: ", error);
        }

    },
},
};
</script>
