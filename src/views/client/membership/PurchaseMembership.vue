<template>
    <v-main>
        <v-container fluid max-width="800px" class="d-flex flex-wrap justify-center align-center">
            <v-card>
                <v-img src="@/assets/purchaseMembershipBanner.png" max-height="250px" cover></v-img>
                <div class="pa-5">
                    <v-card-title>Purchase Membership</v-card-title>
                    <v-card-text>
                        Here’s Our Gym Classes For Those Who Enjoy The Camaraderie Of Training In A Group While Getting
                        Functionally Stronger!
                    </v-card-text>
                    <template v-if="!loading">
                        <template v-for="category in categories" :key="category">
                            <v-card-title>{{ category }} Memberships</v-card-title>
                            <v-divider class="mb-5"></v-divider>
                            <div dense class="d-flex flex-wrap">
                                <div v-for="membership in groupedMemberships[category]"
                                    :key="membership.MembershipTypeId">
                                    <PurchaseMembershipCard :membership="membership" />
                                </div>
                            </div>
                        </template>
                    </template>
                </div>
            </v-card>
        </v-container>
    </v-main>
</template>
  

<script>
import { useMembershipStore } from "@/store/membership";
import PurchaseMembershipCard from "@/components/membership/PurchaseMembershipCard.vue";

export default {
    setup() {
        const membershipStore = useMembershipStore();
        return { membershipStore };
    },
    data() {
        return {
            loading: false,
            membershipList: [],
            groupedMemberships: {}, // New property to store grouped memberships
        };
    },
    computed: {
        categories() {
            // Extract unique membership categories from groupedMemberships
            return Object.keys(this.groupedMemberships);
        },
    },
    methods: {
        async getMembershipList() {
            try {
                const response = await this.membershipStore.getAllPublicMembership();
                if (response.status == 200) {
                    this.membershipList = response.data;
                    this.groupMemberships(); // Call the grouping function after getting the list
                    console.log(this.membershipList);
                }
            } catch (error) {
                console.error("An error occurred during get all membership API request:", error);
            }
        },
        groupMemberships() {
            this.groupedMemberships = {}; // Clear the existing grouped memberships

            // Group memberships by category
            this.membershipList.forEach((membership) => {
                const category = membership.Type;
                if (!this.groupedMemberships[category]) {
                    this.groupedMemberships[category] = [];
                }
                this.groupedMemberships[category].push(membership);
            });

            console.log(this.groupedMemberships);
        },
    },
    components: {
        PurchaseMembershipCard,
    },
    mounted() {
        this.getMembershipList();
    },
};
</script>