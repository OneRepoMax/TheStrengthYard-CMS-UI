<template>
      <v-form @submit.prevent="indemnity">
        <p class="text-left my-5" rules>
          Please read the following questions carefully and answer each one honestly, checking as appropriate or adding information if necessary. Responses are confidential. Have you ever had any history of the following? (If you have checked to any of the follow conditions, you must consult your doctor prior to exercise)
        </p>
        <p v-if="validationError" class="error-text text-left text-red">{{ validationError }}</p>
        <v-checkbox
          class="shrink mb-n8 text-left"
          v-for="(option, index) in options"
          v-model="userStore.MedicalHistory"
          :key="index"
          :label="option"
          :value="option"
        ></v-checkbox>

        <!-- Display the text input for 'Others' when it's selected -->
        <v-text-field
          v-if="userStore.MedicalHistory.includes('Other')"
          v-model="userStore.otherMedicalHistory"
          label="Specify 'Other'"
        ></v-text-field>

        <p class="text-left my-5" rules>
          If you have checked any of the above, please specify:
        </p>
        <v-text-field v-model="userStore.MedicalRemarks" label="Your answer" required></v-text-field>
        <v-row>
            <v-col cols="12" md="6" align="center" class="pt-0" order="last" order-md="first">
                <v-btn block @click="prev" variant="outlined" color="teal" size="large" class="mt-3">Previous</v-btn>
            </v-col>
            <v-col cols="12" md="6" align="center" class="pt-0" >
                <v-btn block @click="indemnity" color="teal" size="large" type="submit" class="mt-3">Next</v-btn>
            </v-col>
        </v-row>
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
        "Other"
      ],
    };
  },
  methods: {
    indemnity(){
      // console.log("run validate step");
      this.$emit('validate-step');
      this.validateForm();
    },

    prev(){
      this.$emit('prev-step');
    },

    validateForm() {
      if (this.userStore.MedicalHistory.length == 0) {
        this.validationError = 'Please select at least one option.';
        // console.log('Selected Options:', userStore.MedicalHistory);
        // console.log(userStore.MedicalHistory.length);
        // console.log('Others Text:', this.userStore.otherMedicalHistory);
      } else {
        // Reset validation error if there are selected options
        this.validationError = null;

        // Handle form submission or other actions here
        // console.log('Selected Options:', userStore.MedicalHistory);
        // console.log('Others Text:', userStore.otherMedicalHistory);
      }
    }
  },
  emits: ['validate-step']
};
</script>
