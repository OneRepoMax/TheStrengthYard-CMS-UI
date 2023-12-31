<template>
  <v-container :style="{ 'max-width': '1200px' }" class="mx-auto">
    <v-card>
      <v-img src="@/assets/BookingBanner.jpg" max-height="250px" cover></v-img>
      <v-tabs v-model="tab" bg-color="black">
        <v-tab value="book-class">Book Class</v-tab>
        <v-tab value="upcoming" @click="setBookingType('upcoming')">Upcoming Bookings</v-tab>
        <v-tab value="past" @click="setBookingType('past')">Past Bookings</v-tab>
        <v-tab value="cancelled" @click="setBookingType('cancelled')">Cancelled Bookings</v-tab>      
    </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="book-class">
            <div class="pa-5">
              <v-card-title>Book A Class</v-card-title>
              <v-card-text>
                Here’s Our Gym Classes For Those Who Enjoy The Camaraderie Of
                Training In A Group While Getting Functionally Stronger!
              </v-card-text>
              <v-divider />
              <ViewClassSlots :reload="this.viewslots" />
            </div>
          </v-window-item>
          <v-window-item v-bind:value="bookingType">
            <div class="pa-md-5">
              <template v-if="BookList.length == 0">
                <v-alert
                  type="info"
                  :title="`No ${bookingType} bookings`"
                  :text="`There's no ${bookingType} bookings.`"
                ></v-alert>
              </template>
              <template v-else>
                <v-card-title>{{cardTitle}}</v-card-title>
                <v-card-subtitle
                  >{{cardSubtitle}}</v-card-subtitle
                >
                <BookList
                  :bookList="displayedBooking"
                  :bookingType="bookingType"
                  @reload-data="this.getBookList()"
                />
                <v-divider></v-divider>
                <v-card-text class="px-8">
                  <v-row>
                    <v-col
                      cols="12"
                      sm="2"
                      class="d-flex justify-end align-center"
                    >
                      <v-select
                        label="Results per page:"
                        :items="[10, 50, 100]"
                        v-model="bookPerPage"
                        variant="outlined"
                        max-width="40px"
                        density="compact"
                        hide-details="auto"
                      ></v-select>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col class="d-flex justify-end align-center">
                      <v-pagination
                        v-model="page"
                        :length="totalPages"
                      ></v-pagination>
                    </v-col>
                  </v-row>
                </v-card-text>
              </template>
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import "v-calendar/style.css";
import { useClassStore } from "@/store/class";
import { useBookStore } from "@/store/book";
import { useUserStore } from "@/store/user";
import BookList from "@/components/book/BookList.vue";
import ViewClassSlots from "@/components/book/ViewClassSlots.vue";

export default {
  components: {
    BookList,
    ViewClassSlots,
  },

  setup() {
    const classStore = useClassStore();
    const bookStore = useBookStore();
    const userStore = useUserStore();

    return { classStore, bookStore, userStore };
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
      tab: null,
      viewslots: true,
      bookingType: "", // Default to 'upcoming' bookings
    };
  },

  watch: {
    searchValue() {
      this.page = 1;
    },
    tab() {
      if (this.tab == "upcoming" || this.tab == "past" || this.tab == "cancelled") {
        this.viewslots = false;
        this.getBookList();
      } else {
        this.viewslots = true;
      }
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

    cardTitle() {
      if (this.bookingType === "upcoming") {
        return "My Upcoming Bookings";
      } else if (this.bookingType === "past") {
        return "My Past Bookings";
      } else if (this.bookingType === "cancelled") {
        return "My Cancelled Bookings";
      } else {
        return "My Bookings";
      }
    },
    cardSubtitle() {
      if (this.bookingType === "upcoming") {
        return "All upcoming bookings under your account";
      } else if (this.bookingType === "past") {
        return "All past bookings under your account";
      } else if (this.bookingType === "cancelled") {
        return "All cancelled bookings under your account";
      } else {
        return "All bookings under your account";
      }
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
        let response;
        console.log('this is the booking type', this.bookingType)
        if (this.bookingType === "upcoming") {
          response = await this.bookStore.getAllBookingByUserId(
            this.userStore.userId
          );
        } else if (this.bookingType === "past") {
          response = await this.bookStore.getAllPastBooking(
            this.userStore.userId
            
          );
          console.log(response)
          
        } else if (this.bookingType === "cancelled") {
          response = await this.bookStore.getAllCancelledBooking(
            this.userStore.userId
          );
        }
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

    //   return;
    },
    clearData() {
      this.BookList = [];
      this.dates = [];
    },
    setBookingType(type) {
        this.bookingType = type;
  },
  },
};
</script>
