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
            v-if="book.Status !== 'Cancelled'"
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
        <v-icon size="15" class="me-1">mdi-clock-outline</v-icon
        ><b>Class Time: </b>{{ formattedDate(book.ClassSlot.StartTime) }} -
        {{ formattedDateShort(book.ClassSlot.EndTime) }}
      </v-card-item>
      <v-card-item class="pt-0">
        <v-icon size="15" class="me-1">mdi-refresh</v-icon><b>Duration: </b>
        {{ book.ClassSlot.Duration }} minutes
      </v-card-item>
      <v-divider></v-divider>
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
</template>

<script>
import { useBookStore } from "@/store/book";
import Modal from "@/components/book/CancelBookingModal.vue";
// import { format } from 'date-fns';

export default {
  props: {
    bookList: Object,
  },
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
    formattedDate(date) {
      const dateObj = new Date(date);

      // Format date to "Monday, mm/dd - hh:mm AM/PM"
      const options = {
        weekday: "short", // Full weekday name
        day: "2-digit", // Two-digit day
        month: "2-digit", // Two-digit month
        hour12: true, // Use 12-hour format
      };

      return dateObj.toLocaleString("en-GB", options);
    },
    formattedDateShort(date) {
      const dateObj = new Date(date);

      // Format date to "Monday, mm/dd - hh:mm AM/PM"
      const options = {
        hour: "2-digit", // Two-digit hour
        minute: "2-digit", // Two-digit minute
        hour12: true, // Use 12-hour format
      };

      return dateObj.toLocaleString(undefined, options);
    },

    formattedTime(dateInput) {
      const date = new Date(dateInput);
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
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
      )} - ${this.formattedTime(book.ClassSlot.EndTime)} (${
        book.ClassSlot.Duration
      } Minutes)`;
    },
    closeModal() {
      this.bookingInfo.show = false;
      this.bookingInfo.bookingId = "";
      this.bookingInfo.title = "Cancel Booking";
      this.bookingInfo.message =
        "Please note that cancellations are not possible 12-hour prior to the scheduled class slot.";
      this.bookingInfo.timestamp = "";
      this.bookingInfo.color = "black";
      this.bookingInfo.icon = "";
      this.$emit("reload-data");
    },

    actionModal() {
      console.log(this.book);
      this.deleteBooking();
    },

    async deleteBooking() {
      try {
        this.bookingInfo.loading = true;

        //const response = await this.classStore.getClassSlotByDate(this.date);

        const response = await this.bookStore.cancelBooking(
          this.bookingInfo.bookingId
        );

        if (response.status == 200) {
          console.log(response);
          console.log(response.data);
          console.log(response.data.BookingDateTime);
          this.bookingInfo.title = "Booking Cancelled";
          this.bookingInfo.message =
            response.data +
            " A confirmation email will be send to you shortly.";
          this.bookingInfo.color = "green";
          this.bookingInfo.icon = "mdi-calendar-remove";
        }

        this.bookingInfo.loading = false;
        return;
      } catch (error) {
        console.error(
          "An error occurred during get class slots API request:",
          error
        );
      }
      return;
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
        message:
          "Please note that cancellations are not possible 12-hour prior to the scheduled class slot.",
        color: "black",
        className: "",
        classId: "",
        bookingId: "",
        date: "",
        time: "",
        icon: "",
        timestamp: "",
        loading: false,
      },
    };
  },
};
</script>
