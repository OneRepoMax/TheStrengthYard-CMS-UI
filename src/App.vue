<template>
    <router-view />
</template>

<script>

export default {
    created() {
        if (localStorage.getItem("tsyUserInfo") === null) {
            this.$router.push({ path: '/account/login' })
        }
    }

}


</script>
