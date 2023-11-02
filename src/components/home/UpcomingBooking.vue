<template>
    <v-card elevation="3" class="text-start mb-md-3 mb-1 rounded-0-sm">
      <v-card-text class="mb-3">
        <v-card-title>Upcoming Bookings</v-card-title>
        <v-card-subtitle>This is all your upcoming bookings</v-card-subtitle>
        <template v-if="this.BookList.length == 0">
          <v-alert
            type="info"
            :title="`No upcoming bookings`"
            :text="`There's no upcoming bookings.`"
            class="mt-2"
          ></v-alert>
        </template>
    <template v-else>
        <BookList
          :bookList="displayedBooking"
          :bookingType="bookingType"
          @reload-data="this.getBookList()"
        />
      </template>
      </v-card-text>
    </v-card>

</template>


<script>
import BookList from "../book/BookList.vue";
import { useBookStore } from "@/store/book";
import { useUserStore } from "@/store/user";

export default {
  components: {
    BookList,
  },

  setup() {
    const bookStore = useBookStore();
    const userStore = useUserStore();

    return { bookStore, userStore };
  },

  data() {
    return {
      BookList: [],
      dates: [],
      loading: false,
      searchValue: null,
      page: 1,
      pageLength: 1,
      bookPerPage: 10,
    };
  },

  watch: {
    searchValue() {
      this.page = 1;
    },
  },
  computed: {
    displayedBooking() {
      const startIndex = (this.page - 1) * this.bookPerPage;
      const endIndex = startIndex + this.bookPerPage;

      if (this.searchValue != null) {
        const filteredBook = this.BookList.filter((book) =>
          `${book.BookingDateTime}`
            .toLowerCase()
            .includes(this.searchValue.toLowerCase())
        );
        return filteredBook.slice(startIndex, endIndex);
      }
      return this.BookList.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(
        (this.searchValue
          ? this.displayedBooking.length
          : this.BookList.length) / this.bookPerPage
      );
    },
  },
  mounted() {
    this.getBookList();
  },
  methods: {
    async getBookList() {
      try {
        this.loading = true;
        this.clearData();
        const response = await this.bookStore.getAllBookingByUserId(
          this.userStore.userId
        );

        if (response && response.status === 200) {
          this.BookList = response.data;
          for (const book of this.BookList) {
            const date = `${book.BookingDateTime}`;
            if (this.dates.indexOf(date) === -1) {
              this.dates.push(date);
            }
          }
        } else {
          // Handle error or display a message
          console.error("Failed to fetch bookings.");
          // You can display an alert or handle the error in your UI
        }
        this.loading = false;
      } catch (error) {
        console.error(
          "An error occurred during get all class API request:",
          error
        );
      }
    },
    clearData() {
      this.BookList = [];
      this.dates = [];
    },
  },
};
</script>
