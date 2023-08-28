<template>
    <!-- <v-row justify="center" class="h-100" align="center"> -->
      <!-- <v-col cols="12" lg="4" md="5"> -->
        <!-- <v-card class="elevation-12"> -->
          <div class="bg-cyan py-2">
            <p class="text-center" >Already have an account? 
                <router-link class="text-white" to="/account/login">Log in here</router-link>
            </p>
          </div>
          <v-toolbar color="white" dark flat>
            <v-toolbar-title class="text-center font-weight-bold">Member Registration</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form class="text-left" @submit.prevent="register">
                <!-- Profile Picture -->
                <div class="d-flex justify-center mb-3">
                    <v-avatar size="80" color="surface-variant" @click="openFileInput">
                    <v-img v-if="selectedFile" :src="selectedFile" alt="Avatar" max-height="80px"></v-img>
                    <v-icon v-else>mdi-camera</v-icon>
                    </v-avatar>
                    <input
                    ref="fileInput"
                    type="file"
                    style="display: none"
                    accept="image/*"
                    @change="handleFileUpload"
                    />
                </div>
                <p class="d-flex justify-center mb-5">Profile Picture</p>
                <!-- First Name -->
                <v-text-field v-model="userStore.firstName" label="First Name" required :rules="nameRules" class="mt-3"></v-text-field>
                <!-- Last Name -->
                <v-text-field v-model="userStore.lastName" label="Last Name" required :rules="nameRules" class="mt-3"></v-text-field>
                <!-- Gender -->
                <v-select v-model="formattedGender" label="Gender" :items="genders" placeholder="Select" required :rules="genderRules" class="mt-3"></v-select>
                <!-- Date of Birth -->
                <v-text-field v-model="userStore.dateOfBirth" label="Date of Birth" type="date" placeholder="DD-MM-YYYY" :rules="dobRules" class="mt-3" required></v-text-field>
                <!-- Email -->
                <v-text-field v-model="userStore.emailAddress" label="Email" required :rules="emailRules" class="mt-3"></v-text-field>
                <!-- Address -->
                <v-text-field v-model="userStore.homeAddress" label="Address" :rules="addressRules" class="mt-3" required></v-text-field>
                <!-- Postal Code -->
                <v-text-field v-model="userStore.postalCode" label="Postal Code" :rules="postalRules" class="mt-3" required></v-text-field>
                <!-- Contact -->
                <v-text-field v-model="userStore.contactNo" label="Contact Number" :rules="contactRules" class="mt-3" required></v-text-field>
                <!-- Password -->
                <v-text-field
                    v-model="userStore.password"
                    label="Password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="passwordRules"
                    :type="show1 ? 'text' : 'password'"
                    @click:append="show1 = !show1"
                    class="mt-3"
                    required
                    counter
                ></v-text-field>
                <!-- Confirm Password -->
                <v-text-field
                    v-model="userStore.confirmPassword"
                    label="Confirm Password"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="confirmPasswordRules"
                    :type="show2 ? 'text' : 'password'"
                    @click:append="show2 = !show2"
                    class="mt-3"
                    required
                    counter
                ></v-text-field>
                <div class="text-center">
                  <v-btn color="teal" size="large" type="submit" class="mt-3">Next</v-btn>
                </div>
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
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      password: '',
      confirmPassword: '',
      fileObject: null,
      show1: false,
      show2: false,
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

  }
  },

  methods: {
    async register() {
      // Add your registration logic here
      console.log('Registration data:', {
        profilePicture: this.profilePicture,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        address: this.address,
        password: this.password,
      });
      
      try {
        const uploadResponse = await this.userStore.uploadAvatar(this.profilePicture)
        if (uploadResponse.status == 200){
            console.log("success");

            // uri to uploaded avatar
            console.log(uploadResponse);

            // trigger registration form through this API and put in variables
            // Edit the function below accordingly, e.g. update the parameters, etc
            const registerResponse = await this.userStore.register(
                "...",
                "<insert other parameters>",
                uploadResponse
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

        this.profilePicture = file
      }
    },
  },


};
</script>

<style scoped>
/* Add your custom styles here */
</style>
