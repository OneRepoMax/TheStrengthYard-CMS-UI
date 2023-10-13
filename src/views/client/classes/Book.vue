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

                    <v-divider/>

                    <div class="mt-5">
                        <v-row>
                            <v-col cols="12" md="5" class="text-center">
                                <DatePicker v-model.string="date" :min-date="new Date()" color="gray" :masks="masks" :attributes="attributes" expanded>
                                    <template #footer>
                                    <div class="w-full px-4 pb-3">
                                        <v-btn block color="black" @click="moveToday">
                                            Today
                                        </v-btn>
                                    </div>
                                    </template>
                                </DatePicker>
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
                                                        <v-card-title>
                                                            {{slot.Class.ClassName}}
                                                        </v-card-title>
                                                        <v-card-subtitle>
                                                            <!-- {{formattedDate(slot.StartTime)}},
                                                            {{slot.Day}}, -->
                                                            {{slot.ClassSlotId}}
                                                            
                                                        </v-card-subtitle>
                                                    </v-card-item>

                                                    <v-card-text>
                                                        <p>{{formattedTime(slot.StartTime)}} - {{slot.Duration}} minutes</p>
                                                        <p>{{slot.CurrentCapacity}}/{{slot.Class.MaximumCapacity}} joined</p>
                                                        <br>
                                                        <div v-if="checkAvailability(slot.StartTime, slot.CurrentCapacity, slot.Class.MaximumCapacity) == 'Available'">
                                                            <v-chip color="green" text-color="white">
                                                                Available
                                                            </v-chip>
                                                        </div>
                                                        <div v-else>
                                                            <v-chip color="red" text-color="white">
                                                                Inavailable
                                                            </v-chip>
                                                        </div>
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
import { ref } from 'vue';
import { format } from 'date-fns';
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
            date: format(new Date(), 'yyyy-MM-dd'),
            classSlots: [],
            masks: ref({
                modelValue: 'YYYY-MM-DD',
            }),
            attributes: ref([{
                // highlight: 'red',
                dot: 'red',
                dates: new Date(),
            }])
        }
    },

    mounted () {
        this.getClassSlotsByDate();
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

        moveToday(){
            this.date = new Date()
        },

        checkAvailability(dateInput, CurrentCapacity, MaximumCapacity){
            const now = new Date();
            const date = new Date(dateInput);
            var status = "Available";
            // Show original start time - string
            console.log(dateInput)
            // Show new start time - new Date
            console.log(date)

            if (dateInput <= now){
                status = "Unavailable"
            }
            if (MaximumCapacity <= CurrentCapacity){
                status = "Unavailable"
            }
            return status
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