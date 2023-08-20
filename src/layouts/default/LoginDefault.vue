<template>
  <v-app>
    <default-bar />
    <div class="login-default">
        <default-view />
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

.login-default{
    max-width: 1280px;
    align-self: center;
}

</style>
