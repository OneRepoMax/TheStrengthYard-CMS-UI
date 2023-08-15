<template>
  <v-app-bar :elevation="2">
    
    <v-container class="d-flex">
      <template class="d-flex d-md-none">
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>
      <v-img class="mx-5 pa-3" src="src/assets/the-strength-yard-logo-main.svg" max-height="50" max-width="50"
      contain></v-img>
        <v-app-bar-title class="font-weight-medium align-center text-capitalize my-auto">{{ appTitle }}</v-app-bar-title>

        <template class="d-none d-md-block">
          <dark-mode />
          <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.path" class="text-capitalize">
            <v-icon left dark>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-btn>
        </template>
        


    </v-container>


  </v-app-bar>
</template>

<script>

import DarkMode from '@/components/DarkMode.vue';

export default {
  name: "App",
  data() {
    return {
      appTitle: "Customer Management System",
      sidebar: false,
      menuItems: [
        { title: 'Home', path: '/', icon: 'mdi-home' },
        { title: 'Login / Sign Up', path: '/account/login', icon: 'mdi-login-variant' },
      ]
    };
  },
  components: { DarkMode }
}
</script>
