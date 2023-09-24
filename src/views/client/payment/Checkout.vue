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

                <v-card-text class="w-100">
                    <div id="paypal-button-container" class="mx-auto"></div>
                </v-card-text>
            </v-card>

        </v-container>

        <Modal v-model="modal.show" :path="modal.path" :title="modal.title" :message="modal.message" :icon="modal.icon"
            @closeModal="closeModal" />

    </v-main>
</template>

<script>
import { useMembershipStore } from "@/store/membership";
import Modal from "@/components/common/Modal.vue";
import { useUserStore } from "@/store/user";


export default {
    components: {
        Modal
    },
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
            modal: {
                show: false,
                type: "success",
                icon: "mdi-check-circle",
                title: "Purchase successful",
                message: "You have successfully purchased the membership. You can view your membership details in your profile page.",
                path: "/"
            }
        }
    },
    async mounted() {
        this.getMembership();
    },
    methods: {
        async getMembership() {
            this.loading = true;
            this.loading = false;

            if (this.membershipStore.membershipRecord != null) {
                this.membership = this.membershipStore.membershipRecord.Membership
                console.log(this.membershipRecord);

                // Check for one time or subscription type

                if (this.membership.Type.toUpperCase() == "ONE-TIME") {
                    await this.mountPaypalOrderButton(this.membership.PayPalPlanId);
                } else {
                    await this.mountPaypalSubscriptionButton(this.membership.PayPalPlanId);
                }

            }
        },
        membershipId() {
            return this.$route.params.id || null;
        },
        closeModal() {
            this.modal.show = false
        },
        async mountPaypalSubscriptionButton(planId) {
            const vm = this;
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
                    //2. Create a subscription
                    createSubscription: async function (data, actions) {

                        // 1. get the selected package

                        // insert user plan id

                        return actions.subscription.create({
                            plan_id: planId
                        });
                    },
                    // eslint-disable-next-line no-unused-vars
                    onApprove: async function (data, actions) {
                        /**
                         * NOTE
                         * - Save the subscription id in your Database
                         * - This is important to ensure you can always
                         * - Check on the status when user logs in or wants
                         * - to make payment
                         */

                        // Save payment subscription id
                        let subscriptionId = data.subscriptionID;

                        console.log(data);
                        console.log(actions);

                        // Post the subscription id and payment details to the backend

                        // Process endDate based on membership Type in "YYYY-MM-DD" without the time stamp format
                        let endDate = new Date();
                        if (vm.membership.Type.toUpperCase() == "MONTHLY") {
                            endDate.setMonth(endDate.getMonth() + 1);
                        } else if (vm.membership.Type.toUpperCase() == "YEARLY") {
                            endDate.setFullYear(endDate.getFullYear() + 1);
                        }

                        const payload = {
                            userId: vm.userStore.userId,
                            membershipTypeId: vm.membership.MembershipTypeId,
                            startDate: new Date(),
                            endDate: endDate,
                            subscriptionId: subscriptionId
                        }

                        try {

                            const response = await vm.membershipStore.addMembershipRecord(payload)

                            if (response.status == 200) {
                                vm.modal.show = true;
                                vm.modal.type = "success";
                                vm.modal.icon = "mdi-check-circle";
                                vm.modal.title = "Purchase successful";
                                vm.modal.message = "You have successfully purchased the membership. You can view your membership details in your profile page.";
                                vm.modal.path = "/";
                            }

                        } catch (error) {

                            vm.modal.show = true;
                            vm.modal.type = "error";
                            vm.modal.icon = "mdi-alert-circle";
                            vm.modal.title = "Purchase failed";
                            vm.modal.message = "There was an error processing your payment. Please contact admin.";
                            vm.modal.path = "/membership/";

                        }

                        console.log(
                            "Success"
                        );
                    },
                    onCancel(data) {
                        console.log(data);
                    }
                }).render("#paypal-button-container");
        },
        async mountPaypalOrderButton(orderId) {
            const vm = this;
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
                    //2. Create order
                    createOrder: async function (data, actions) {

                        console.log(actions);

                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    currency_code: 'SGD',
                                    value: vm.membership.BaseFee,
                                }
                            }],
                        });
                    },
                    // eslint-disable-next-line no-unused-vars
                    onApprove: async function (data, actions) {
                        /**
                         * NOTE
                         * - Save the order id in Database
                         * - This is important to ensure you can always
                         * - Check on the status when user logs in or wants
                         * - to make payment
                         */

                        try {

                            return actions.order.capture().then(details => {
                                console.log(details);
                            });
                            
                        } catch (error) {

                            // Three cases to handle:
                            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                            //   (2) Other non-recoverable errors -> Show a failure message
                            //   (3) Successful transaction -> Show confirmation or thank you message

                            const errorDetail = error?.details?.[0];

                            if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
                                // Recoverable state, see: "Handle Funding Failures"
                                return actions.restart();
                            }

                            // Show an error message here, when an error occurs
                            console.error(error);


                        }
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