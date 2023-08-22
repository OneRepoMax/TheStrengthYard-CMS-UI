<template>
      <v-form>
        <p class="text-left my-5" rules>
          Please read the following questions carefully and answer each one honestly, checking as appropriate or adding information if necessary. Responses are confidential. Have you ever had any history of the following? (If you have checked to any of the follow conditions, you must consult your doctor prior to exercise)
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

        <p class="text-left my-5" rules>
          If you have checked any of the above, please specify:
        </p>
        <v-text-field v-model="remarks" label="Your answer" required></v-text-field>
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
        "Heart Problems",
        "Pain in Chest when exercising/ not exercising",
        "Low Blood pressure/ High Blood pressure",
        "Any breathing difficulties or asthma",
        "Diabetes",
        "Fainting spells",
        "Joint problems",
        "Epilepsy",
        "Currently on medication",
        "Significant illness/operations",
        "None",
        "Others"
      ],
      remarks: '',
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
