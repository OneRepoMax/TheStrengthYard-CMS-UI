<template>
    <v-expansion-panels variant="popout" class="pa-4">
        <v-expansion-panel v-for="account in this.clientAccounts" :key="account.UserId" :value="account.UserId">
            <v-expansion-panel-title @click.prevent="updateRecord(account.UserId)">
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
                        <v-chip prepend-icon="mdi-phone" @click.prevent="phoneCall(account.ContactNo)">{{ account.ContactNo
                        }}</v-chip>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col class="hidden-xs-only text-left " cols="12" md="2">
                        <v-btn class="me-5" prepend-icon="mdi-square-edit-outline" color="amber" size="small" block
                            @click.prevent="editProfile(account.UserId)">Edit Profile</v-btn>
                    </v-col>
                </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-card-text class="pb-1">
                    <p class="text-h6 mb-2"><v-icon class="me-3" >mdi-home</v-icon>Address</p>
                    {{ account.HomeAddress }}<br>
                    Singapore {{ account.PostalCode }}
                </v-card-text>
                <v-card-text class="pb-1">
                    <p class="text-h6 mb-2"><v-icon class="me-3" size="small">mdi-note-text-outline</v-icon>Medical Remarks</p>
                    {{ indemnityRecord.MedicalRemarks }}
                </v-card-text>
                <v-card-text v-if="indemnityRecord.MedicalHistory != null" class="pb-5">
                    <p class="text-h6 mb-2"><v-icon class="me-3" size="small">mdi-medical-bag</v-icon>Medical History</p>
                    <div class="d-flex flex-wrap">
                        <template v-for="data in indemnityRecord.MedicalHistory.split(', ')" :key="data.IndemnityFormId">
                            <v-chip class="mb-3 me-3" size="small">{{ data }}</v-chip>
                        </template>
                    </div>

                </v-card-text>
                <v-divider></v-divider>
                <v-card-text>
                    <!-- Skeleton loaders -->
                    <template v-if="loading">
                        <v-card-text class="px-8">
                            <v-skeleton-loader type="list-item-three-line" :loading="loading"></v-skeleton-loader>
                        </v-card-text>
                    </template>
                    <MembershipRecordList v-if="!loading" :membershipRecord="this.membershipRecord"
                        :userId="account.UserId" />
                </v-card-text>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>

import MembershipRecordList from '@/components/membership/MembershipRecordList.vue'
import { useMembershipStore } from '@/store/membership'
import { useUserStore } from '@/store/user';

export default {

    setup() {
        const membershipStore = useMembershipStore();
        const userStore = useUserStore();
        return { membershipStore, userStore }
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
            indemnityRecord: [],
            loading: true,
        }
    },
    watch: {
        selectedUserId(newValue) {
            this.getMembershipRecord(newValue);
            this.getIndemnityData(newValue);
        }
    },
    methods: {
        editProfile(userId) {
            this.$router.push(`/admin/account/${userId}`)
        },
        async updateRecord(userId) {
            this.getIndemnityData(userId);
            this.getMembershipRecord(userId)
        },
        async getMembershipRecord(userId) {
            this.loading = true;
            this.membershipRecord = []
            const response = await this.membershipStore.getMembershipRecordByUserId(userId);
            this.loading = false;

            if (response.status != 200) {
                console.log("No membership record found");
            } else {
                this.membershipRecord = response.data
            }
        },
        async getIndemnityData(userId) {
            this.indemnityRecord = []
            const response = await this.userStore.getIndemnityForm(userId);
            if (response.status != 200) {
                console.log("No indemnity record found");
            } else {
                this.indemnityRecord = response.data
            }
        },
        phoneCall(contactNo) {
            window.open(`tel:${contactNo}`)
        },
    },


}

</script>

<style lang="scss" scoped></style>