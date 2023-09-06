<template>
    <v-container fluid class="mx-auto">
        <div class="mb-3">
            <v-row class="d-flex">
                <v-col cols="12" sm="3">
                    <card :title="this.totalNumUser.title" :message="this.totalNumUser.message" />
                </v-col>
                <v-col cols="12" sm="3">
                    <card :title="this.numActiveUserToday.title" :message="this.numActiveUserToday.message" />
                </v-col>
                <v-col cols="12" sm="3">
                    <card :title="this.numActiveUserWeek.title" :message="this.numActiveUserWeek.message" />
                </v-col>
                <v-col cols="12" sm="3">
                    <card :title="this.numActiveUserYear.title" :message="this.numActiveUserYear.message" />
                </v-col>
            </v-row>
        </div>

        <div class="mb-5">
            <v-row>
                <v-col cols="12" md="6">
                    <ActiveUser class="bg-white px-3 pt-3 rounded"/>
                </v-col>
                <v-col cols="12" md="6">
                    <MembershipType class="bg-white pa-3 rounded"/>
                </v-col>
            </v-row>
        </div>

        <div>
            <DataTable />
        </div>

    </v-container>
</template>

<script>
import card from '@/components/common/Card.vue'
import ActiveUser from '@/components/home/DataUsers.vue'
import MembershipType from '@/components/home/DataMemberships.vue'
import DataTable from '@/components/home/DataTable.vue'

export default {
    components: {
        card,
        ActiveUser,
        MembershipType,
        DataTable
    },
    setup () {
        

        return {}
    },

    data (){
        return {
            totalNumUser: {
                title: "Total No. of Users",
                message: "60"
            },
            numActiveUserToday: {
                title: "No. of Active Users (Today)",
                message: "23"
            },
            numActiveUserWeek: {
                title: "No. of Active Users (Week)",
                message: "35"
            },
            numActiveUserYear: {
                title: "No. of Active Users (Year)",
                message: "54"
            },
        }
        
    },
}
</script>

<style lang="scss" scoped>

</style>