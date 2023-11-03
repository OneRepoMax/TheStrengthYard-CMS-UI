<template>
    <v-app>
        <default-bar :menuItems = this.menuItems />
        <v-container fluid class="py-3 py-md-8 px-0 w-100 " min-height="87.5vh" align-content="center">
            <default-view />
        </v-container>
        <default-footer />
    </v-app>
</template>

<script>
import DefaultBar from '@/components/common/AppBar.vue'
import DefaultView from './View.vue'
import DefaultFooter from '@/components/common/Footer.vue'
import { useUserStore } from '@/store/user'

export default {
    setup() {
        const userStore = useUserStore()

        return { userStore }

    },
    data() {
        return {
            menuItems: {}
        }
    },
    mounted() {
        if (this.userStore.userType == 'C') {
            this.menuItems = [
                { title: 'Home', path: '/', icon: "mdi-home", color: 'transparent' },
                { title: 'Updates', icon: "mdi-calendar-badge", path: '/schedule', color: 'transparent' },
                { title: 'Book', icon: "mdi-login-variant", path: '/book', color: 'transparent' },
                { title: 'Powerlifting', path: '/powerlifting/training', icon: "mdi-weight-lifter",  color: 'transparent' },
                { title: 'Buy Membership', path: '/membership/purchase-membership', icon: "mdi-cart-arrow-down", color: 'amber-darken-3' },
            ]
        } else if (this.userStore.userType == "A"){
            this.menuItems = [
                { title: 'Home', path: '/', icon: "mdi-home", color: 'transparent' },
                { title: 'Updates', icon: "mdi-calendar-badge", path: '/schedule', color: 'transparent' },
                { title: 'Book', icon: "mdi-login-variant", path: '/book', color: 'transparent' },
                { title: 'Dashboard', path: '/admin/home', icon: "mdi-home", color: 'transparent' },
                { title: 'Account', icon: "mdi-account", path: '/admin/account', color: 'transparent' },
                { title: 'Membership', icon: "mdi-list-box", path: '/admin/membership', color: 'transparent' },
                { title: 'Class', icon: "mdi-google-classroom", path: '/admin/class', color: 'transparent' },
                

            ]
        }

    },
    components: {
        DefaultBar, DefaultView, DefaultFooter
    }
}
</script>

