<template>
    <v-main>
            <v-container fluid class="registration-bg" justify="center">
    <RegisterForm/>
    </v-container>
    </v-main>
    
</template>

<script setup>

import RegisterForm from '@/components/RegisterForm.vue'

</script>

<style lang="scss" scoped>
    .registration-bg {
        width: 100vw;
        height: 100vh;
        background-image: url('/src/assets/login_splash.jpg');
        background-size: cover;
    }
</style>