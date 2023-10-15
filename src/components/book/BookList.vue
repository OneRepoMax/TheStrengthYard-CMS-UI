<template>
  <v-container>
    <v-expansion-panels class="pa-1" style="min-width: 40vw">
      <v-expansion-panel
        v-for="book in this.bookList"
        :key="book.BookingId"
        :value="book.BookingId"
      >
        <v-expansion-panel-title>
          <v-row align="center" dense>
            <v-col cols="12" md="10">
              <b
                ><p class="lh-lg">{{ book.ClassSlot.StartTime }}</p></b
              >
            </v-col>
            <v-col cols="12" md="2">
              <b
                ><p class="lh-lg">{{ book.Status }}</p></b
              >
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <!-- Skeleton loaders -->
          <template v-if="loading">
            <v-card-text class="px-8">
              <v-skeleton-loader
                type="list-item-three-line"
                :loading="loading"
              ></v-skeleton-loader>
            </v-card-text>
          </template>
            <v-row>
              <!-- Show Class Slot Detail -->
              <v-col cols="12">
                <v-card-item>
                  <v-row class="ma-2 ml-0 justify-space-between">
                    <v-card-title>
                      {{ book.ClassSlot.Day }}
                    </v-card-title>
                    <v-chip prependIcon="mdi-account-multiple">
                        {{ book.ClassSlot.CurrentCapacity}}
                    </v-chip>
                  </v-row>
                  <v-card-subtitle>
                    {{ book.ClassSlot.Duration }} minutes
                  </v-card-subtitle>
                  <v-card-text>
                    <v-row>
                        <p><b>Class Slot ID:</b> {{ book.ClassSlot.ClassSlotId }}</p>
                    </v-row>
                    <v-row>
                        <p><b>Start Time: </b>{{ book.ClassSlot.StartTime }}</p> 
                    </v-row>
                    <v-row>
                        <p><b>End Time:</b> {{ book.ClassSlot.EndTime }}</p> 
                    </v-row>

                  </v-card-text>
                </v-card-item>
              </v-col>
            </v-row>
          <!-- </v-card> -->
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
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

  data() {
    return {
      BookingId: null,
      loading: false,
    };
  },
  methods: {},
};
</script>
