<template>
    <v-main>
        <v-container fluid class="login-bg" justify="center">
            <v-row justify="center" class="h-100" align="center">
                <v-col cols="12" lg="4" md="5">
                    <v-card>
                        <v-card-title class="text-center">
                            <v-img src="@/assets/the-strength-yard-logo-main.svg" max-height="150px" class="ma-3"
                                inset></v-img>
                            <v-card-title>Member Login</v-card-title>
                        </v-card-title>
                        <v-card-text>
                            <v-form @submit.prevent="loginUser">
                                <v-text-field v-model="emailAddress" label="Email Address" required></v-text-field>
                                <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
                                <v-btn color="teal" block type="submit" size="large">Login</v-btn>
                                <p class="text-center mt-5">Don't have an account? <router-link
                                        to="/account/registration">Register here</router-link></p>
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
import { ref } from 'vue'
import { useUserStore } from '@/store/user'

export default {
    name: 'LoginForm',
    setup() {
        const store = useUserStore()

        const emailAddress = ref('')
        const password = ref('')

        const loginUser = async () => {
            await store.login(emailAddress.value, password.value)
            // You can perform any navigation or additional actions after a successful login
        }

        return {
            emailAddress,
            password,
            loginUser
        }
    }
}
</script>
  