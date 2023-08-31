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
                        {{ membershipData.ActiveStatus }}
                    </td>
                    <td><v-btn size="x-small" icon="mdi-open-in-new" variant="text"></v-btn></td>
                </tr>
            </tbody>
        </v-table>

    </template>
</template>

<script>

import { useDate } from 'vuetify/labs/date'


export default {
    setup() {
        const date = useDate()

        return { date }
    },
    props: {
        membershipRecord: Object
    },
    methods: {
        formattedDate(dateInput) {
            const date = new Date(dateInput);
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, "0");
            const day = String(date.getUTCDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        }
    }
}
</script>

<style lang="scss" scoped></style>