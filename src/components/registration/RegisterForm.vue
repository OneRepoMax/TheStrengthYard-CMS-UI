<template>
    <!-- <v-row justify="center" class="h-100" align="center"> -->
    <!-- <v-col cols="12" lg="4" md="5"> -->
    <!-- <v-card class="elevation-12"> -->
    <div class="bg-cyan py-2 rounded-pill text-white">
        <p class="text-center">Already have an account?
            <router-link class="text-white" to="/account/login">Log in here</router-link>
        </p>
    </div>
    <v-card-title dark flat>
        <v-toolbar-title class="text-center font-weight-bold">Member Registration</v-toolbar-title>
    </v-card-title>
    <v-card-text>
        <v-form class="text-left" @submit.prevent="register">
            <!-- Profile Picture -->
            <div class="d-flex justify-center mb-3">
                <v-avatar size="80" color="surface-variant" @click="openFileInput">
                    <v-img v-if="selectedFile" :src="selectedFile" alt="Avatar" max-height="80px"></v-img>
                    <v-icon v-else>mdi-camera</v-icon>
                </v-avatar>
                <input ref="fileInput" type="file" style="display: none" accept="image/*" @change="handleFileUpload" />
            </div>
            <p class="d-flex justify-center mb-5">Profile Picture</p>
            <p class="d-flex justify-center mt-n5 mb-5 text-caption" v-if="picError" style="color: #B71C1C;">Profile picture is required.</p>
            <v-row>
                <!-- First Name -->
                <v-col cols="12" md="6" class="py-0">
                    <v-text-field v-model="userStore.firstName" label="First Name" required :rules="nameRules"
                        class="mt-3"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="py-0">
                    <!-- Last Name -->
                    <v-text-field v-model="userStore.lastName" label="Last Name" required :rules="nameRules"
                        class="mt-3"></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4" class="py-0">
                    <!-- Gender -->
                    <v-select v-model="formattedGender" label="Gender" :items="genders" placeholder="Select" required
                        :rules="genderRules" class="mt-3"></v-select>
                </v-col>
                <v-col cols="12" md="8" class="py-0">
                    <!-- Date of Birth -->
                    <v-text-field v-model="userStore.dateOfBirth" label="Date of Birth" type="date" placeholder="DD-MM-YYYY"
                        :rules="dobRules" class="mt-3" required></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="8" class="py-0">
                    <!-- Address -->
                    <v-text-field v-model="userStore.homeAddress" label="Address" :rules="addressRules" class="mt-3"
                        required></v-text-field>
                </v-col>
                <v-col cols="12" md="4" class="py-0">
                    <!-- Postal Code -->
                    <v-text-field v-model="userStore.postalCode" label="Postal Code" :rules="postalRules" class="mt-3"
                        required></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" class="py-0">
                    <!-- Contact -->
                    <v-text-field v-model="userStore.contactNo" label="Contact Number" :rules="contactRules" class="mt-3"
                        required></v-text-field>
                </v-col>
                <v-col cols="12" class="py-0">
                    <!-- Email -->
                    <v-text-field v-model="userStore.emailAddress" label="Email" required :rules="emailRules"
                        class="mt-3"></v-text-field>
                </v-col>
                <v-col cols="12" class="py-0">
                    <!-- Password -->
                    <v-text-field v-model="userStore.password" label="Password"
                        :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="passwordRules"
                        :type="show1 ? 'text' : 'password'" @click:append-inner="show1 = !show1" class="mt-3" required
                        counter></v-text-field>
                </v-col>
                <v-col cols="12" class="py-0">
                    <!-- Confirm Password -->
                    <v-text-field v-model="userStore.confirmPassword" label="Confirm Password"
                        :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" :rules="confirmPasswordRules"
                        :type="show2 ? 'text' : 'password'" @click:append-inner="show2 = !show2" class="mt-3" required
                        counter></v-text-field>

                </v-col>
                <v-col cols="12" class="py-0">
                    <!-- Password Strength Checker -->
                    <v-card-text>
                        Password Strength: <b>{{ this.score.text }}</b>
                    </v-card-text>

                    <v-progress-linear :color="score.color" :model-value="score.value" striped height="10"
                        class="mb-5"></v-progress-linear>

                    <v-row>
                        <v-col cols="12" md="6" align="center" class="pt-0" order="last" order-md="first">
                            <v-btn block to="/account/login" variant="outlined" color="teal" size="large"
                                class="mt-3">Previous</v-btn>
                        </v-col>
                        <v-col cols="12" md="6" align="center" class="pt-0" order="first" order-md="last">
                            <v-btn block color="teal" size="large" type="submit" class="mt-3">Next</v-btn>
                        </v-col>
                    </v-row>

                </v-col>
            </v-row>

        </v-form>

        <!-- <p class="text-center mt-5">Already have an account? 
                <router-link to="/account/login">Log in here</router-link>
            </p> -->

    </v-card-text>
    <!-- </v-card> -->
    <!-- </v-col> -->
    <!-- </v-row> -->
