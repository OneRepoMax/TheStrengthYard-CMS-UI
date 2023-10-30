<template>
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
                            <p>{{ this.classMessage }}</p>
                        </v-card-text>
                    </v-card>
                </div>
                <!-- End of V-if -->
                <!-- Start of V-else: Show class slots -->
                <div v-else>
                    <div v-for="slot in this.classSlots" :key="slot.ClassSlotId">
                        <v-card class="mb-3" @click.prevent="showModal(slot.ClassSlot)">
                            <v-row>
                                <!-- Show Class Slot Detail -->
                                <v-col cols="10">
                                    <v-card-item>
                                        <v-card-title class="text-wrap">
                                            {{slot.ClassSlot.Class.ClassName}}
                                        </v-card-title>
                                        <v-card-subtitle>
                                            {{slot.ClassSlot.ClassSlotId}}
                                        </v-card-subtitle>
                                    </v-card-item>

                                    <v-card-text>
                                        <p>
                                            <v-icon icon="mdi-calendar" size="small"/>
                                            {{formattedDate(slot.ClassSlot.StartTime)}}
                                        </p>
                                        <p>
                                            <v-icon icon="mdi-clock-outline" size="small"/>
                                            {{formattedTime(slot.ClassSlot.StartTime)}} - {{formattedTime(slot.ClassSlot.EndTime)}} ({{slot.ClassSlot.Duration}} Minutes)
                                        </p>
                                        <p>
                                            <v-icon icon="mdi-account-multiple" size="small"/>
                                            {{slot.ClassSlot.CurrentCapacity}}/{{slot.ClassSlot.Class.MaximumCapacity}} joined
                                            </p>
                                    </v-card-text>
                                </v-col>

                                <!-- Book icon -->
                                <v-col cols="2" align-self="center">
                                    <v-btn  variant="text" icon="mdi-calendar-plus" size="large"></v-btn>
                                </v-col>
                            </v-row>

                            <v-card-item>
                                <div v-if="slot.Status == 'Available'">
                                    <v-chip color="green" text-color="white">
                                        {{slot.Status}}
                                    </v-chip>
                                </div>
                                <div v-else>
                                    <v-chip color="red" text-color="white">
                                        {{slot.Status}}
                                    </v-chip>
                                    <p class="text-red mt-3">{{slot.Message}}.</p>
                                </div>
                            </v-card-item>
                            
                        </v-card>
                    </div>
                </div>
                <!-- End of V-Else -->

            </v-col>
        
        </v-row>
    </div>

    <template>
        <Modal 
            v-model="bookingInfo.show" 
            :title="bookingInfo.title" 
            :message="bookingInfo.message"
            :timestamp="bookingInfo.timestamp"
            :color="bookingInfo.color" 
            :className="bookingInfo.className"
            :classId="bookingInfo.classId"
            :date="bookingInfo.date"
            :time="bookingInfo.time"
            :icon="bookingInfo.icon"
            @closeModal="closeModal" 
            @actionModal="actionModal" 
            :loading="bookingInfo.loading"
            
        />
    </template>
</template>

