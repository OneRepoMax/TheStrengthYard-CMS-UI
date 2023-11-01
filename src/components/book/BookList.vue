<template>
  <v-list>
    <v-card
      v-for="book in this.bookList"
      :key="book.BookingId"
      :value="book.BookingId"
      variant="text"
    >
      <v-card-title class="d-flex flex-wrap text-wrap">
        {{ book.ClassSlot.Class.ClassName }}
        <v-spacer class="d-none d-sm-flex"></v-spacer>
        <div>
          <v-chip prependIcon="mdi-account-multiple" variant="text">
            {{ book.ClassSlot.CurrentCapacity }}/{{
              book.ClassSlot.Class.MaximumCapacity
            }}
          </v-chip>
          <v-chip
            :color="getColor(book.Status)"
            :prepend-icon="getIcon(book.Status)"
          >
            {{ book.Status }}
          </v-chip>
          <v-chip
            class="mx-1"
            prepend-icon="mdi-cancel"
            @click.prevent="showModal(book)"
            v-if="bookingType !== 'past' && book.Status !== 'Cancelled'"
          >
            Cancel Booking
          </v-chip>
        </div>
      </v-card-title>
      <v-card-subtitle class="mt-0 pb-2 text-wrap">
        Booking Id: {{ book.BookingId }} | Class Slot Id:
        {{ book.ClassSlot.ClassSlotId }}
      </v-card-subtitle>

      <v-card-item class="pt-0">
        <v-icon size="15" class="me-1">mdi-calendar</v-icon><b>Class Date: </b>
        {{ formattedDate(book.ClassSlot.StartTime) }}
      </v-card-item>
      <v-card-item class="pt-0">
        <v-icon size="15" class="me-1">mdi-clock-outline</v-icon>
        <b>Class Time: </b> {{ formattedTime(book.ClassSlot.StartTime) }} -
        {{ formattedTime(book.ClassSlot.EndTime) }}
      </v-card-item>
      <v-card-item class="pt-0">
        <v-icon size="15" class="me-1">mdi-refresh</v-icon><b>Duration: </b>
        {{ book.ClassSlot.Duration }} minutes
      </v-card-item>
    </v-card>
  </v-list>

  <template>
    <Modal
      v-model="bookingInfo.show"
      :title="bookingInfo.title"
      :message="bookingInfo.message"
      :timestamp="bookingInfo.timestamp"
      :color="bookingInfo.color"
      :className="bookingInfo.className"
      :classId="bookingInfo.classId"
      :bookingId="bookingInfo.bookingId"
      :date="bookingInfo.date"
      :time="bookingInfo.time"
      :icon="bookingInfo.icon"
      @closeModal="closeModal"
      @actionModal="actionModal"
      :loading="bookingInfo.loading"
    />
  </template>
  <!-- @onReloadData="reloadData" -->

</template>

<script>
import { useBookStore } from "@/store/book";
import Modal from "@/components/book/CancelBookingModal.vue";
// import { format } from 'date-fns';

export default {
    props: {
        bookList: Object,
        bookingType: String,
    },
    emits: ['onReloadData'],
    components: {
        Modal,
    },
    setup() {
        const bookStore = useBookStore();

        return {
            bookStore,
        };
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
        formattedDateShort(date) {
            const dateObj = new Date(date);

            const hours = dateObj.getUTCHours();
            const minutes = dateObj.getUTCMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';

            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;

            return formattedTime;
        },
        formattedTime(dateInput) {
            const date = new Date(dateInput);
            const hours = String(date.getUTCHours()).padStart(2, '0');
            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        },

        getColor(status) {
            if (status == "Confirmed") {
                return "primary";
            } else if (status == "Cancelled") {
                return "error";
            } else if (status == "Pending") {
                return "warning";
            } else {
                return "secondary";
            }
        },
        getIcon(status) {
            if (status == "Confirmed") {
                return "mdi-check";
            } else if (status == "Cancelled") {
                return "mdi-close";
            } else if (status == "Pending") {
                return "mdi-clock";
            } else {
                return "mdi-alert";
            }
        },
        showModal(book) {
            this.bookingInfo.show = true;
            this.bookingInfo.className = `${book.ClassSlot.Class.ClassName}`;
            this.bookingInfo.classId = `${book.ClassSlotId}`;
            this.bookingInfo.bookingId = `${book.BookingId}`;
            this.bookingInfo.date = `${this.formattedDate(book.ClassSlot.StartTime)}`;
            this.bookingInfo.time = `${this.formattedTime(
                book.ClassSlot.StartTime
            )} - ${this.formattedTime(book.ClassSlot.EndTime)} (${book.ClassSlot.Duration
                } Minutes)`;
            this.bookingInfo.message = this.getMessage(book);
        },
        closeModal() {
            this.bookingInfo.show = false;
            this.$emit("reload-data");
        },

        actionModal() {
            // console.log();
            this.deleteBooking();
        },
        reloadData() {
            this.getBookList();
    },

        async deleteBooking() {
            try {
                this.bookingInfo.loading = true;


                //const response = await this.classStore.getClassSlotByDate(this.date);

                const response = await this.bookStore.cancelBooking(
                    this.bookingInfo.bookingId
                );

                if (response.status == 200) {
                    this.bookingInfo.title = "Booking Cancelled";
                    this.bookingInfo.message =
                        response.data +
                        " A confirmation email will be send to you shortly.";
                    this.bookingInfo.color = "green";
                    this.bookingInfo.icon = "mdi-calendar-remove";
                }
                this.bookingInfo.loading = false;

                // return;

            } catch (error) {
                console.error(
                    "An error occurred during get class slots API request:",
                    error
                );
            }

            // return;
        },
        getMessage(book) {
            // Calculate 12 hours from book.ClassSlot.StartTime
            console.log('this is the class slot start time', book.ClassSlot.StartTime)

            let twelveHours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
            twelveHours = twelveHours + 28800000 // adjusted for 8 hrs difference

            const startTime = new Date(book.ClassSlot.StartTime).getTime();
            const currentTime = new Date().getTime();

            if ((startTime - currentTime) < twelveHours) {
                return "Scheduled class is less than 12 hours away. No points will be refunded. Are you sure to cancel this booking?";
            } else {
                return "Are you sure you want to cancel this booking?";
            }

        },
    },
    data() {
        return {
            loading: false,
            page: 1,
            pageLength: 1,
            BookPerPage: 10,
            bookingInfo: {
                show: false,
                title: "Cancel booking",
                message: "",
                color: "red",
                className: "",
                classId: "",
                bookingId: "",
                date: "",
                time: "",
                icon: "mdi-alert-circle",
                timestamp: "",
                loading: false,
            },
        };
    },
};
</script>
