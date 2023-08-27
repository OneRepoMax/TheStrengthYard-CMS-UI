<template>
    <v-main>
        <v-container justify="center" class="h-100" align="center">
            <v-stepper hide-actions :items="['Registration', 'Feedback', 'Indemnity', 'Acknowledgement']"
                v-model="currentStep" max-width="800px">
                <template v-slot:item.1>
                    <v-form @submit.prevent="nextStep(2)">
                        <RegisterForm @validate-step="validateStep(1)" />
                    </v-form>
                </template>

                <template v-slot:item.2>
                    <v-form @submit.prevent="nextStep(3)">
                        <FeedbackForm @validate-step="validateStep(2)" @prev-step="prevStep(1)" />
                    </v-form>
                </template>

                <template v-slot:item.3>
                    <v-form @submit.prevent="nextStep(4)">
                        <IndemnityForm @validate-step="validateStep(3)" @prev-step="prevStep(2)" />
                    </v-form>
                </template>

                <template v-slot:item.4>
                    <v-form>
                        <AcknowledgementForm @validate-step="validateStep(4)" @prev-step="prevStep(3)"
                            :loading="state.loading" />
                    </v-form>
                </template>
                <v-card class="px-5 py-0" v-if="state.error > 0" align="start">
                    <v-card-text>
                        <v-alert type="error" title="Oops, please check your details"
                            text="Please verify your registration details." closable>
                        </v-alert>
                    </v-card-text>

                </v-card>
                <template>
                    <Modal v-model="state.modal.show" :path="state.modal.path" :title="state.modal.title"
                        :message="state.modal.message" :icon="state.modal.icon" @closeModal="closeModal" />
                </template>

            </v-stepper>

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
import Modal from "@/components/Modal.vue"
import { VStepper } from 'vuetify/labs/VStepper';
import { useUserStore } from '@/store/user'
import { reactive } from 'vue'

const state = reactive({
    error: 0,
    loading: false,
    modal: {
        show: false,
        type: "success",
        icon: "mdi-email",
        title: "Registration successful",
        message: `Thank you ${userStore.firstName} ${userStore.lastName} for registering with The Strength Yard! Please check your email to verify your account.`,
        path: "/account/login"
    }
})

const nextStep = (step) => {
    currentStep.value = step;
};

const prevStep = (step) => {
    currentStep.value = step;
};

const validateStep = (step) => {
    console.log("step: " + step);
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
                submitForm();
            }
            break;
        default:
            break;
    }
};

const validateRegistrationForm = () => {

    state.error = 0;

    if (userStore.displayPicture == null) { state.error++; }
    if (userStore.firstName == null) {
        state.error++;
    } else if (userStore.firstName.length < 2) { state.error++; }
    if (userStore.lastName == null) {
        state.error++;
    } else if (userStore.lastName.length < 2) { state.error++; }
    if (userStore.emailAddress == null) {
        state.error++;
    } else if (/.+@.+\..+/.test(userStore.emailAddress) == false) { state.error++; }
    if (userStore.gender == null) { state.error++; }
    if (userStore.dateOfBirth == null) { state.error++; }
    if (userStore.homeAddress == null) { state.error++; }
    if (userStore.postalCode == null) {
        state.error++;
    } else if (userStore.postalCode.length != 6) { state.error++; }
    else if (/^\d+$/.test(userStore.postalCode) == false) { state.error++; }
    if (userStore.contactNo == null) { state.error++; }
    if (userStore.password == null) {
        state.error++;
    } else if (userStore.password.length < 8) { state.error++; }
    else if (/[a-z]/.test(userStore.password) == false) { state.error++; }
    else if (/[A-Z]/.test(userStore.password) == false) { state.error++; }
    else if (/\d/.test(userStore.password) == false) { state.error++; }
    else if (/[!@#$%^&*]/.test(userStore.password) == false) { state.error++; }
    if (userStore.password != userStore.confirmPassword) { state.error++; }

    console.log("error: " + state.error)
    if (state.error == 0) {
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
        state.error = false
        return true;
    } else {
        // Show an error message or provide feedback to the user
        state.error = true
        return false;
    }
};

const validateIndemnityForm = () => {
    // Perform validation for the indemnity form fields
    // Return true if the form is valid, false otherwise
    // Example: Check if required fields are filled, and a checkbox is checked
    if (userStore.MedicalHistory.length != 0) {
        state.error = false;
        return true;
    } else {
        // Show an error message or provide feedback to the user
        state.error = true;
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
        for (let i = 0; i < userStore.FeedbackDiscover.length; i++) {
            if (userStore.FeedbackDiscover[i] == 'Other') {
                userStore.FeedbackDiscover[i] += ": " + userStore.otherFeedbackDiscover
            }
        }
    } return userStore.FeedbackDiscover.join(', ');
};

const transformIndemnityForm = () => {
    if (userStore.MedicalHistory.length != 0) {
        for (let i = 0; i < userStore.MedicalHistory.length; i++) {
            if (userStore.MedicalHistory[i] == 'Other') {
                userStore.MedicalHistory[i] += ": " + userStore.otherMedicalHistory
            }
        }

    } return userStore.MedicalHistory.join(', ');
};

function closeModal() {
    state.modal.show = false
};

async function submitForm() {

    try {
        const uploadResponse = await userStore.uploadAvatar(userStore.displayPicture)
        if (uploadResponse.status == 200) {
            console.log("AWS upload success");

            // trigger registration form through this API and put in variables
            // Edit the function below accordingly, e.g. update the parameters, etc
            const registerPayload = {
                "emailAddress": userStore.emailAddress,
                "firstName": userStore.firstName,
                "lastName": userStore.lastName,
                "gender": userStore.gender,
                "dateOfBirth": userStore.dateOfBirth,
                "homeAddress": userStore.homeAddress,
                "postalCode": userStore.postalCode,
                "contactNo": userStore.contactNo,
                "password": userStore.password,
                "displayPicture": uploadResponse.s3Uri,
                "feedbackDiscover": transformFeedbackForm(),
                "medicalHistory": transformIndemnityForm(),
                "medicalRemarks": userStore.MedicalRemarks,
                "ackTnC": userStore.AcknowledgementTnC,
                "ackGymRules": userStore.AcknowledgementOpenGymRules,

            }
            const registerResponse = await userStore.register(registerPayload)
            console.log(registerResponse);

            if (registerResponse.status == 200) {

                // Show success modal
                state.modal.show = true;
                state.modal.title = "Registration successful";
                state.modal.icon = "mdi-email";
                state.modal.message = `Thank you ${userStore.firstName} ${userStore.lastName} for registering with The Strength Yard! email to verify your account.`;
                state.modal.type = "success";

                // redirect to email verification (I put login as temporary measure)
                console.log("registration success");

            } else {
                throw new Error("Registration failed with status code: ", registerResponse.status)
            }
        } else {
            throw new Error("AWS upload failed with status code: ", uploadResponse.status);
        }
    } catch (error) {
        console.log("Registration error: ", error);
    } finally {
        userStore.$reset
    }
};

</script>


<style lang="scss" scoped>
/* Add your custom styles here */
</style>

