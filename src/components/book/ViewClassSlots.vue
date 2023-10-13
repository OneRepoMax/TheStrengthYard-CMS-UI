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
                            <p>There is no class on this day.</p>
                        </v-card-text>
                    </v-card>
                </div>
                <!-- End of V-if -->
                <!-- Start of V-else: Show class slots -->
                <div v-else>
                    <div v-for="slot in this.classSlots" :key="slot.ClassSlotId">
                        <v-card class="mb-3" @click.prevent="showModal(slot)">
                            <v-row>
                                <!-- Show Class Slot Detail -->
                                <v-col cols="10">
                                    <v-card-item>
                                        <v-card-title class="text-wrap">
                                            {{slot.Class.ClassName}}
                                        </v-card-title>
                                        <v-card-subtitle>
                                            {{slot.ClassSlotId}}
                                        </v-card-subtitle>
                                    </v-card-item>

                                    <v-card-text>
                                        <p>
                                            <v-icon icon="mdi-calendar" size="small"/>
                                            {{formattedDate(slot.StartTime)}}
                                        </p>
                                        <p>
                                            <v-icon icon="mdi-clock-outline" size="small"/>
                                            {{formattedTime(slot.StartTime)}} - {{formattedTime(slot.EndTime)}} ({{slot.Duration}} Minutes)
                                        </p>
                                        <p>
                                            <v-icon icon="mdi-account-multiple" size="small"/>
                                            {{slot.CurrentCapacity}}/{{slot.Class.MaximumCapacity}} joined
                                            </p>
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

    <template>
        <Modal 
            v-model="bookingInfo.show" 
            :title="bookingInfo.title" 
            :message="bookingInfo.message"
            :color="bookingInfo.color" 
            :className="bookingInfo.className"
            :classId="bookingInfo.classId"
            :date="bookingInfo.date"
            :time="bookingInfo.time"
            @closeModal="closeModal" 
            @action="actionModal" 
            
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
import Modal from '@/components/book/ConfirmBooking.vue';

export default {
    components: {
        Calendar,
        DatePicker,
        Modal
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
            },
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
                console.error("An error occurred during get class slots API request:", error);
            }
            return
        },

        async createBooking() {
            try {
                
                // Get membership records
                const membershipRecord = await this.membershipStore.getMembershipRecordByUserId(this.userStore.userId);
                var membershipRecordId = 0
                
                // Get membership id when there is only one membership record -- to be worked on again
                if (membershipRecord.data.length == 1){
                    membershipRecordId = membershipRecord.data[0].MembershipRecordId;
                }

                console.log(membershipRecordId)

                const response = await this.bookStore.createBooking(membershipRecordId, this.userStore.userId, this.bookingInfo.classId);

                console.log(response)

                // if (response.status == 200){
                //     console.log("create booking successful")
                // }
                
                return

            } catch (error) {
                console.error("An error occurred during create booking API request:", error);
            }
            
            return
        },
    },
}
</script>
