<template>
    <v-container class="d-flex d-columns">
        <v-row>
            <v-col cols="12" md="8" no-gutters>
                <template v-if="!loading">
                    <profile-card :fullName="userStore.firstName + ' ' + userStore.lastName"
                        :emailAddress="userStore.emailAddress" :homeAddress="userStore.homeAddress"
                        :membershipRecord="membershipRecord" />
                    <Classes />
                </template>

                <!-- Sekelton loaders -->
                <template v-if="loading">
                    <v-skeleton-loader class="mb-3" elevation="3" type="card-avatar, article"
                        :loading="loading"></v-skeleton-loader>
                    <v-skeleton-loader class="mb-3" elevation="3" type="table-heading, list-item-two-line"
                        :loading="loading"></v-skeleton-loader>
                </template>

            </v-col>

            <v-col cols="12" md="4">
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
            loading: true,
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
        const readyHandler = () => {
            if (document.readyState == 'complete') {
                this.loading = false;
                document.removeEventListener('readystatechange', readyHandler);
            }
        };

        document.addEventListener('readystatechange', readyHandler);

        readyHandler()

    },
    components: { ProfileCard, MembershipLog, Classes, OrgProfileCard }

}




</script>
