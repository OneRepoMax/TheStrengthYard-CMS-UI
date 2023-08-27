<template>
  <v-main>
    <v-container justify="center" class="h-100" align="center">
      <v-col cols="12" md="6">
        <v-stepper hide-actions :items="['Registration', 'Feedback', 'Indemnity', 'Acknowledgement']" v-model="currentStep">
          <template v-slot:item.1>
            <v-form @submit.prevent="nextStep(2)">
              <RegisterForm @validate-step="validateStep(1)"/>
              <!-- <v-btn color="teal" size="large" type="submit" @click="validateStep(1)">Next</v-btn> -->
            </v-form>
          </template>

          <template v-slot:item.2>
            <v-form @submit.prevent="nextStep(3)">
              <FeedbackForm @validate-step="validateStep(2)" @prev-step="prevStep(1)"/>
            <!-- <v-btn variant="outlined" color="teal" size="large" @click="prevStep(1)">Previous</v-btn>
            <v-btn color="teal" size="large" type="submit" @click="validateStep(2)">Next</v-btn> -->
            </v-form>
          </template>

          <template v-slot:item.3>
            <v-form @submit.prevent="nextStep(4)">
              <IndemnityForm @validate-step="validateStep(3)" @prev-step="prevStep(2)"/>
              <!-- <v-btn variant="outlined" color="teal" size="large" @click="prevStep(2)">Previous</v-btn>
              <v-btn color="teal" size="large" type="submit" @click="validateStep(3)">Next</v-btn> -->
            </v-form>
          </template>

          <template v-slot:item.4>
            <v-form  @submit.prevent="submitForm">
              <AcknowledgementForm @validate-step="validateStep(4)" @prev-step="prevStep(3)"/>
              <!-- <v-btn variant="outlined" color="teal" size="large" @click="prevStep(3)">Previous</v-btn>
              <v-btn color="teal" size="large" type="submit" @click="validateStep(4)">Submit</v-btn> -->
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
import AcknowledgementForm from '@/components/AcknowledgementForm.vue'
import { VStepper } from 'vuetify/labs/VStepper';
import { useUserStore } from '@/store/user'
import AcknowledgementFormVue from '@/components/AcknowledgementForm.vue';

const nextStep = (step) => {
  currentStep.value = step;
};

const prevStep = (step) => {
  currentStep.value = step;
};

