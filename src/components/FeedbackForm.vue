<template>
    <v-form @submit.prevent="feedback">
        <p class="text-left my-5" rules>
            How did you discover The Strength Yard?
        </p>
        <p v-if="validationError" class="error-text text-left text-red">{{ validationError }}</p>
        <v-checkbox class="shrink mb-n8" v-for="(option, index) in options" v-model="userStore.FeedbackDiscover"
            :key="index" :label="option" :value="option"></v-checkbox>

        <!-- Display the text input for 'Others' when it's selected -->
        <v-text-field v-if="userStore.FeedbackDiscover.includes('Other')" v-model="userStore.otherFeedbackDiscover"
            label="Specify 'Other'"></v-text-field>
        <v-row>
            <v-col cols="12" md="6" align="center" class="pt-0" order="last" order-md="first">
                <v-btn block @click="prev" variant="outlined" color="teal" size="large" class="mt-3">Previous</v-btn>
            </v-col>
            <v-col cols="12" md="6" align="center" class="pt-0" order="first" order-md="last">
                <v-btn block @click="feedback" color="teal" size="large" type="submit" class="mt-3">Next</v-btn>
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
                "Search Engine",
                "Friend's Recommendation",
                "Walking Pass",
                "Google Maps",
                "Facebook Adverts",
                "Google Adverts",
                "Other"
            ],
        };
    },
    methods: {
        feedback() {
            // console.log("run validate step");
            this.$emit('validate-step');
            this.validateForm();
        },

        prev() {
            this.$emit('prev-step');
        },

        async validateForm() {
            if (this.userStore.FeedbackDiscover.length == 0) {
                this.validationError = 'Please select at least one option.';
                // console.log('Selected Options:', this.userStore.FeedbackDiscover);
                // console.log(this.userStore.FeedbackDiscover.length);
                // console.log('Others Text:', this.otherFeedbackDiscover);
            } else {
                // Reset validation error if there are selected options
                this.validationError = null;

                // Handle form submission or other actions here
                // console.log('Selected Options:', this.userStore.FeedbackDiscover);
                // console.log('Others Text:', this.userStore.otherFeedbackDiscover);
            }
        }
    },
    emits: ['validate-step']
};
</script>
