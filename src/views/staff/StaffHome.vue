<template>
    <v-container fluid class="mx-auto">
        <div class="mb-3">
            <v-row class="d-flex">
                <v-col cols="12" sm="3" v-for="num in numbers" :key="num">
                    <card :title="num.title" :value="num.value" :icon="num.icon" />
                </v-col>
            </v-row>
        </div>

        <div class="mb-5">
            <v-row>
                <v-col cols="12" md="4">
                    <v-card>
                        <Demographics class="bg-white px-3 pt-3 rounded"/>
                    </v-card>
                </v-col>

                <v-col cols="12" md="4">
                    <v-card>
                        <ClassBooking class="bg-white px-3 pt-3 rounded"/>
                    </v-card>
                </v-col>
                
                <v-col cols="12" md="4">
                    <v-card>
                        <TimeSlots class="bg-white px-3 pt-3 rounded"/>
                    </v-card>
                </v-col>

            </v-row>
        </div>

        <div>
            <MembershipRecord />
        </div>

    </v-container>
</template>

<script>
import card from '@/components/common/Card.vue'
import ClassBooking from '@/components/home/DataBooking.vue'
import Demographics from '@/components/home/DataDemographic.vue'
import TimeSlots from '@/components/home/DataTimeSlots.vue'
import MembershipRecord from '@/components/home/DataTable.vue'
import { useAnalyticsStore } from '@/store/analytics'

export default {
    components: {
        card,
        ClassBooking,
        Demographics,
        TimeSlots,
        MembershipRecord,
    },
    setup () {
        const analyticsStore = useAnalyticsStore();
        return { analyticsStore }
    },

    data (){
        return {
            tab: null,
            numbers: [],
        }
        
    },

    mounted() {
        this.getAllNumbers();
    },

    methods: {
        async getAllNumbers(){

            // Get Total Number of Clients
            const totalClient = await this.analyticsStore.getTotalUserCount();
        
            if (totalClient.status == 200){
                const info = {
                    title: "Total Number of Clients",
                    icon: "mdi-account-multiple",
                    value: totalClient.data,
                }
                this.numbers.push(info)
            } else {
                console.log("Error getting total clients")
            }

            // Get Total Number of New Clients This Month
            const totalNew = await this.analyticsStore.getNewUsersThisMonth();
        
            if (totalNew.status == 200){
                const info = {
                    title: "New Clients This Month",
                    icon: "mdi-account-plus",
                    value: totalNew.data,
                }
                this.numbers.push(info)
            } else {
                console.log("Error getting new clients")
            }

            // Get Unique Booking This Month
            const uniqueBooking = await this.analyticsStore.getUniqueBooking();
        
            if (totalNew.status == 200){
                // console.log(uniqueBooking.data["Unique Bookings this month"])
                const info = {
                    title: "Unique Bookings This Month",
                    icon: "mdi-calendar-account",
                    value: uniqueBooking.data["Unique Bookings this month"],
                }
                this.numbers.push(info)
            } else {
                console.log("Error getting unique bookings")
            }

            // Get Membership Breakdown This Month
            const breakdown = await this.analyticsStore.getMembershipBreakdown();
        
            if (totalNew.status == 200){
                // console.log(breakdown.data)
                const info = {
                    title: "Active Membership",
                    icon: "mdi-card-account-details",
                    value: breakdown.data["Total Users with an 'Active' Membership Record"],
                }
                this.numbers.push(info)
            } else {
                console.log("Error getting unique bookings")
            }

        },
    }
}
</script>

<style lang="scss" scoped>

</style>