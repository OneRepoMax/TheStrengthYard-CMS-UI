<template>
    <div>
        Edit Client Profile
    </div>
</template>

<script>

import { useUserStore } from "@/store/user";

export default {
    setup () {
        
        const userStore = useUserStore();

        return {
            userStore,
        }
    }
}
</script>

<style lang="scss" scoped>

</style>