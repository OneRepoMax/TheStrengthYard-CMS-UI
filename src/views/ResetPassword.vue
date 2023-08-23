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
                            <v-form @submit.prevent="resetPassword">
                                <!-- <v-text-field v-model="emailAddress" label="Email Address" required></v-text-field> -->
                                <v-text-field v-model="password" label="Current Password" type="password" required :rules = "passwordRules" class="mb-3"></v-text-field>
                                <v-text-field v-model="newPassword" label="New Password" type="password" required :rules = "passwordRules" class="mb-3"></v-text-field>
                                <v-text-field v-model="confirmPassword" label="Confirm Password" type="password" required :rules = "confirmPasswordRules" class="mb-3"></v-text-field>
                                <v-btn color="teal" block type="submit" size="large">Change Password</v-btn>
                                <!-- <p class="text-center mt-5">Don't have an account? <router-link
                                        to="/account/registration">Register here</router-link></p> -->
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
    background-image: url('/src/assets/login_splash.jpg');
    background-size: cover;
}
</style>
  
<script>
import { useUserStore } from '@/store/user'

export default {
    name: 'resetForm',
    setup() {
        const userStore = useUserStore()

        return {
            userStore
        }
    },
    data(){
        return {
            password: "",
            newPassword: "",
            confirmPassword: "",
            passwordRules: [
                v => !!v || 'Password is required',
                v => (v && v.length >= 6) || 'Password must be at least 6 characters',
                // v => /[A-Z]/.test(v) || 'Password must contain at least one capital letter',
            ],
            confirmPasswordRules: [
                v => !!v || 'Confirmation Password is required',
                v => v === this.confirmPassword || 'Passwords do not match',
            ],
        }
    },
    methods: {
        async resetPassword(){
            const response = await this.userStore.resetPassword(this.newPassword);

            if (this.newPassword !== this.confirmPassword) {
                console.log("new password not the same as confirm password")
            } else {
                console.log("Password changed successfully")
                console.log("New Password" + this.newPassword)
                this.$router.push({ path: '/' })
                console.log(response);
            }


            // if (response == null || response.status != 200) {
            //     console.log("invalid password")
            // } else {
            //     console.log("Password changed successfully")
            //     this.$router.push({ path: '/' })
            // }

        }
    }
}
</script>
  