const validateStep = (step) => {
  console.log(step);
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
      if (validateAcknowledgementForm()) {
        console.log("run submit")
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
  // console.log(userStore.displayPicture)
  // console.log(userStore.firstName)
  // console.log(userStore.lastName)
  // console.log(userStore.gender)
  // console.log(userStore.dateOfBirth)
  // console.log(userStore.emailAddress)
  // console.log(userStore.homeAddress)
  // console.log(userStore.postalCode)
  // console.log(userStore.contactNo)
  // console.log(userStore.password)
  // console.log(userStore.confirmPassword)
  var error = 0;

  if (userStore.displayPicture == null){error++;}
  if (userStore.firstName == null){
    error++;
  } else if (userStore.firstName.length < 2){error++;}
  if (userStore.lastName == null){
    error++;
  } else if (userStore.lastName.length < 2){error++;}
  if (userStore.emailAddress == null){
    error++;
  } else if (/.+@.+\..+/.test(userStore.emailAddress) == false){error++;}
  if (userStore.gender == null){error++;}
  if (userStore.dateOfBirth == null){error++;}
  if (userStore.homeAddress == null){error++;}
  if (userStore.postalCode == null){
    error++;
  } else if (userStore.postalCode.length != 6){error++;}
  else if (/^\d+$/.test(userStore.postalCode) == false){error++;}
  if (userStore.contactNo == null){error++;}
  if (userStore.password == null){
    error++;
  } else if (userStore.password.length < 8){error++;}
  else if (/[a-z]/.test(userStore.password) == false){error++;}
  else if (/[A-Z]/.test(userStore.password) == false){error++;}
  else if (/\d/.test(userStore.password) == false){error++;}
  else if (/[!@#$%^&*]/.test(userStore.password) == false){error++;}
  if (userStore.password != userStore.confirmPassword){error++;}

  // console.log(error)
  if (error == 0){
    return true;
  } else {
    return false;
  }
};

const validateFeedbackForm = () => {
  // Perform validation for the feedback form fields
  // Return true if the form is valid, false otherwise
  // Example: Check if required fields are not empty
  // console.log(userStore.FeedbackDiscover)
  if (userStore.FeedbackDiscover.length != 0) {
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
    return true;
  } else {
    // Show an error message or provide feedback to the user
    return false;
  }
};

const validateAcknowledgementForm = () => {
  // Perform validation for the gym rules form fields
  // Return true if the form is valid, false otherwise
  // Example: Check if a checkbox is checked
  if (userStore.AcknowledgementTnC != false && userStore.AcknowledgementOpenGymRules != false) {
    return true;
  } else {
    // Show an error message or provide feedback to the user
    return false;
  }
};

const transformFeedbackForm = () => {
  if (userStore.FeedbackDiscover != []) {
    for (let i = 0; i <userStore.FeedbackDiscover.length; i++){
        // console.log(userStore.FeedbackDiscover[i])
        if (userStore.FeedbackDiscover[i] == 'Other'){
            userStore.FeedbackDiscover[i] += ": " + userStore.otherFeedbackDiscover
        }
    }
    // console.log(userStore.FeedbackDiscover.join(', '))
    // userStore.FeedbackDiscover = userStore.FeedbackDiscover.join(', ')
  } return userStore.FeedbackDiscover.join(', ');
};

const transformIndemnityForm = () => {
  if (userStore.MedicalHistory.length != 0) {
    for (let i = 0; i <userStore.MedicalHistory.length; i++){
        if (userStore.MedicalHistory[i] == 'Other'){
            userStore.MedicalHistory[i] += ": " + userStore.otherMedicalHistory
        }
    }
    // userStore.MedicalHistory = userStore.MedicalHistory.join(', ');
    
  } return userStore.MedicalHistory.join(', ');
};

async function submitForm () {
    // Handle form submission for the last step
    // console.log(userStore.displayPicture);
    // console.log(userStore.emailAddress);
    // console.log(userStore.firstName);
    // console.log(userStore.lastName);
    // console.log(userStore.gender);
    // console.log(userStore.dateOfBirth);
    // console.log(userStore.homeAddress);
    // console.log(userStore.postalCode);
    // console.log(userStore.password);
    // console.log(userStore.FeedbackDiscover);
    // console.log(userStore.MedicalHistory);
    // console.log(userStore.MedicalRemarks);
    // console.log(userStore.AcknowledgementTnC);
    // console.log(userStore.AcknowledgementOpenGymRules);

    
    try {
    const uploadResponse = await userStore.uploadAvatar(userStore.displayPicture)
    if (uploadResponse.status == 200){
        console.log("success");

        // uri to uploaded avatar
        // console.log(uploadResponse.s3Uri);

        // trigger registration form through this API and put in variables
        // Edit the function below accordingly, e.g. update the parameters, etc
        const registerResponse = await userStore.register(
            userStore.emailAddress,
            userStore.firstName,
            userStore.lastName,
            userStore.gender,
            userStore.dateOfBirth,
            userStore.homeAddress,
            parseInt(userStore.postalCode),
            userStore.contactNo,
            userStore.password,
            uploadResponse.s3Uri,
            transformFeedbackForm(),
            transformIndemnityForm(),
            userStore.MedicalRemarks,
            userStore.AcknowledgementTnC,
            userStore.AcknowledgementOpenGymRules,

        )

            if(registerResponse.status == 200){

                // Show success modal
                // <insert your codes here>

                // redirect to email verification (I put login as temporary measure)
                $router.push({path: '/account/login'})

            } 
    }
    } catch (error){
    console.log("Registration error: ", error);
    }
};

</script>


<style lang="scss" scoped>
/* Add your custom styles here */
</style>

