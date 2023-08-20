<template>
    <v-row justify="center" class="h-100" align="center">
      <v-col cols="12" lg="4" md="5">
        <v-card class="elevation-12">
          <v-toolbar color="white" dark flat>
            <v-toolbar-title class="text-center font-weight-bold">Member Registration</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="register">
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
                <v-text-field v-model="firstName" label="First Name" required :rules="nameRules" class="mt-3"></v-text-field>
                <v-text-field v-model="lastName" label="Last Name" required :rules="nameRules" class="mt-3"></v-text-field>
                <v-text-field v-model="email" label="Email" required :rules="emailRules" class="mt-3"></v-text-field>
                <v-text-field v-model="address" label="Address" :rules="addressRules" class="mt-3" required></v-text-field>
                <v-text-field
                    v-model="password"
                    label="Password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="passwordRules"
                    :type="show1 ? 'text' : 'password'"
                    @click:append="show1 = !show1"
                    class="mt-3"
                    required
                    counter
                ></v-text-field>
                <v-text-field
                    v-model="confirmPassword"
                    label="Confirm Password"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="confirmPasswordRules"
                    :type="show1 ? 'text' : 'password'"
                    @click:append="show2 = !show2"
                    class="mt-3"
                    required
                    counter
                ></v-text-field>
                <v-btn block color="teal" size="large" type="submit" class="mt-3">Register</v-btn>
            </v-form>

            <p class="text-center mt-5">Already have an account? 
                <router-link to="/account/login">Log in here</router-link>
            </p>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
</template>

<script>
export default {
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
      addressRules: [
        v => !!v || 'Address is required',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must be at least 6 characters',
      ],
      confirmPasswordRules: [
        v => !!v || 'Confirmation Password is required',
        v => v === this.password || 'Passwords do not match',
      ],
    };
  },
  methods: {
    register() {
      // Add your registration logic here
      console.log('Registration data:', {
        profilePicture: this.profilePicture,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        address: this.address,
        password: this.password,
      });
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
      }
    },
  },
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
