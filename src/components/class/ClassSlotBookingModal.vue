<template>
    <v-dialog max-width="600px" @input="$emit('input', $event)">
        <v-card title="Class Booking List">
            <template v-slot:append>
                <v-btn icon="$close" variant="text" @click="this.$emit('closeModal')"></v-btn>
            </template>
            <v-divider></v-divider>
            <v-card-item v-if="this.bookingList.length==0">
                <v-alert type="info">There's no booking made for this class</v-alert>
            </v-card-item>
            <v-card-item v-if="getConfirmedBookingCount > 0">
                <v-card-title class="mb-1"><v-chip prepend-icon="mdi-account-multiple" class="me-2"> <span
                            class="font-weight-medium">{{ getConfirmedBookingCount }}</span></v-chip>Confirmed
                    Attendees</v-card-title>
                <v-card-subtitle class="mb-1">Listed below are the confirmed attendees</v-card-subtitle>
                <template v-for="booking in bookingList" :key="booking.BookingId">
                    <v-list v-if="booking.Status == 'Confirmed'">
                        <div class="d-flex w-100">
                            <v-avatar v-if="booking.User.DisplayPicture" :size="50" :image="booking.User.DisplayPicture"
                                class="me-3"></v-avatar>
                            <v-avatar v-else icon="mdi-account-circle" :size="50" class="me-3"></v-avatar>
                            <div>
                                <div class="text-subtitle-1 font-weight-bold">{{ booking.User.FirstName }} {{
                                    booking.User.LastName }}</div>
                                <div class="text-subtitle-2 mb-2">{{ booking.User.EmailAddress }}</div>
                                <div>
                                    <v-chip v-if="booking.User.Gender == 'M'" prepend-icon="mdi-gender-male" size="small"
                                        class="me-2">{{ formattedGender(booking.User.Gender) }}</v-chip>
                                    <v-chip v-if="booking.User.Gender == 'F'" prepend-icon="mdi-gender-female" size="small"
                                        class="me-2">{{ formattedGender(booking.User.Gender) }}</v-chip>
                                    <v-chip v-if="booking.User.Gender == 'O'" prepend-icon="mdi-gender-non-binary"
                                        size="small" class="me-2">{{ formattedGender(booking.User.Gender) }}</v-chip>
                                    <v-chip prepend-icon="mdi-phone" @click.prevent="phoneCall(booking.User.ContactNo)"
                                        size="small">{{
                                            booking.User.ContactNo
                                        }}</v-chip>
                                </div>

                            </div>
                            <v-spacer></v-spacer>
                            <v-chip color="primary"><v-icon start icon="mdi-check"></v-icon>Booking Id: {{ booking.BookingId
                            }}</v-chip>
                        </div>
                        <v-divider class="mt-4"></v-divider>
                    </v-list>
                </template>




            </v-card-item>
            <v-card-item v-if="getCancelledBookingCount > 0">
                <v-card-title class="mb-1"><v-chip prepend-icon="mdi-account-cancel" class="me-2" color="red">
                        <span class="font-weight-medium">{{ getCancelledBookingCount }}</span></v-chip>Cancelled
                    Attendees</v-card-title>
                <v-card-subtitle class="mb-1">Listed below are the cancelled attendees</v-card-subtitle>
                <template v-for="booking in bookingList" :key="booking.BookingId">
                    <v-list v-if="booking.Status == 'Cancelled'">
                        <div class="d-flex w-100">
                            <v-avatar v-if="booking.User.DisplayPicture" :size="50" :image="booking.User.DisplayPicture"
                                class="me-3"></v-avatar>
                            <v-avatar v-else icon="mdi-account-circle" :size="50" class="me-3"></v-avatar>
                            <div>
                                <div class="text-subtitle-1 font-weight-bold">{{ booking.User.FirstName }} {{
                                    booking.User.LastName }}</div>
                                <div class="text-subtitle-2 mb-2">{{ booking.User.EmailAddress }}</div>
                                <div>
                                    <v-chip v-if="booking.User.Gender == 'M'" prepend-icon="mdi-gender-male" size="small"
                                        class="me-2">{{ formattedGender(booking.User.Gender) }}</v-chip>
                                    <v-chip v-if="booking.User.Gender == 'F'" prepend-icon="mdi-gender-female" size="small"
                                        class="me-2">{{ formattedGender(booking.User.Gender) }}</v-chip>
                                    <v-chip v-if="booking.User.Gender == 'O'" prepend-icon="mdi-gender-non-binary"
                                        size="small" class="me-2">{{ formattedGender(booking.User.Gender) }}</v-chip>
                                    <v-chip prepend-icon="mdi-phone" @click.prevent="phoneCall(booking.User.ContactNo)"
                                        size="small">{{
                                            booking.User.ContactNo
                                        }}</v-chip>
                                </div>
                            </div>
                            <v-spacer></v-spacer>
                            <v-chip color="red">Booking Id: {{ booking.BookingId }}</v-chip>

                        </div>
                        <v-divider class="mt-4"></v-divider>
                    </v-list>
                </template>
            </v-card-item>
            <v-card-text>
                <v-btn block color="teal" class="mb-5" @click="closeModal(path)">Close</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
    
<script>
import { useClassStore } from '@/store/class'

export default {
    props: {
        classSlotId: Number
    },
    setup() {
        const classStore = useClassStore()

        return { classStore }
    },
    data() {
        return {
            bookingList: []
        }
    },
    async mounted() {
        await this.getAllBookingByClassSlotId()
    },
    methods: {
        async getAllBookingByClassSlotId() {
            const response = await this.classStore.getAllBookingByClassSlotId(this.classSlotId);
            if (response.status == 200) {
                this.bookingList = response.data
            }
        },
        closeModal() {
            this.$emit('closeModal')
        },
        phoneCall(contactNo) {
            window.open(`tel:${contactNo}`)
        },
        formattedGender(gender) {
            if (gender == 'M') {
                return 'Male'
            } else if (gender == 'F') {
                return 'Female'
            } else {
                return 'Other'
            }
        },
    },
    computed: {
        getConfirmedBookingCount() {
            if (this.bookingList == null || this.bookingList.length == 0) return 0
            return this.bookingList.filter(booking => booking.Status == 'Confirmed').length
        },
        getCancelledBookingCount() {
            if (this.bookingList == null || this.bookingList.length == 0) return 0
            return this.bookingList.filter(booking => booking.Status == 'Cancelled').length
        },

    }
}
</script>
