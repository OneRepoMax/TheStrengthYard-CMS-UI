<template>
      <v-form>
        <p class="text-left my-5" rules>
          How did you discover The Strength Yard?
        </p>
        <p v-if="validationError" class="error-text text-left text-red">{{ validationError }}</p>
        <v-checkbox
          class="shrink mb-n8"
          v-for="(option, index) in options"
          v-model="selectedOptions"
          :key="index"
          :label="option"
          :value="option"
        ></v-checkbox>

        <!-- Display the text input for 'Others' when it's selected -->
        <v-text-field
          v-if="selectedOptions.includes('Others')"
          v-model="othersText"
          label="Specify 'Others'"
        ></v-text-field>
        <!-- <v-btn @click="validateForm">Submit</v-btn> -->
      </v-form>
</template>

<script>
export default {
  data() {
    return {
      selectedOptions: [],
      othersText: '',
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
    validateForm() {
      if (this.selectedOptions.length === 0) {
        this.validationError = 'Please select at least one option.';
        console.log('Selected Options:', this.selectedOptions);
        console.log(this.selectedOptions.length);
        // console.log('Others Text:', this.othersText);
      } else {
        // Reset validation error if there are selected options
        this.validationError = null;

        // Handle form submission or other actions here
        console.log('Selected Options:', this.selectedOptions);
        console.log('Others Text:', this.othersText);
      }
    }
  },
};
</script>
