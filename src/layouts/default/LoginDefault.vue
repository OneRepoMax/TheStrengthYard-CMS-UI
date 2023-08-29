<template>
    <v-app>
        <default-bar />
        <v-container fluid class="py-8 px-0 w-100 " min-height="87.5vh" align-content="center">
            <default-view/>
        </v-container>
        <default-footer />
    </v-app>
</template>

<script setup>
import DefaultBar from '@/components/common/AppBar.vue'
import DefaultView from './View.vue'
import DefaultFooter from '@/components/common/Footer.vue'
</script>

