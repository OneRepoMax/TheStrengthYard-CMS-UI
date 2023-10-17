<template>
    <v-sheet class="mx-auto my-sm-1 my-1" elevation="3">
        <v-card-title class="pt-5 pb-1">Purchase Membership</v-card-title>
        <v-card-subtitle class="pt-0">Discover TSY's memberships and join us today</v-card-subtitle>
        <v-slide-group v-model="model" class="pa-4" selected-class="bg-success">
            <v-slide-group-item v-for="membership, index in this.membershipList" :key="index">
                <v-card variant="flat" class="me-2" height="220" width="200" @click="makePayment(membership)">
                    <v-img class="align-end text-white" max-height="130px" :src="membership.Picture" cover>
                    </v-img>
                    <v-card-item class="pt-2 ps-1 pb-0 text-subtitle-2 card-title">
                        {{ membership.Title }}
                    </v-card-item>
                    
                    <v-card-subtitle class="text-caption ps-1">
                        <v-icon color="error" icon="mdi-refresh" size="small"></v-icon>
                        <span class="mx-1">{{ membership.Type }}</span> 
                        • <v-icon color="error" icon="mdi-currency-usd" size="small"></v-icon>
                        <span class="mx-1">{{ membership.BaseFee }}</span>
                    </v-card-subtitle>
                </v-card>
            </v-slide-group-item>
        </v-slide-group>
    </v-sheet>
</template>

<script>
import { useMembershipStore } from "@/store/membership";

export default {
    setup() {
        const membershipStore = useMembershipStore();
        return { membershipStore };
    },
    data: () => ({
        model: null,
        loading: false,
        membershipList: [],
    }),
    mounted() {
        this.getMembershipList();
    },
    methods: {
        async getMembershipList() {

            this.loading = true;
            const response = await this.membershipStore.getAllPublicMembership();
            this.loading = false;

            if (response.status == 200) {
                this.membershipList = response.data;
            }

        },
        showModal() {
            this.modal.show = true;
            // this.membershipId = id
        },
        closeModal() {
            this.modal.show = false;
        },
        navigateToRoute(route) {
            this.$router.push(route);
        },
        isInMembershipRecord(membership) {
            // Ensure this.membershipRecord is defined before using some
            if (this.membershipRecord && this.membershipRecord.length > 0) {
                return this.membershipRecord.some(
                    (record) => record.MembershipTypeId === membership.MembershipTypeId
                );
            }
            return false; // Return false if membershipRecord is undefined or empty
        },
        makePayment(membership) {
            console.log(membership);
            this.membershipStore.selectedMembership = membership
            this.$router.push(`/membership/checkout`)
        }
    },
}
</script>
<style scoped>

#card-title {
    line-height: 1.5em;
    height: 3em;       /* height is 2x line-height, so two lines will display */
    overflow: hidden;  /* prevents extra lines from being visible */
}

</style>