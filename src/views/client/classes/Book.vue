<template>
    <v-main>
        <v-container fluid max-width="800px" class="d-flex flex-wrap justify-center align-center">
            <v-card>
                <v-img src="@/assets/BookingBanner.jpg" max-height="250px" cover></v-img>
                <div class="pa-5">
                    <v-card-title>Book A Class</v-card-title>
                    <v-card-text>
                        Here’s Our Gym Classes For Those Who Enjoy The Camaraderie Of Training In A Group While Getting
                        Functionally Stronger!
                    </v-card-text>
                    <!-- <template v-if="!loading">
                        <template v-for="category in categories" :key="category">
                            <v-card-title>{{ category }} Memberships</v-card-title>
                            <v-divider class="mb-5"></v-divider>
                            <div dense class="d-flex flex-wrap">
                                <div v-for="membership in groupedMemberships[category]"
                                    :key="membership.MembershipTypeId">
                                    <PurchaseMembershipCard :membership="membership" />
                                </div>
                            </div>
                        </template>
                    </template> -->
                    <v-divider/>
                    <div class="mt-5">
                        <v-row>
                            <v-col cols="12" md="5" class="text-center">
                                <DatePicker v-model.string="date" :masks="masks"/>
                            </v-col>
                            <v-col cols="12" md="7">
                                <!-- Start of V-if: show empty class -->
                                <div v-if="this.classSlots.length == 0">
                                    <v-card>
                                        <v-card-text class="text-center">
                                            <p>There is no class on this day.</p>
                                        </v-card-text>
                                    </v-card>
                                </div>
                                <!-- End of V-if -->
                                <!-- Start of V-else: Show class slots -->
                                <div v-else>
                                    <div v-for="slot in this.classSlots" :key="slot.ClassSlotId">
                                        <v-card class="mb-3">
                                            <v-row>
                                                <!-- Show Class Slot Detail -->
                                                <v-col cols="10">
                                                    <v-card-item>
                                                        <v-card-title>{{slot.Class.ClassName}}</v-card-title>
                                                        <v-card-subtitle>
                                                            <!-- {{formattedDate(slot.StartTime)}},
                                                            {{slot.Day}}, -->
                                                            {{formattedTime(slot.StartTime)}} - {{slot.Duration}} minutes
                                                        </v-card-subtitle>
                                                    </v-card-item>

                                                    <v-card-text>
                                                        <p>{{slot.CurrentCapacity}}/{{slot.Class.MaximumCapacity}} joined</p>
                                                    </v-card-text>
                                                </v-col>

                                                <!-- Book icon -->
                                                <v-col cols="2" align-self="center">
                                                    <v-btn  variant="text" icon="mdi-calendar-plus" size="large"></v-btn>
                                                </v-col>
                                            </v-row>
                                            
                                        </v-card>
                                    </div>
                                </div>
                                <!-- End of V-Else -->

                            </v-col>
                        
                        </v-row>
                    </div>

                </div>
            </v-card>
        </v-container>
    </v-main>
</template>

<script>
import { reactive, ref } from 'vue';
import { Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { useClassStore } from '@/store/class'

export default {
    components: {
        Calendar,
        DatePicker,
    },

    setup () {
        const classStore = useClassStore();
        return { classStore }
    },

    data() {
        return{
            date: new Date(),
            classSlots: [],
            masks: ref({
                modelValue: 'YYYY-MM-DD',
            }),
        }
    },

    watch: {
        date(){
            this.getClassSlotsByDate();
        }
        
    },

    methods: {
        formattedDate(dateInput) {
            const date = new Date(dateInput);
            const year = String(date.getUTCFullYear()).slice(2);
            const monthNames = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            const month = monthNames[date.getUTCMonth()];
            const day = String(date.getUTCDate());
            return `${day} ${month} ${year}`;
        },

        formattedTime(dateInput){
            const date = new Date(dateInput);
            const hours = String(date.getUTCHours()).padStart(2, '0');
            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        },

        async getClassSlotsByDate() {
            try {
                this.loading = true;

                console.log(this.date)
                const response = await this.classStore.getClassSlotByDate(this.date);

                this.loading = false;
                if (response == null || response.status != 200) {
                    this.classSlots = []
                    console.log(this.classSlots)
                    return
                } else {
                    if (response.status == 200) {
                        this.classSlots = response.data
                    }
                }
                return

            } catch (error) {
                console.error("An error occurred during get all payment history API request:", error);
            }
            return
        },
    },
}
</script>

<style lang="scss" scoped>

</style>