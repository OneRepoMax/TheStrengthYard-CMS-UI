<template>
    <!-- No membership placeholder -->
    <v-alert v-if="this.membershipRecord.length == 0" type="info" title="There's no membership record found for this user"
        prepend-icon="mdi-information-outline">
    </v-alert>
    <template v-if="this.membershipRecord.length > 0">

        <v-row no-gutters>
            <v-col>
                <h5 class="text-h5">Membership Record</h5>
                <div>All membership record listed in this account.</div>
            </v-col>
            <v-col class="hidden-xs-only text-left" cols="12" md="2">
                <v-btn block prepend-icon="mdi-square-edit-outline" color="light-blue" size="small">Edit Memberships</v-btn>
            </v-col>
        </v-row>

        <v-divider class="my-3"></v-divider>
        <v-table density="compact">
            <thead>
                <tr>
                    <th class="text-left font-weight-bold">
                        Membership Title
                    </th>
                    <th class="text-left font-weight-bold">
                        Type
                    </th>
                    <th class="text-left font-weight-bold">
                        Start Date
                    </th>
                    <th class="text-left font-weight-bold">
                        End Date
                    </th>
                    <th class="text-left font-weight-bold">
                        Fee
                    </th>
                    <th class="text-left font-weight-bold">
                        Status
                    </th>
                    <th class="text-left font-weight-bold">
                        Log
                    </th>

                </tr>
            </thead>
            <tbody>
                <tr v-for="membershipData in this.membershipRecord" :key="membershipData.MembershipRecordId">
                    <td>{{ membershipData.Membership.Title }}</td>
                    <td>{{ membershipData.Membership.Type }}</td>
                    <td>{{ this.formattedDate(membershipData.StartDate) }}</td>
                    <td>{{ this.formattedDate(membershipData.EndDate) }}</td>
                    <td>{{ membershipData.Membership.BaseFee }}</td>
                    <td>
                        <v-chip v-if="membershipData.ActiveStatus.toUpperCase() == 'ACTIVE'" color="primary" prepend-icon="mdi-check">
                            {{ membershipData.ActiveStatus }}
                        </v-chip>
                        <v-chip v-if="membershipData.ActiveStatus.toUpperCase() == 'INACTIVE'" color="secondary" prepend-icon="mdi-close">
                            {{ membershipData.ActiveStatus }}
                        </v-chip>
                        <v-chip v-if="membershipData.ActiveStatus.toUpperCase() == 'PAUSED'" color="orange" prepend-icon="mdi-pause">
                            {{ membershipData.ActiveStatus }}
                        </v-chip>
                    </td>
                    <td><v-btn size="x-small" icon="mdi-open-in-new" variant="text"
                            @click.prevent="showMembershipLog(membershipData)"></v-btn></td>
                    <!-- Membership Log Modal -->
                    <div class="d-none">
                        <MembershipLogModal v-model="membershipLog.show" @closeModal="closeModal"
                            :membershipLog="membershipLog.data" :membership="selectedMembershipRecord" />
                    </div>
                </tr>
            </tbody>
        </v-table>

        <v-progress-linear v-if="logLoading" indeterminate></v-progress-linear>

    </template>
</template>

<script>

import { useMembershipStore } from '@/store/membership'
import MembershipLogModal from '@/components/membership/MembershipLogModal.vue'


export default {
    setup() {
        const membershipStore = useMembershipStore();

        return { membershipStore }
    },
    props: {
        membershipRecord: Object
    },
    components: {
        MembershipLogModal
    },
    data() {
        return {
            membershipLog: {
                show: false,
                data: [],
            },
            selectedMembershipRecord: null,
            logLoading: false,
        }
    },
    methods: {
        formattedDate(dateInput) {
            const date = new Date(dateInput);
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, "0");
            const day = String(date.getUTCDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        },
        closeModal() {
            this.membershipLog.show = false
        },
        async showMembershipLog(membershipData) {
            this.logLoading = true;
            this.membershipLog.data = []
            this.selectedMembershipRecord = membershipData
            const response = await this.membershipStore.getMembershipLogByMembershipRecordId(membershipData.MembershipRecordId)
            
            this.logLoading = false;

            if (response.status == 200) {
                this.membershipLog.data = response.data
                this.membershipLog.show = true
            }
        }
    }
}
</script>

<style lang="scss" scoped></style>