<script>
import { ref } from 'vue';
import { format } from 'date-fns';
import { Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { useUserStore } from '@/store/user'
import { useClassStore } from '@/store/class'
import { useMembershipStore } from '@/store/membership'
import { useBookStore } from '@/store/book'
import Modal from '@/components/book/ConfirmBookingModal.vue';

export default {
    components: {
        Calendar,
        DatePicker,
        Modal
    },

    props: {
        reload: Boolean,
    },

    setup () {
        const classStore = useClassStore();
        const userStore = useUserStore();
        const membershipStore = useMembershipStore();
        const bookStore = useBookStore();
        return { classStore, userStore, membershipStore, bookStore }
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
            }]),
            bookingInfo: {
                show: false,
                title: "Confirm booking",
                message: "Please note that cancellations are not possible 12-hour prior to the scheduled class slot.",
                color: "black",
                className: "",
                classId: "",
                date: "",
                time: "",
                icon: "",
                bookingId: "",
                timestamp: "",
                loading: false,
            },
            classMessage: "",
        }
    },

    mounted () {
        this.getClassSlotsByDate();
    },

    watch: {
        date(){
            console.log(this.date)
            this.getClassSlotsByDate();
        },
        reload(){
            if (this.reload == true){
                this.getClassSlotsByDate();
            }
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

            if (dateInput <= now){
                status = "Unavailable"
            }
            if (MaximumCapacity <= CurrentCapacity){
                status = "Unavailable"
            }
            return status
        },

        showModal(slot) {
            this.bookingInfo.show = true;
            this.bookingInfo.className = `${slot.Class.ClassName}`;
            this.bookingInfo.classId = `${slot.ClassSlotId}`;
            this.bookingInfo.date = `${this.formattedDate(slot.StartTime)}`;
            this.bookingInfo.time = `${this.formattedTime(slot.StartTime)} - ${this.formattedTime(slot.EndTime)} (${slot.Duration} Minutes)`;
        },

        closeModal() {
            this.bookingInfo.show = false;
            this.getClassSlotsByDate();
            this.bookingInfo.bookingId = "";
            this.bookingInfo.title = "Confirm booking";
            this.bookingInfo.message = "Please note that cancellations are not possible 12-hour prior to the scheduled class slot.";
            this.bookingInfo.timestamp = "";
            this.bookingInfo.color = "black";
            this.bookingInfo.icon = "";
        },

        actionModal() {
            console.log(this.bookingInfo.classId);
            console.log(this.userStore.userId);
            this.createBooking();
        },

        async getClassSlotsByDate() {
            try {
                this.loading = true;

                console.log(this.date)
                const response = await this.classStore.getClassSlotByDateAndUserID(this.date, this.userStore.userId);

                this.loading = false;
                if (response == null) {
                    this.classSlots = []
                    this.classMessage = `There are no class slots on this date.`;
                    return
                } else {
                    if (response.status == 200) {
                        this.classSlots = response.data
                    } 
                    else if (response.status == 404){
                        this.classSlots = []
                        this.classMessage = `There are no class slots on this date.`;
                    } else {
                        console.log(response.data)
                        this.classSlots = []
                        this.classMessage = `${response.data}.`;
                    }
                }
                return

            } catch (error) {
                console.error("An error occurred during get class slots API request:", error);
            }
            return
        },

        async createBooking() {
            try {
                
                this.bookingInfo.loading = true;

                const response = await this.bookStore.createBooking(this.userStore.userId, this.bookingInfo.classId);

                console.log(response)

                if (response == null){
                    console.log("create booking unsuccessful")
                    // Update modal to successful
                    this.bookingInfo.title = "Booking Unsuccessful";
                    this.bookingInfo.message = `Something went wrong when you are trying to book.`;
                    this.bookingInfo.color = "red";
                    this.bookingInfo.icon = "mdi-alert-circle";
                } else {
                    if (response.status == 201){
                        console.log("create booking successful")
                        // Update modal to successful
                        this.bookingInfo.bookingId = response.data.BookingId;
                        this.bookingInfo.title = "Booking Successful";
                        this.bookingInfo.message = "A confirmation email will be send to you shortly.";
                        this.bookingInfo.timestamp = `Timestamp: ${response.data.BookingDateTime}`;
                        this.bookingInfo.color = "green";
                        this.bookingInfo.icon = "mdi-calendar-check";
                        console.log(response.data.BookingDateTime)
                    } else {
                        console.log("create booking unsuccessful")
                        // Update modal to successful
                        this.bookingInfo.title = "Booking Unsuccessful";
                        this.bookingInfo.message = `${response.response.data}.`;
                        this.bookingInfo.color = "red";
                        this.bookingInfo.icon = "mdi-alert-circle";
                    }
                }

                this.bookingInfo.loading = false;

                return

            } 
            catch (error) {
                console.error("An error occurred during create booking API request:", error);
            }
            
            return
        },
    },
}
</script>
