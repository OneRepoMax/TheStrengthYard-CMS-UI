<template>
      <v-form>
        <p class="text-left my-5" rules>
          How did you discover The Strength Yard?
        </p>
        <p v-if="validationError" class="error-text text-left text-red">{{ validationError }}</p>
        <v-checkbox
          class="shrink mb-n8"
          v-for="(option, index) in options"
          v-model="userStore.FeedbackDiscover"
          :key="index"
          :label="option"
          :value="option"
        ></v-checkbox>

        <!-- Display the text input for 'Others' when it's selected -->
        <v-text-field
          v-if="userStore.FeedbackDiscover.includes('Others')"
          v-model="userStore.otherFeedbackDiscover"
          label="Specify 'Others'"
        ></v-text-field>
        <!-- <v-btn @click="validateForm">Submit</v-btn> -->
      </v-form>
</template>

<script>

import { useUserStore } from '@/store/user'



export default {
    setup() {
      const userStore = useUserStore()

      return {
          userStore
      }
    },
  data() {
    return {
      validationError: '',
      FeedbackDiscover: [],
      otherFeedbackDiscover: '',
      options: [
        "Search Engine",
        "Friend's Recommendation",
        "Walking Pass",
        "Google Maps",
        "Facebook Adverts",
        "Google Adverts",
        "Others"
      ],
    };
  },
  methods: {
    async validateForm() {
      if (userStore.FeedbackDiscover.length === 0) {
        this.validationError = 'Please select at least one option.';
        console.log('Selected Options:', this.FeedbackDiscover);
        console.log(userStore.FeedbackDiscover.length);
        // console.log('Others Text:', this.otherFeedbackDiscover);
      } else {
        // Reset validation error if there are selected options
        this.validationError = null;

        // Handle form submission or other actions here
        console.log('Selected Options:', userStore.FeedbackDiscover);
        console.log('Others Text:', userStore.otherFeedbackDiscover);
      }
    }
  },
};
</script>
