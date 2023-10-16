<template>
  <v-container :style="{ 'max-width': '1200px' }" class="mx-auto">
    <v-card>
      <v-img src="@/assets/BookingBanner.jpg" max-height="250px" cover></v-img>
      <v-tabs v-model="tab" bg-color="black">
        <v-tab value="book-class">Book Class</v-tab>
        <v-tab value="confirm-class">My Bookings</v-tab>
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
              <ViewClassSlots />
            </div>
          </v-window-item>
          <v-window-item value="confirm-class">
            <div class="pa-5">
              <BookList :bookList="displayedBooking" />
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
import { useUserStore } from '@/store/user'
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
    const userStore = useUserStore()


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
        const response = await this.bookStore.getAllBookingByUserId(this.userStore.userId);
        this.loading = false;
        if (response == null || response.status != 200) {
          return;
        } else {
          if (response.status == 200) {
            this.BookList = response.data;
            console.log(this.BookList);
            for (const book of this.BookList) {
              const date = `${book.BookingDateTime}`;
              if (this.dates.indexOf(date) === -1) {
                this.dates.push(date);
              }
            }
          }
        }

        return;
      } catch (error) {
        console.error(
          "An error occurred during get all class API request:",
          error
        );
      }

      return;
    },
  },
};
</script>
