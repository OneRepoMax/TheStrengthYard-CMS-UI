<template>
    <v-expansion-panels variant="popout" class="pa-4">
        <v-expansion-panel v-for="account in this.clientAccounts" :key="account.UserId" :value="account.UserId">
            <v-expansion-panel-title @click.prevent="getMembershipRecord(account.UserId)">
                <v-row align="center" class="spacer" dense>
                    <v-col cols="2" md="1">
                        <v-avatar size="36px">
                            <v-img v-if="account.DisplayPicture" alt="Avatar" :src="account.DisplayPicture"></v-img>
                            <v-icon v-else color="black" icon="mdi-account"></v-icon>
                        </v-avatar>
                    </v-col>
                    <v-col class="hidden-xs-only text-left" cols="8" md="2">
                        <strong>{{ account.FirstName + " " + account.LastName }}</strong>
                    </v-col>
                    <v-col class="hidden-xs-only text-left" cols="12" md="3">
                        {{ account.EmailAddress }}
                    </v-col>
                    <v-col class="hidden-xs-only text-left" cols="12" md="2">
                        <v-chip prepend-icon="mdi-phone" @click.prevent="phoneCall(account.ContactNo)">{{ account.ContactNo }}</v-chip>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col class="hidden-xs-only text-left " cols="12" md="2">
                        <v-btn class="me-5" prepend-icon="mdi-square-edit-outline" color="amber" size="small" block
                            @click.prevent="editProfile(account.UserId)">Edit Profile</v-btn>
                    </v-col>
                </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-card-text>
                    <v-icon class="me-3">mdi-home</v-icon>Home Address: {{ account.HomeAddress }}
                    {{ account }}
                </v-card-text>
                <v-card-text>
                    <!-- Skeleton loaders -->
                    <template v-if="loading">
                        <v-card-text class="px-8">
                            <v-skeleton-loader type="list-item-three-line" :loading="loading"></v-skeleton-loader>
                        </v-card-text>
                    </template>
                    <MembershipRecordList v-if="!loading" :membershipRecord="this.membershipRecord" :userId="account.UserId" />
                </v-card-text>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>

import MembershipRecordList from '@/components/membership/MembershipRecordList.vue'
import { useMembershipStore } from '@/store/membership'

export default {

    setup() {
        const membershipStore = useMembershipStore();
        return { membershipStore }
    },
    props: {
        clientAccounts: Object,
    },
    components: {
        MembershipRecordList
    },

    data() {
        return {
            selectedUserId: null,
            membershipRecord: [],
            loading: true,
        }
    },
    watch: {
        selectedUserId(newValue) {
            this.getMembershipRecord(newValue);
        }
    },
    methods: {
        editProfile(userId) {
            this.$router.push(`/admin/account/${userId}`)
        },
        async getMembershipRecord(userId) {

            this.membershipRecord = []
            this.loading = true;
            const response = await this.membershipStore.getMembershipRecordByUserId(userId);
            this.loading = false;

            if (response.status != 200) {
                console.log("No membership record found");
            } else {
                this.membershipRecord = response.data
            }
        },
        phoneCall(contactNo){
            window.open(`tel:${contactNo}`)
        },
    },


}

</script>

<style lang="scss" scoped></style>