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
    created() {
        if (localStorage.getItem("tsyUserInfo") == null){
            this.$router.push({path: '/account/login'})
        } else {
            this.userStore.loadUserFromLocalStorage()
        }
    }
}

</script>
