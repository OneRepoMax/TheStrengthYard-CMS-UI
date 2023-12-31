<template>
    <v-container fluid justify="center">
        <v-row justify="center" align="center">
            <v-card class="pa-3 w-100" max-width="500px">
                <v-card-title class="text-center">
                    <v-card-title>Change Password</v-card-title>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form" @submit.prevent="validatePassword">
                        <!-- <v-text-field v-model="emailAddress" label="Email Address" required></v-text-field> -->
                        <v-text-field v-model="password" label="Current Password" required
                            class="mb-3" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append-inner="showPassword = !showPassword"
                            :type="showPassword ? 'text' : 'password'"></v-text-field>
                        <v-text-field v-model="newPassword" label="New Password" required :rules="passwordRules"
                            class="mb-3" :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append-inner="showNewPassword = !showNewPassword"
                            :type="showNewPassword ? 'text' : 'password'"></v-text-field>
                        <v-text-field v-model="confirmPassword" label="Confirm Password" required
                            :rules="confirmPasswordRules" class="mb-3"
                            :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append-inner="showConfirmPassword = !showConfirmPassword"
                            :type="showConfirmPassword ? 'text' : 'password'"></v-text-field>
                        <v-card-text>
                            Password Strength: <b>{{ this.score.text }}</b>
                        </v-card-text>

                        <v-progress-linear :color="score.color" :model-value="score.value"
                            striped height="10" class="mb-5"></v-progress-linear>
                        <v-btn color="teal" block type="submit" size="large" class="mb-5">Change Password</v-btn>

                        <v-btn block variant="outlined" to="/profile/edit" prepend-icon="mdi-arrow-left" size="large">
                            Back to profile
                        </v-btn>
                    </v-form>
                </v-card-text>

                <v-card-text v-if="error">
                    <v-alert type="error" title="Oops, please check your details" :text="passwordAlertMessage">
                    </v-alert>
                </v-card-text>
            </v-card>
        </v-row>

        

        <v-template>
            <Modal v-model="modal.show" :path="modal.path" :title="modal.title" :message="modal.message"
                :icon="modal.icon" @closeModal="closeModal" />
        </v-template>

    </v-container>
</template>

<script>
import { useUserStore } from "@/store/user";
import Modal from '@/components/common/Modal.vue';
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
                (v) => v === this.newPassword || "Passwords do not match",
            ],
            error: false,
            passwordAlertMessage: null,
            showPassword: false,
            showNewPassword: false,
            showConfirmPassword: false,
            modal: {
                show: false,
                type: "success",
                icon: "mdi-check-circle",
                title: "Change Password",
                message: "Success! Your password has been successfully changed.",
                path: "/"
            }
        };
    },
    methods: {
        async validatePassword() {
            await this.$refs.form.validate();

            const isValid = this.$refs.form.isValid

            if (!isValid) {
                // Form has validation errors, do not submit
                console.log('Form has validation errors');
                this.passwordAlertMessage = "New password does not fulfil requirement";
                this.error = true;
                if(this.newPassword !== this.confirmPassword){
                    this.passwordAlertMessage = "New/confirm password does not match";
                }
            } else {
                // Form is valid, submit the data
                this.error = false;
                this.changePassword();
            } 
        },

        async changePassword() {
            try {

                const LoginResponse = await this.userStore.login(
                    this.userStore.emailAddress,
                    this.password
                );

                this.passwordAlertMessage = "Invalid Current Password";

                if (LoginResponse.status === 200) {
                    if(this.newPassword !== this.confirmPassword){
                        throw new Error("Two Password not the same")
                        return
                    }

                    else{
                        const response = await this.userStore.changePassword(this.userStore.userId,this.confirmPassword);
                        if(response.status == 200){
                            this.error = false;
                            this.modal.show = true;
                            this.modal.message = "Success! Your password has been changed.";
                            this.modal.type = "success";
                        }
                        else{
                            this.modal.show = true;
                            this.modal.message = "Fail to change your password, please try again";
                            this.modal.type = "error"
                        }
                    }
                } 
                else {
                    throw new Error("Invalid Current Password");
                }
            } catch (error) {
                console.error(error);
                this.error = true;
            }
        },
        closeModal() {
            this.modal.show = false
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
    components: { Modal }
};
</script>
