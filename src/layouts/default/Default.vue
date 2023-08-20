<template>
    <v-app>
        <default-view class="default-bg"/>
    </v-app>
</template>
  
<script setup>
import DefaultView from './View.vue'
</script>
  
<style>

.default-bg {
    width: 100vw;
    min-height: 100vh; 
    background-image: url('../../assets/login_splash.jpg');
    background-size: cover;
    background-repeat: repeat-y;
    margin-top: 0;
}

</style>