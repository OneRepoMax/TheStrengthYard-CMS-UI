<template>
    <v-main>
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="6">
                    <v-card elevation="2">
                        <v-card-title class="text-center">
                            <h2>Login Page</h2>
                        </v-card-title>
                        <v-card-text>
                            <v-form @submit.prevent="loginUser">
                                <v-text-field v-model="emailAddress" label="Email Address" required></v-text-field>
                                <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
                                <v-btn type="submit" color="primary">Login</v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>
  
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
  