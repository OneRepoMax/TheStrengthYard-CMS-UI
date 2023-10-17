<template>
  <v-list>
    <v-card v-for="book in this.bookList" :key="book.BookingId" :value="book.BookingId" variant="text">
      <v-card-title class="d-flex flex-wrap text-wrap">
        {{ book.ClassSlot.Class.ClassName }} <v-spacer class="d-none d-sm-flex"></v-spacer>
        <div>
          <v-chip prependIcon="mdi-account-multiple" variant="text">
            {{ book.ClassSlot.CurrentCapacity }}/{{ book.ClassSlot.Class.MaximumCapacity }}
          </v-chip>
          <v-chip :color="getColor(book.Status)" :prepend-icon="getIcon(book.Status)">
            {{ book.Status }}
          </v-chip>
        </div>

      </v-card-title>
      <v-card-subtitle class="mt-0 pb-2 text-wrap">
        Booking Id: {{ book.BookingId }} | Class Slot Id: {{ book.ClassSlot.ClassSlotId }}
      </v-card-subtitle>
      <v-card-item class="pt-0">
        <v-icon size="15" class="me-1">mdi-clock-outline</v-icon><b>Class Time: </b>{{
          formattedDate(book.ClassSlot.StartTime) }} - {{ formattedDateShort(book.ClassSlot.EndTime) }}
      </v-card-item>
      <v-card-item class="pt-0">
        <v-icon size="15" class="me-1">mdi-refresh</v-icon><b>Duration: </b> {{ book.ClassSlot.Duration }} minutes
      </v-card-item>
      <v-divider></v-divider>

    </v-card>
  </v-list>
</template>

<script>
import { useBookStore } from "@/store/book";

export default {
  props: {
    bookList: Object,
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
        day: "2-digit",   // Two-digit day
        month: "2-digit", // Two-digit month
        hour: "2-digit",  // Two-digit hour
        minute: "2-digit", // Two-digit minute
        hour12: true,     // Use 12-hour format
      };

      return dateObj.toLocaleString("en-GB", options);
    },
    formattedDateShort(date) {
      const dateObj = new Date(date);

      // Format date to "Monday, mm/dd - hh:mm AM/PM"
      const options = {
        hour: "2-digit",  // Two-digit hour
        minute: "2-digit", // Two-digit minute
        hour12: true,     // Use 12-hour format
      };

      return dateObj.toLocaleString(undefined, options);
    },
    getColor(status) {
      if (status == "Confirmed") {
        return 'primary'
      }
      else if (status == "Cancelled") {
        return 'error'
      }
      else if (status == "Pending") {
        return 'warning'
      }
      else {
        return 'secondary'
      }
    },
    getIcon(status) {
      if (status == "Confirmed") {
        return 'mdi-check'
      }
      else if (status == "Cancelled") {
        return 'mdi-close'
      }
      else if (status == "Pending") {
        return 'mdi-clock'
      }
      else {
        return 'mdi-alert'
      }
    }
  },

  data() {
    return {
      loading: false,
    };
  },
};
</script>
