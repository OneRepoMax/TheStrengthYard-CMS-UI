<template>
    <v-main>
        <v-container fluid class="justify-center">
            <v-card max-width="800px" class="mx-auto">
                <template v-if="membership != null">
                    <v-img :src="membership.Picture" max-height="250px" cover></v-img>
                    <div class="pa-5">
                        <v-card-title class="d-flex mb-3 text-wrap">
                            <p class="text-h5 word-wrap me-3 font-weight-bold">{{ membership.Title }}</p>
                            <span>
                                <v-chip>
                                    {{ membership.Type }}
                                </v-chip>
                            </span>
                        </v-card-title>
                        <v-card-text>
                            <p class="text-body-1">Membership Fee: <strong>S${{ membership.BaseFee }} {{ membership.Type
                            }}</strong></p>
                        </v-card-text>
                        <v-card-text class="py-0 text-wrap">
                            <p class="text-body-1">{{ membership.Description }}</p>
                        </v-card-text>
                       

                    </div>
                </template>

                <v-card-text max-width="300px">
                    <div id="paypal-button-container"></div>
                </v-card-text>
            </v-card>

        </v-container>
    </v-main>
</template>

<script>
import { useMembershipStore } from "@/store/membership";
import { useUserStore } from "@/store/user";


export default {
    setup() {
        const membershipStore = useMembershipStore();
        const userStore = useUserStore();


        return { membershipStore, userStore }
    },
    data() {
        return {
            membership: null,
            checkout: {
                paymentMode: null,
                startDate: null
            },
        }
    },
    async mounted() {
        this.getMembership();
        await this.mountPaypalButton();
    },
    methods: {
        async getMembership() {
            this.loading = true;
            const response = await this.membershipStore.getMembershipById(this.membershipId())
            this.loading = false;

            if (response.status == 200) {
                this.membership = response.data[0]
            }
        },
        membershipId() {
            return this.$route.params.id || null;
        },
        mountPaypalButton() {
            // eslint-disable-next-line no-undef
            paypal
                .Buttons({
                    style: {
                        shape: "rect",
                        color: "gold",
                        layout: "vertical",
                        label: "paypal",
                        size: "small",
                        height: 40
                    },
                    // createSubscription: async function (data, actions) {
                    //     // 1. get the selected package

                    //     // insert user plan id
                    //     // 2. Create a subscription
                    //     return actions.subscription.create({
                    //         plan_id: plan_ID
                    //     });
                    // },
                    // eslint-disable-next-line no-unused-vars
                    onApprove: async function (data, actions) {
                        /**
                         * NOTE
                         * - Save the subscription id in your Database
                         * - This is important to ensure you can always
                         * - Check on the status when user logs in or wants
                         * - to make payment
                         */

                        // 2. Save payment subscription id
                        //let subscrption_id = data.subscriptionID;

                        // 4. Remove the selected package from the local storage


                        console.log(
                            "Success"
                        );
                    },
                    onCancel(data) {
                        console.log(data);
                    }
                }).render("#paypal-button-container");
        }
    }
}
</script>

<style lang="scss" scoped></style>