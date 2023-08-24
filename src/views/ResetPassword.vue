<template>
    <v-main>
        <v-container fluid justify="center" class="h-screen">
            <v-row justify="center" class="h-100" align="center">
                <v-card class="pa-3 w-100" max-width="400px">
                    <v-card-title class="text-center">
                        <v-img src="@/assets/the-strength-yard-logo-main.svg" max-height="150px" class="ma-3" inset></v-img>
                        <v-card-title>Reset Password</v-card-title>
                    </v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="resetPassword" validate-on="submit">
                            <v-text-field v-model="emailAddress" label="Email Address" :rules="rules" class="mt-3"
                                required></v-text-field>

                            <v-btn color="teal" block type="submit" size="large" :disabled="loading" :loading="loading"
                                class="my-3 ">Reset Password</v-btn>
                            <v-btn block variant="outlined" to="/account/login" prepend-icon="mdi-arrow-left" size="large">
                                Back to login
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
                <v-template>
                    <Modal v-model="modal.show" :path="modal.path" :title="modal.title" :message="modal.message"
                        :icon="modal.icon" @closeModal="closeModal" />
                </v-template>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
import { useUserStore } from "@/store/user";
import Modal from "@/components/Modal.vue"

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
            modal: {
                show: false,
                type: "success",
                icon: "mdi-email",
                title: "Check Email for Password Reset",
                message: "Please check your email to reset your password.",
                path: "/account/login"
            }
        };

    },
    methods: {
        async resetPassword() {
            try {
                this.loading = true;
                const response = await this.userStore.resetPassword(this.emailAddress);
                this.loading = false;
                if (response.status === 200) {
                    this.modal.show = true;
                    this.modal.title = "Check Email for Password Reset";
                    this.modal.icon = "mdi-email";
                    this.modal.message = "Please check your email to reset your password.";
                    this.modal.type = "success";
                }

                console.log(response);

                console.log("Reset password success");
            } catch (error) {
                console.console.log("Reset password error: ", error);
            }
        },
        closeModal() {
            this.modal.show = false
        },
    },
    components: {
        Modal
    }
};
</script>
