<template>
    <v-row style="max-width: 1280px;" class="mx-auto">
        <v-col cols="12" v-if="!userStore.verified">
            <v-alert type="warning" border="start" color="amber" title="Your account is not verified! " closable
                elevation="2">
                Please check your email for verification or click <v-chip prepend-icon="mdi-email" variant="tonal"
                    @click="resendVerification()">Resend verification
                    email</v-chip> to verify email address
            </v-alert>
        </v-col>
        <v-col cols="12" lg="8">
            <profile-card :fullName="userStore.firstName + ' ' + userStore.lastName" :emailAddress="userStore.emailAddress"
                :homeAddress="userStore.homeAddress" :membershipRecord="membershipRecord"
                :displayPicture="userStore.displayPicture" />
            <Classes />
        </v-col>

        <v-col cols="12" lg="4" >
            <template v-if="!loading">
                <org-profile-card />
                <membership-log />
            </template>

            <!-- Sekelton loaders -->
            <template v-if="loading">
                <v-skeleton-loader class="mb-3" elevation="3" type="table-heading, list-item-two-line"
                    :loading="loading"></v-skeleton-loader>
                <v-skeleton-loader class="mb-3" elevation="3"
                    type="table-heading	, list-item-avatar-three-line, list-item-avatar-three-line, list-item-avatar-three-line"
                    :loading="loading"></v-skeleton-loader>
            </template>

        </v-col>

    </v-row>

    <template v-if="modal.show">
        <Modal v-model="modal.show" :path="modal.path" :title="modal.title" :message="modal.message" :icon="modal.icon"
            @closeModal="closeModal" />
    </template>
</template>

<script>

import { useUserStore } from '@/store/user'
import ProfileCard from '@/components/home/ProfileCard.vue'
import MembershipLog from '@/components/home/MembershipLog.vue'
import Classes from '@/components/home/Classes.vue'
import OrgProfileCard from '@/components/home/OrgProfileCard.vue'
import Modal from '@/components/common/Modal.vue'

export default {
    name: 'LoginForm',
    setup() {
        const userStore = useUserStore()

        return {
            userStore
        }
    },
    data() {
        return {
            loading: false,
            modal: {
                show: false,
                message: "",
                type: "",
                icon: "",
                path: "/",
            },
            membershipRecord:
                [
                    {
                        ActiveStatus: true,
                        EndDate: "Mon, 01 May 2023 00:00:00 GMT",
                        Membership: {
                            "BaseFee": 90.0,
                            "Description": "Open Gym Membership",
                            "MembershipTypeId": 5,
                            "Type": "Monthly"
                        },
                        MembershipRecordId: 1,
                        MembershipTypeId: 5,
                        StartDate: "Sun, 01 Jan 2023 00:00:00 GMT",
                    },
                    {
                        "ActiveStatus": true,
                        "EndDate": "Mon, 01 Jan 2024 00:00:00 GMT",
                        "Membership": {
                            "BaseFee": 2400.0,
                            "Description": "Progressive Strength Class Membership (Standard)",
                            "MembershipTypeId": 2,
                            "Type": "Yearly"
                        },
                        "MembershipRecordId": 2,
                        "MembershipTypeId": 2,
                        "StartDate": "Sun, 01 Jan 2023 00:00:00 GMT",
                    }
                ]
        }
    },
    mounted() {
        // Call get user by ID
        // this.getUserInfo()
    },
    methods: {
        async getUserInfo() {
            try {
                this.loading = true;
                await this.userStore.getUserInfo();
                this.loading = false;
            } catch (error) {
                console.log(error);
            }
        },
        async resendVerification() {
            try {
                const response = await this.userStore.resendVerificationEmail(this.userStore.emailAddress);
                if (response.status === 200) {
                    this.modal.show = true;
                    this.modal.message = "Success! Please check your email for verification"
                    this.modal.type = "success"
                    this.modal.icon = "mdi-email"
                } else {
                    this.modal.show = true;
                    this.modal.message = "Error! Please contact administrator"
                    this.modal.type = "error"
                    this.modal.icon = "mdi-error"
                }
            } catch (error) {
                console.log("Resend verification error", error);
            }
        },
        closeModal() {
            this.modal.show = false
        },
    },

    components: { ProfileCard, MembershipLog, Classes, OrgProfileCard, Modal }

}




</script>
