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
                <v-col cols="12" md="6">
                    <ClassBooking class="bg-white px-3 pt-3 rounded"/>
                </v-col>
                <v-col cols="12" md="6">
                    <!-- <v-card>
                        <v-tabs
                            v-model="tab"
                            bg-color="#fff"
                        >
                            <v-tab value="one">Age</v-tab>
                            <v-tab value="two">Gender</v-tab>
                        </v-tabs>

                        <v-card-text>
                            <v-window v-model="tab">
                            <v-window-item value="one">
                                <AgeDemographic class="bg-white pa-3 rounded"/>
                            </v-window-item>

                            <v-window-item value="two"> -->
                                <AgeDemographic class="bg-white pa-3 rounded"/>
                            <!-- </v-window-item>
                            </v-window>
                        </v-card-text>
                    </v-card> -->
                    
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
import AgeDemographic from '@/components/home/DataAge.vue'
import GenderDemographic from '@/components/home/DataGender.vue'
import MembershipRecord from '@/components/home/DataTable.vue'
import { useAnalyticsStore } from '@/store/analytics'

export default {
    components: {
        card,
        ClassBooking,
        AgeDemographic,
        GenderDemographic,
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

        },
    }
}
</script>

<style lang="scss" scoped>

</style>