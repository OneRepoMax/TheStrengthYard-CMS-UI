<template>
    <v-navigation-drawer v-model="drawer" location="bottom" temporary theme="dark" style="height: 500px;">
        <v-list nav>
            <template v-if="userStore.displayPicture">
                <v-list-item :prepend-avatar="userStore.displayPicture" :title="userStore.firstName + userStore.lastName"
                    :subtitle="userStore.emailAddress">
                </v-list-item>
            </template>
            <template v-if="!userStore.displayPicture">
                <v-list-item prepend-icon="mdi-account-circle" :title="userStore.firstName + userStore.lastName"
                    :subtitle="userStore.emailAddress">
                </v-list-item>
            </template>
            <v-list-item to="/profile/edit" prepend-icon="mdi-account" title="Manage Account">
            </v-list-item>
            <v-list-item>
                <v-btn block variant="flat" color="red-lighten-1" @click="logout()">
                    <v-icon left dark class="me-2">mdi-logout-variant</v-icon>
                    Logout
                </v-btn>
            </v-list-item>
        </v-list>

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
    <v-toolbar :elevation="2" color="black">
        <v-container class="d-flex" style="max-width: 1280px;">
            <template class="d-flex d-md-none">
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            </template>
            <v-img class="mx-5 pa-3 d-none d-sm-block" src="@/assets/the-strength-yard-logo-main.svg" max-height="50"
                max-width="50" contain></v-img>
            <v-app-bar-title class="font-weight-medium align-center text-capitalize my-auto">{{ appTitle
            }} <v-chip v-if="this.userStore.userType == 'A'">Admin</v-chip></v-app-bar-title>
            <div class="d-none d-md-block my-auto" v-if="!isLoggedIn">
                <dark-mode />
                <v-btn variant="flat" v-for="item in menuItems" :key="item.title" :to="item.path" class="mx-2"
                    :color="item.color">
                    {{ item.title }}
                </v-btn>

                <v-menu location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" :icon="userStore.displayPicture">
                            <v-icon icon="mdi-account-circle" v-if="!userStore.displayPicture"></v-icon>
                            <v-avatar :image="userStore.displayPicture" v-if="userStore.displayPicture"></v-avatar>
                        </v-btn>
                    </template>
                    <v-list theme="dark">
                        <v-list-item :prepend-avatar="userStore.displayPicture"
                            :title="userStore.firstName + ' ' + userStore.lastName" :subtitle="userStore.emailAddress"
                            class="mb-3">
                        </v-list-item>
                        <v-divider></v-divider>

                        <v-list-item v-for="(item, index) in profileItems" :key="index" :to="item.path">
                            {{ item.title }}
                        </v-list-item>
                        <v-list-item @click="logout">
                            <v-icon left dark class="me-2" color="red-lighten-1">mdi-logout-variant</v-icon>
                            Logout
                        </v-list-item>
                    </v-list>
                </v-menu>

            </div>
        </v-container>
    </v-toolbar>
</template>

<script>

import DarkMode from '@/components/common/DarkMode.vue';
import DarkModeButton from '@/components/common/DarkModeButton.vue'
import { useUserStore } from '@/store/user'


export default {
    name: "App",
    setup() {
        const userStore = useUserStore()

        return { userStore }
    },
    props: {
        menuItems: Object,
    },
    data() {
        return {
            appTitle: "The Strength Yard",
            drawer: false,
            group: null,
            isLoggedIn: false,
            profileItems: [
                { title: 'Manage Account', path: '/profile/edit', icon: "mdi-home", color: 'transparent' }
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
