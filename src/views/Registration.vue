<template>
  <v-main>
    <v-container justify="center" class="h-100" align="center">
      <v-col cols="12" md="6">
        <v-stepper hide-actions :items="['Registration', 'Feedback', 'Indemnity', 'Acknowledgement']" v-model="currentStep">
          <template v-slot:item.1>
            <v-form @submit.prevent="nextStep(2)">
              <RegisterForm ref="registrationForm"/>
              <v-btn color="teal" size="large" type="submit" @click="validateStep(1)">Next</v-btn>
            </v-form>
          </template>

          <template v-slot:item.2>
            <v-form @submit.prevent="nextStep(3)">
              <FeedbackForm ref="feedbackForm"/>
            <v-btn variant="outlined" color="teal" size="large" @click="prevStep(1)">Previous</v-btn>
            <v-btn color="teal" size="large" type="submit" @click="validateStep(2)">Next</v-btn>
            </v-form>
          </template>

          <template v-slot:item.3>
            <v-form ref="indemnityForm" @submit.prevent="nextStep(4)">
              <IndemnityForm />
              <v-btn variant="outlined" color="teal" size="large" @click="prevStep(2)">Previous</v-btn>
            <v-btn color="teal" size="large" type="submit" @click="validateStep(3)">Next</v-btn>
            </v-form>
          </template>

          <template v-slot:item.4>
            <v-form ref="gymRulesForm" @submit.prevent="submitForm">
              <GymRulesForm />
              <v-btn variant="outlined" color="teal" size="large" @click="prevStep(3)">Previous</v-btn>
              <v-btn color="teal" size="large" type="submit" @click="validateStep(4)">Submit</v-btn>
            </v-form>
          </template>
        </v-stepper>
      </v-col>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref } from 'vue';

const currentStep = ref(1);
const userStore = useUserStore()

import RegisterForm from '@/components/RegisterForm.vue';
import FeedbackForm from '@/components/FeedbackForm.vue';
import IndemnityForm from '@/components/IndemnityForm.vue';
import GymRulesForm from '@/components/GymRulesForm.vue';
import { VStepper } from 'vuetify/labs/VStepper';
import { useUserStore } from '@/store/user'

const nextStep = (step) => {
  currentStep.value = step;
};

const prevStep = (step) => {
  currentStep.value = step;
};

const validateStep = (step) => {
  switch (step) {
    case 1:
      if (validateRegistrationForm()) {
        nextStep(2);
      }
      break;
    case 2:
      if (validateFeedbackForm()) {
        nextStep(3);
      }
      break;
    case 3:
      if (validateIndemnityForm()) {
        nextStep(4);
      }
      break;
    case 4:
      if (validateGymRulesForm()) {
        submitForm();
      }
      break;
    default:
      break;
  }
};

const validateRegistrationForm = () => {
  // Perform validation for the registration form fields
  // Return true if the form is valid, false otherwise
  // Example: Check if required fields are not empty
  if (userStore.firstName &&
    userStore.lastName &&
    userStore.gender &&
    userStore.dateOfBirth &&
    userStore.emailAddress &&
    userStore.homeAddress &&
    userStore.postalCode &&
    userStore.contactNo
  ) {
    return true;
  } else {
    // Show an error message or provide feedback to the user
    return false;
  }
};

const validateFeedbackForm = () => {
  // Perform validation for the feedback form fields
  // Return true if the form is valid, false otherwise
  // Example: Check if required fields are not empty
  if (userStore.FeedbackDiscover.length != 0) {
    for (let i = 0; i <userStore.FeedbackDiscover.length; i++){
        // console.log(userStore.FeedbackDiscover[i])
        if (userStore.FeedbackDiscover[i] == 'Others'){
            userStore.FeedbackDiscover[i] = userStore.otherFeedbackDiscover
        }
    }
    // console.log(userStore.FeedbackDiscover.join(', '))
    userStore.FeedbackDiscover = userStore.FeedbackDiscover.join(', ')
    return true;
  } else {
    // Show an error message or provide feedback to the user
    return false;
  }
};

const validateIndemnityForm = () => {
  // Perform validation for the indemnity form fields
  // Return true if the form is valid, false otherwise
  // Example: Check if required fields are filled, and a checkbox is checked
  if (userStore.MedicalHistory.length != 0) {
    for (let i = 0; i <userStore.MedicalHistory.length; i++){
        if (userStore.MedicalHistory[i] == 'Others'){
            userStore.MedicalHistory[i] = userStore.otherMedicalHistory
        }
    }
    userStore.MedicalHistory = userStore.MedicalHistory.join(', ')
    return true;
  } else {
    // Show an error message or provide feedback to the user
    return false;
  }
};

const validateGymRulesForm = () => {
  // Perform validation for the gym rules form fields
  // Return true if the form is valid, false otherwise
  // Example: Check if a checkbox is checked
  if (userStore.AcknowledgementOpenGymRules) {
    return true;
  } else {
    // Show an error message or provide feedback to the user
    return false;
  }
};

async function submitForm () {
    // Handle form submission for the last step
    console.log(userStore.displayPicture);
    console.log(userStore.FeedbackDiscover);
    console.log(userStore.MedicalHistory);
    try {
    const uploadResponse = await userStore.uploadAvatar(userStore.displayPicture)
    if (uploadResponse.status == 200){
        console.log("success");

        // uri to uploaded avatar
        console.log(uploadResponse.s3Uri);

        // trigger registration form through this API and put in variables
        // Edit the function below accordingly, e.g. update the parameters, etc
        const registerResponse = await userStore.register(
            userStore.firstName,
            userStore.lastName,
            userStore.gender,
            userStore.dateOfBirth,
            userStore.emailAddress,
            userStore.homeAddress,
            userStore.postalCode,
            userStore.contactNo,
            userStore.password,
            userStore.FeedbackDiscover,
            userStore.MedicalHistory,
            userStore.MedicalRemarks,
            userStore.AcknowledgementTnC,
            userStore.AcknowledgementOpenGymRules,

            uploadResponse.s3Uri
        )

            if(registerResponse.status == 200){

                // Show success modal
                // <insert your codes here>

                // redirect to email verification (I put login as temporary measure)
                this.$router.push({path: '/account/login'})

            } 
    }
    } catch (error){
    console.log("Registration error: ", error);
    }
};

</script>

<script>


export default {
    methods: {
        //         first(){
            // this.$refs.registrationForm.register();
            
        // },
        // second(){
        //     this.$refs.FeedbackForm.validateForm()
        // }
    }
}
</script>


<style lang="scss" scoped>
/* Add your custom styles here */
</style>

