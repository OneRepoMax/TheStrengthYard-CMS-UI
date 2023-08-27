<template>
    <v-container class="d-flex d-columns">
        <v-row>
            <v-col cols="12" lg="8" no-gutters>
                <v-alert v-if="!userStore.verified" type="warning" border="start" color="amber" title="Your account is not verified! " text="Please check your email for verification or click here to resend verification email." closable class="mb-3" elevation="2"></v-alert>
                <profile-card :fullName="userStore.firstName + ' ' + userStore.lastName"
                    :emailAddress="userStore.emailAddress" :homeAddress="userStore.homeAddress"
                    :membershipRecord="membershipRecord" :displayPicture="userStore.displayPicture" />
                <Classes />
            </v-col>

            <v-col cols="12" lg="4" no-gutters>
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



    </v-container>
</template>

<script>

import { useUserStore } from '@/store/user'
import ProfileCard from '@/components/ProfileCard.vue'
import MembershipLog from '@/components/MembershipLog.vue'
import Classes from '@/components/Classes.vue'
import OrgProfileCard from '@/components/OrgProfileCard.vue'

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
                this.loading=true;
                await this.userStore.getUserInfo();
                this.loading=false;
            } catch (error) {
                console.log(error);
            }
        }
    },
    
    components: { ProfileCard, MembershipLog, Classes, OrgProfileCard }

}




</script>
