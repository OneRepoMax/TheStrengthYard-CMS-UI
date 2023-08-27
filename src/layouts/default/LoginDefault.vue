<template>
    <v-app>
        <default-bar />
        <div class="py-8">
            <v-responsive class="mx-auto" max-width="1280px" min-height="87.5vh" align-content="center" >
                <default-view />
            </v-responsive>
        </div>
        <default-footer />
    </v-app>
</template>

<script setup>
import DefaultBar from '@/components/AppBar.vue'
import DefaultView from './View.vue'
import DefaultFooter from '@/components/Footer.vue'
</script>

