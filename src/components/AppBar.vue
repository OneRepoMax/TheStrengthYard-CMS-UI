<template>
    <v-navigation-drawer v-model="drawer" location="bottom" temporary theme="dark" style="height: 500px;">
        <v-list>
            <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
                :title="userStore.firstName + userStore.lastName" :subtitle="userStore.emailAddress"></v-list-item>
        </v-list>
        <v-list-item>
            <v-btn block variant="flat" color="red-lighten-1" @click="logout()">
                <v-icon left dark class="me-2">mdi-logout-variant</v-icon>
                Logout
            </v-btn>
        </v-list-item>

        <v-divider class="my-3"></v-divider>

        <v-list-item>
            <dark-mode-button />
        </v-list-item>

        <v-divider class="my-3"></v-divider>


        <v-list nav>
            <v-list-item v-for="item in menuItems" :key="item.title" :to="item.path" :prepend-icon="item.icon"
                :title="item.title">

            </v-list-item>

        </v-list>
    </v-navigation-drawer>
    <v-app-bar :elevation="2" color="black">
        <v-container class="d-flex" style="max-width: 1280px;">
            <template class="d-flex d-md-none">
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            </template>
            <v-img class="mx-5 pa-3 d-none d-sm-block" src="src/assets/the-strength-yard-logo-main.svg" max-height="50"
                max-width="50" contain></v-img>
            <v-app-bar-title class="font-weight-medium align-center text-capitalize my-auto">{{ appTitle
            }}</v-app-bar-title>
            <div class="d-none d-md-block my-auto" v-if="!isLoggedIn">
                <dark-mode />
                <v-btn variant="flat" v-for="item in menuItems" :key="item.title" :to="item.path" class="mx-2"
                    :color="item.color">
                    {{ item.title }}
                </v-btn>

                <v-menu location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="https://randomuser.me/api/portraits/women/85.jpg">
                            <v-avatar image="https://randomuser.me/api/portraits/women/85.jpg"></v-avatar>
                        </v-btn>
                    </template>
                    <v-list theme="dark">
                        <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
                            :title="userStore.firstName + userStore.lastName" :subtitle="userStore.emailAddress"
                            class="mb-3">
                        </v-list-item>
                        <v-divider></v-divider>

                        <v-list-item v-for="(item, index) in profileItems" :key="index" :to="item.path">
                            {{ item.title }}
                        </v-list-item>
                        <v-list-item  @click="logout">
                            <v-icon left dark class="me-2" color="red-lighten-1">mdi-logout-variant</v-icon>
                            Logout
                        </v-list-item>
                    </v-list>
                </v-menu>

            </div>
        </v-container>
    </v-app-bar>
</template>

<script>

import DarkMode from '@/components/DarkMode.vue';
import DarkModeButton from '@/components/DarkModeButton.vue'
import { useUserStore } from '@/store/user'

export default {
    name: "App",
    setup() {
        const userStore = useUserStore()

        return { userStore }
    },
    data() {
        return {
            appTitle: "The Strength Yard",
            drawer: false,
            group: null,
            isLoggedIn: false,
            menuItems: [
                { title: 'Home', path: '/', icon: "mdi-home", color: 'transparent' },
                { title: 'Schedule', icon: "mdi-calendar-badge", path: '/schedule', color: 'transparent' },
                { title: 'Book', icon: "mdi-login-variant", path: '/book', color: 'transparent' },
            ],
            profileItems: [
                { title: 'View Profile', path: '/profile/view', icon: "mdi-home", color: 'transparent' },
                { title: 'Edit Profile', path: '/profile/edit', icon: "mdi-home", color: 'transparent' }
            ]
        };
    },
    watch: {
        group() {
            this.drawer = false
        },
    },
    methods: {
        logout() {

            // clear global store
            this.userStore.$reset()

            // clear user storage
            localStorage.removeItem("tsyUserInfo")

            //redirect user to login page
            this.$router.push({ path: '/account/login' })
        }
    },
    components: { DarkMode, DarkModeButton }
}
</script>
