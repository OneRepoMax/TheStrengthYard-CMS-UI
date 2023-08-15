<template>
  <v-app-bar :elevation="2" color="black">

    <v-container class="d-flex">
      <template class="d-flex d-md-none">
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>
      <v-img class="mx-5 pa-3" src="src/assets/the-strength-yard-logo-main.svg" max-height="50" max-width="50"
        contain></v-img>
      <v-app-bar-title class="font-weight-medium align-center text-capitalize my-auto">{{ appTitle }}</v-app-bar-title>

      <div class="d-none d-md-block my-auto" v-if="!isLoggedIn">
        <dark-mode />
        <v-btn variant="flat" v-for="item in menuItems" :key="item.title" :to="item.path" class="text-capitalize mx-2"
          :color="item.color">
          <v-icon v-if="item.icon" left dark class="me-2">{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </div>

      <div class="d-none d-md-block my-auto" v-if="isLoggedIn" >
        <v-btn variant="flat" v-for="item in loggedInMenuItems" :key="item.title" :to="item.path"
          class="text-capitalize mx-2" :color="item.color">
          {{ item.title }}
        </v-btn>
        <v-btn 
          variant="flat" 
          class="text-capitalize mx-2" 
          color="red-lighten-1">
          <v-icon left dark class="me-2">mdi-logout-variant</v-icon>
          Logout
        </v-btn>
      </div>

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
      isLoggedIn: false,
      sidebar: false,
      menuItems: [
        { title: 'Home', path: '/', icon: '', color: 'transparent' },
        { title: 'Login / Register', path: '/account/login', icon: 'mdi-login-variant', color: 'teal' },
      ],
      loggedInMenuItems: [
        { title: 'Schedule', path: '/booking', color: 'transparent' },
        { title: 'Book', path: '/book', color: 'transparent' },
      ]
    };
  },
  components: { DarkMode }
}
</script>
