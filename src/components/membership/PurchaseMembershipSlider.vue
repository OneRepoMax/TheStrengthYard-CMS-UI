<template>
    <v-card class="my-3" elevation="3">
        <v-card-text>
            <v-card-title>
                Get your membership now!
            </v-card-title>
            <v-card-subtitle>
                <p class="text-wrap mb-3">
                    Here’s Our Gym Classes For Those Who Enjoy The Camaraderie Of Training In A Group While Getting
                    Functionally Stronger!
                </p>
            </v-card-subtitle>
            <v-divider></v-divider>
        </v-card-text>
        <v-card-text class="py-0">
            <v-carousel :continuous="false" v-model="page" hide-delimiter-background cycle show-arrows hide-delimiters
                height="450px" class="px-2">
                <v-carousel-item v-for="(slice, index) in slicedMemberships" :key="index">
                    <v-row dense>
                        <v-col v-for="membership in slice" :key="membership.MembershipTypeId"
                            :value="membership.MembershipTypeId" cols="12" md="6" lg="6">
                            <v-hover v-slot="{ isHovering, props }">
                                <v-card class=" my-2" :class="{ 'on-hover': isHovering }" variant="flat"
                                    @click="makePayment(membership)" v-bind="props" height="400px">
                                    <v-img class="align-end text-white" max-height="150px" :src="membership.Picture" cover>
                                    </v-img>
                                    <v-card-title class="text-subtitle-1">
                                        <p class="text-wrap">{{ membership.Title }}</p>
                                    </v-card-title>
                                    <v-card-subtitle class="mb-2">
                                        <p class="text-wrap">{{ membership.Description }}</p>
                                    </v-card-subtitle>
                                    <v-card-subtitle class="mb-2">
                                        <v-icon color="error" icon="mdi-refresh" size="small"></v-icon>
                                        <span class="mx-1">Recurring {{ membership.Type }}</span>
                                    </v-card-subtitle>
                                    <v-card-subtitle class="mb-2">
                                        <v-icon color="error" icon="mdi-currency-usd" size="small"></v-icon>
                                        <span class="mx-1">Base Feee: {{ membership.BaseFee }}</span>
                                    </v-card-subtitle>
                                </v-card>
                            </v-hover>
                        </v-col>
                    </v-row>
                </v-carousel-item>
            </v-carousel>

        </v-card-text>

    </v-card>
</template>

<script>
import { useMembershipStore } from "@/store/membership";

export default {
    props: {
        membershipRecord: Array,
    },
    setup() {
        const membershipStore = useMembershipStore();
        return { membershipStore };
    },
    data() {
        return {
            loading: false,
            membershipList: [],
            page: 1,
        };
    },
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
    computed: {
        slicedMemberships() {
            // Slice the membership records into groups of three
            const sliced = [];
            for (let i = 0; i < this.membershipList.length; i += 2) {
                sliced.push(this.membershipList.slice(i, i + 2));
            }
            return sliced;
        },
    },
    components: {
        // Modal,
    },
};
</script>

<style lang="scss" scoped>
.subtext {
    height: 50px;
}

.v-card {
    transition: opacity 0.2s ease-in-out;
}

.v-card:hover {
    cursor: pointer;
}

.v-card:not(.on-hover) {
    opacity: 1;
}
</style>
