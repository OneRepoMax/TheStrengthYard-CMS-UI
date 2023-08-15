<template>
  <v-app-bar :elevation="2">

    <v-img class="mx-2 ms-5" src="src/assets/the-strength-yard-logo-main.svg" max-height="50" max-width="50"
      contain></v-img>
    <v-app-bar-title class="font-weight-medium">{{ appTitle }}</v-app-bar-title>
    <v-spacer></v-spacer>
    <template class="d-none d-md-block">
      <DarkMode />
      <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.path">
        <v-icon left dark>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-btn>
    </template>

    <!-- <v-toolbar app>
      <span class="hidden-sm-and-up">
        <v-toolbar-side-icon @click="sidebar = !sidebar">
        </v-toolbar-side-icon>
      </span>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          {{ appTitle }}
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          flat
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar> -->
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
