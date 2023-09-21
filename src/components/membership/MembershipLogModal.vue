<template>
    <v-dialog max-width="800px" @input="$emit('input', $event)">
        <v-card elevation="3" title="Membership Log">
            <template v-slot:append>
                <v-btn icon="$close" variant="text" @click="$emit('closeModal')"></v-btn>
            </template>
            <template v-slot:prepend>
                <v-icon prepend-icon class="me-2">mdi-text-account</v-icon>
            </template>
            <v-divider></v-divider>
            <v-img :src="membership.Membership.Picture" cover max-height="130px"></v-img>
            <v-card-title>{{ membership.Membership.Title }}</v-card-title>
            <v-card-subtitle class="d-flex d-cols flex-wrap">
                <v-chip v-if="membership.ActiveStatus.toUpperCase() == 'INACTIVE'
                    || membership.ActiveStatus.toUpperCase() == 'EXPIRED'
                    || membership.ActiveStatus.toUpperCase() == 'PENDING PAYMENT'" color="secondary"
                    prepend-icon="mdi-close" class="me-3 mb-3">
                    {{ membership.ActiveStatus }}
                </v-chip>
                <v-chip v-if="membership.ActiveStatus.toUpperCase() == 'ACTIVE'" color="primary" prepend-icon="mdi-check"
                    class="me-3 mb-3">
                    {{ membership.ActiveStatus }}
                </v-chip>
                <v-chip v-if="membership.ActiveStatus.toUpperCase() == 'PAUSED'" color="orange" prepend-icon="mdi-pause"
                    class="me-3 mb-3">
                    {{ membership.ActiveStatus }}
                </v-chip>
                <v-chip class="me-3 mb-3">
                    {{ membership.Membership.Type }}
                </v-chip>
                <v-chip class="me-3 mb-3">
                    Base Fee: {{ membership.Membership.BaseFee }}
                </v-chip>
                <v-chip class="me-3 mb-3">
                    Membership Record ID: {{ membership.MembershipRecordId }}
                </v-chip>
                <v-chip class="me-3 mb-3" color="primary" v-if="membership.PayPalSubscriptionId != null">
                    PayPal Subscription ID: {{ membership.PayPalSubscriptionId }}
                </v-chip>
                <v-chip class="me-3 mb-3">
                    <v-icon icon="mdi-calendar" size="18" color="error" class="me-1 pb-1"></v-icon> Effective Date:
                    {{ formattedDate(membership.StartDate) }} to {{ formattedDate(membership.EndDate) }}
                </v-chip>
            </v-card-subtitle>
            <div>
                <v-tabs v-model="tab" >
                    <v-tab :value="1">Membership Log</v-tab>
                    <v-tab :value="2">Payment History</v-tab>
                </v-tabs>
                <v-window v-model="tab">
                    <v-window-item :value="1">
                        <v-card-text>
                            <div class="font-weight-bold ms-1 mb-2">
                                Membership Log
                            </div>
                            <v-card color="grey-lighten-4" title="Add membership log" v-if="logForm.show">
                                <template v-slot:append>
                                    <v-btn icon="$close" variant="text" @click="logForm.show = false"></v-btn>
                                </template>
                                <v-card-text>
                                    <v-row class="d-flex d-cols" dense>
                                        <v-col cols="12" sm="3">
                                            <v-select :items="logForm.actionTypes" v-model="logFormData.actionType"
                                                label="Action Type" hide-details="auto" density="compact" class="p-0"
                                                variant="solo">
                                            </v-select>
                                        </v-col>
                                        <v-col cols="12" sm="3">
                                            <v-text-field type="date" density="compact" label="Date" hide-details="auto"
                                                v-model="logFormData.date" variant="solo">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-text-field label="Description" placeholder="Enter description here..."
                                                type="text" hide-details="auto" density="compact" variant="solo"
                                                v-model="logFormData.description">
                                                <template v-slot:append-inner>
                                                    <v-btn size="small" color="black" @click.prevent="addMembershipLog()"
                                                        :loading="logForm.loading">
                                                        Submit
                                                    </v-btn>
                                                </template>
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>

                            <v-timeline align="start" density="compact">
                                <template v-if="this.userStore.userType == 'A'">
                                    <v-timeline-item fill-dot class="mb-12" dot-color="orange" size="large"
                                        v-if="!logForm.show">
                                        <template v-slot:icon>
                                            <v-icon>mdi-plus</v-icon>
                                        </template>
                                        <v-btn class="mx-0" color="orange" block
                                            @click.prevent="logForm.show = !logForm.show">
                                            New log
                                        </v-btn>
                                    </v-timeline-item>
                                </template>

                                <v-timeline-item v-for="log in sortedMembershipLog" :key="log.MembershipLogId"
                                    dot-color="black" size="x-small">
                                    <div class="mb-4">
                                        <div class="font-weight-normal">
                                            <strong>{{ log.ActionType }}</strong> @ {{ formattedDate(log.Date) }}
                                        </div>
                                        <div>{{ log.Description }}</div>
                                    </div>
                                </v-timeline-item>
                            </v-timeline>
                        </v-card-text>
                    </v-window-item>
                </v-window>
                <v-window v-model="tab">
                    <v-window-item :value="2" class="pa-3">
                        <template v-if="paymentData.length == 0">
                            <v-alert type="info" title="No payment history found"
                                text="There's no payment history found for this membership record. Please allow the system to process your payment and check back later."></v-alert>
                        </template>
                        <template v-else>
                            <v-table>
                                <thead>
                                    <tr>
                                        <th class="text-left font-weight-bold">Transaction Date</th>
                                        <th class="text-left font-weight-bold">Payment ID</th>
                                        <th class="text-left font-weight-bold">Amount</th>
                                        <th class="text-left font-weight-bold">Discount</th>
                                        <th class="text-left font-weight-bold">Payment Mode</th>
                                        <th class="text-left font-weight-bold">Transaction ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="payment in paymentData" :key="payment.PaymentId">
                                        <td>{{ formattedDate(payment.TransactionDate) }}</td>
                                        <td>{{ payment.PaymentId }}</td>
                                        <td>{{ payment.Amount }}</td>
                                        <td>{{ payment.Discount }}</td>
                                        <td>{{ payment.PaymentMode }}</td>
                                        <td>{{ payment.PayPalTransactionId }}</td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </template>
                    </v-window-item>
                </v-window>
            </div>
        </v-card>
        <template>
            <Modal v-model="modal.show" :path="modal.path" :title="modal.title" :message="modal.message" :icon="modal.icon"
                @closeModal="closeModal" :closeOnClick="true" />
        </template>
    </v-dialog>
