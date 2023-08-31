<template>
    <!-- Skeleton loaders -->
    <template v-if="loading">
        <v-card-text class="px-8">
            <v-skeleton-loader type="list-item-avatar-three-line" :loading="loading" v-for="index in 10"
                :key="index"></v-skeleton-loader>
        </v-card-text>
    </template>

    <!-- No membership placeholder -->
    <v-alert v-if="!loading" title="There's no membership record found for this user" text="..." prepend-icon="mdi-information-outline">
    </v-alert>

    <v-card v-if="!loading">
        <v-card-title>Membership Record</v-card-title>
        
    </v-card>


</template>

<script>

import { useMembershipStore } from '@/store/membership'

export default {
    setup() {

        const membershipStore = useMembershipStore();

        return { membershipStore }
    },
    data() {
        return {
            membershipRecord: [],
            loading: true,
        }
    },
    mounted() {
        this.getMembershipRecord(this.userId);
    },
    methods: {
        async getMembershipRecord(userId) {
            this.loading = true;
            const response = await this.membershipStore.getMembershipRecordByUserId(userId);
            this.loading = false;

            if (response.status != 200 || response.data.length == 0) {
                console.log("No membership record found");
            } else {
                this.membershipRecord = response.data
            }
        }
    },
    props: {
        userId: String
    }

}
</script>

<style lang="scss" scoped></style>