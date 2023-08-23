<template>
    <v-app>
        <default-bar />
        <div class="default-bg py-8">
            <div class="login-default">
                <default-view />
            </div>
        </div>
        <default-footer />
    </v-app>
</template>

<script setup>
import DefaultBar from '@/components/AppBar.vue'
import DefaultView from './View.vue'
import DefaultFooter from '@/components/Footer.vue'
</script>

<style>

.login-default {
    max-width: 1280px;
    align-content: center;
    margin: 0 auto;
    display: flex;
    justify-content: center;
}

/* .default-bg {
    background-color: #ECEFF1;
} */

</style>