</template>

<script>

import { useUserStore } from '@/store/user'
import zxcvbn from "zxcvbn";

export default {
    setup() {
        const userStore = useUserStore()

        return {
            userStore
        }
    },
    data() {
        return {
            selectedFile: null,
            profilePicture: null,
            genders: ['Male', 'Female', 'Prefer not to say'],
            fileObject: null,
            show1: false,
            show2: false,
            picError: false,
            nameRules: [
                v => !!v || 'First Name is required',
                v => (v && v.length >= 2) || 'First Name must be at least 2 characters',
            ],
            emailRules: [
                v => !!v || 'Email is required',
                v => /.+@.+\..+/.test(v) || 'Email must be valid',
            ],
            genderRules: [
                v => !!v || 'Gender is required',
            ],
            dobRules: [
                v => !!v || 'Date of Birth is required',
            ],
            addressRules: [
                v => !!v || 'Address is required',
            ],
            postalRules: [
                v => !!v || 'Postal Code is required',
                v => (v && v.length == 6 && /^\d+$/.test(v)) || 'Postal Code must be 6 digits',
            ],
            contactRules: [
                v => !!v || 'Contact Number is required',
            ],
            passwordRules: [
                v => !!v || 'Password is required',
                v => (v && v.length >= 8) || 'Password must be at least 8 characters',
                v => (v && !!/[a-z]/.test(v)) || 'Password must contain at least one lowercase letter.',
                v => (v && !!/[A-Z]/.test(v)) || 'Password must contain at least one uppercase letter.',
                v => (v && !!/\d/.test(v)) || 'Password must contain at least one numeric character.',
                v => (v && !!/[!@#$%^&*]/.test(v)) || 'Password must contain at least one special character.',
            ],
            confirmPasswordRules: [
                v => !!v || 'Confirmation Password is required',
                v => v === this.userStore.password || 'Passwords do not match',
            ],
        };
    },

    computed: {
        formattedGender: {
            get() {
                switch (this.userStore.gender) {
                    case 'M':
                        return 'Male'
                    case 'F':
                        return 'Female'
                    case 'O':
                        return 'Prefer not to say'
                }
            },
            set(newValue) {
                switch (newValue) {
                    case 'Male':
                        this.userStore.gender = 'M';
                        break;
                    case 'Female':
                        this.userStore.gender = 'F';
                        break;
                    case 'Prefer not to say':
                        this.userStore.gender = 'O';
                        break;
                }
            }
        },
        score() {
            const result = zxcvbn(this.userStore.password);

            switch (result.score) {
                case 4:
                    return {
                        text: "Very strong",
                        color: "light-blue",
                        value: 100,
                    };
                case 3:
                    return {
                        text: "Strong",
                        color: "light-green",
                        value: 75,
                    };
                case 2:
                    return {
                        text: "moderate",
                        color: "yellow",
                        value: 50,
                    };
                case 1:
                    return {
                        text: "Weak",
                        color: "orange",
                        value: 25,
                    };
                default:
                    return {
                        text: "Very weak",
                        color: "red",
                        value: 0,
                    };
            }
        },
    },

    methods: {
        register() {
            // console.log("run validate step");
            if (!this.selectedFile){
                this.picError = true;
            }
            this.$emit('validate-step');
        },

        openFileInput() {
            // Trigger the click event of the hidden file input element when the avatar is clicked
            this.$refs.fileInput.click();
        },

        handleFileUpload(event) {
            const file = event.target.files[0];

            if (file) {
                // Handle the file upload logic here.
                // You can send the file to a server for processing or display it locally.
                console.log('Selected file:', file);

                // Optionally, if you want to display the selected image locally:
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = () => {
                    this.selectedFile = reader.result;
                };

                this.userStore.displayPicture = file
                this.picError = false;
            }
        },
    },

    emits: ['validate-step']


};
</script>

<style scoped>
/* Add your custom styles here */
</style>