</template>

<script>

import { useMembershipStore } from '@/store/membership'
import { useUserStore } from '@/store/user';
import { usePaymentStore } from '@/store/payment'
import Modal from '@/components/common/Modal.vue'


export default {
    setup() {

        const userStore = useUserStore();
        const membershipStore = useMembershipStore();
        const paymentStore = usePaymentStore()

        return { userStore, membershipStore, paymentStore }
    },
    props: {
        membershipLog: Array,
        membership: Object
    },
    components: {
        Modal
    },
    data() {
        return {
            tab: 1,
            logFormData: {
                actionType: null,
                description: null,
                date: null,
                membershipRecordId: this.membership.MembershipRecordId
            },
            logForm: {
                show: false,
                actionTypes: ['Resume', 'Pause', 'Terminate'],
                loading: false,
            },
            modal: {
                show: false,
                type: "success",
                icon: "mdi-check-circle",
                title: "Update successful",
                message: "Membership log  has been successfully created!",
                path: "/admin/account"
            },
            membershipLogData: [...this.membershipLog],
            paymentData: [
                {
                    Amount: 90,
                    Discount: 0,
                    MembershipRecordId: 1,
                    PayPalTransactionId: "5R580284D01408702",
                    PaymentId: 7000,
                    PaymentMode: "PayPal",
                    TransactionDate: "Sun, 17 Sep 2023 00:00:00 GMT"
                },
                {
                    Amount: 250,
                    Discount: 0,
                    MembershipRecordId: 2,
                    PayPalTransactionId: "48185841BJ220500G",
                    PaymentId: 7001,
                    PaymentMode: "PayPal",
                    TransactionDate: "Wed, 13 Sep 2023 00:00:00 GMT"
                },
                {
                    "Amount": 90,
                    "Discount": 0,
                    "MembershipRecordId": 3,
                    "PayPalTransactionId": "57M12318994098505",
                    "PaymentId": 7002,
                    "PaymentMode": "PayPal",
                    "TransactionDate": "Tue, 19 Sep 2023 00:00:00 GMT"
                }
            ]
        }
    },
    mounted() {
        // this.getPaymentData(this.membership.MembershipRecordId)
    },
    methods: {
        formattedDate(dateInput) {
            const date = new Date(dateInput);
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, "0");
            const day = String(date.getUTCDate()).padStart(2, "0");
            return `${day}-${month}-${year}`;
        },
        formattedInputDate(dateInput) {
            const date = new Date(dateInput);
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, "0");
            const day = String(date.getUTCDate()).padStart(2, "0");
            return `${day}-${month}-${year}`;
        },
        async addMembershipLog() {

            // API CALL
            this.logForm.loading = true;
            this.logForm.membershipRecordId = this.membership.MembershipRecordId
            const response = await this.membershipStore.createMembershipLog(this.logFormData);
            this.logForm.loading = false;

            if (response.status == 200) {
                console.log(response.data);
                this.membershipLogData.push(response.data);
                this.modal.show = true;
            }
        },
        closeModal() {
            this.modal.show = false
        },
        async getPaymentData(membershipRecordId) {
            const response = await this.paymentStore.getPaymentsByMembershipRecordId(membershipRecordId);
            if (response.status == 200) {
                this.paymentData = response.data;
            }
        }
    },
    computed: {
        sortedMembershipLog() {
            return [...this.membershipLogData].sort((a, b) => {
                const dateA = new Date(a.Date).getTime();
                const dateB = new Date(b.Date).getTime();
                return dateB - dateA;
            });
        },
    },
    emits: ['closeModal', 'addMembershipLog']
}
</script>

<style lang="scss" scoped></style>