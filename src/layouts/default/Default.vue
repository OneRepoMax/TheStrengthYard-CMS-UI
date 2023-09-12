<template>
    <v-app>
        <default-view class="default-bg"/>
    </v-app>
</template>
  
<script setup>
import DefaultView from './View.vue'
</script>
  
<style scoped>

.default-bg {
    width: 100vw;
    min-height: 100vh; 
    background-image: url('../../assets/login-splash.jpg');
    background-size: cover;
    background-repeat: repeat-y;
}

</style>