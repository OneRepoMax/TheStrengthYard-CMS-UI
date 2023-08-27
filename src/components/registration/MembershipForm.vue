<template>
      <v-form>
        <!-- <p class="text-left my-5" rules>
          Please read the following questions carefully and answer each one honestly, checking as appropriate or adding information if necessary. Responses are confidential. Have you ever had any history of the following? (If you have checked to any of the follow conditions, you must consult your doctor prior to exercise)
        </p> -->
        <v-select
          label="Membership or Service Type"
          :items="[
          'Personal Training',
          'Hybrid Training', 
          'Online Coaching', 
          'Progressive Strength Classes Membership', 
          'Gold Class for Seniors', 
          'Open Gym All Access Card Access Membership',
          'Beginner Olympic Weightlifting Course',
          'Barbell Fundamentals',
          'Workshop',
          'Paid Trial',
          'One Off Day Pass',
          'Train With a Friend Day Pass'
          ]"
        ></v-select>
        <p class="text-left my-5">Acknowledgement</p>
        <v-checkbox
          v-model="acknowledge"
          label-class="label"
          hide-details
        >
          <template v-slot:label>
            <span class="text-left">
              By Clicking The Checkbox, I Acknowledge That I Have Read And Accept The Terms And Conditions From This Link:
              <a href="https://www.thestrengthyard.com/terms-conditions-strength-conditioning-gym-singapore/" target="_blank">https://www.thestrengthyard.com/terms-conditions-strength-conditioning-gym-singapore/.</a>
              I Also Acknowledge That I Use The Facility Or Service At My Own Risk And That The Strength Yard Shall Not Be Liable For Any Loss Or Damage To Personal Property Or Death Or Personal Injury, From My Use Of The Facility Or Service.
            </span>
          </template>
        </v-checkbox>
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
        "Low BLood pressure/ High Blood pressure",
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
