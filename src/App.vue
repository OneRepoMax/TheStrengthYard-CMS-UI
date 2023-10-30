<template>
  <router-view />
</template>

<script>

import { useUserStore } from '@/store/user'

export default {
    name: 'App',
    setup() {
        const userStore = useUserStore()

        return {
            userStore
        }
    },
    async created() {
        if (localStorage.getItem("tsyUserInfo") == null){
            this.$router.push({path: '/account/login'})
        } else {
            await this.userStore.loadUserFromLocalStorage()
            // Check if jwt is expired
            const jwtCheck = await this.userStore.jwtCheck()
            if (!jwtCheck) {
                this.$router.push({path: '/account/login'})
            } else {
                // Refresh user info
                await this.userStore.refreshUserInfo()
            }
        }
    }
}

</script>
