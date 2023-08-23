
<template>
    <v-main>
        <v-container fluid class="login-bg" justify="center">
            <v-row justify="center" class="h-100" align="center">
                <v-col cols="12" lg="4" md="5" align="center">
                    <v-card elevation="3">
                        <v-card-title class="text-center">
                            <v-card-title>Manage Account</v-card-title>
                            <v-avatar size="80" color="surface-variant" @click="openFileInput">
                                <v-img v-if="selectedFile" :src="selectedFile" alt="Avatar" max-height="80px"></v-img>
                                <v-icon v-else>mdi-camera</v-icon>
                            </v-avatar>
                            <input ref="fileInput" type="file" style="display: none" accept="image/*"
                                @change="handleFileUpload" />
                            <v-card-subtitle class="mt-3 mb-3"> Profile Picture </v-card-subtitle>

                        </v-card-title>
                        <v-card-text>
                            <v-form @submit.prevent="updateProfile" validate-on="submit">
                                <v-text-field clearable hide-details="auto" class="mb-3" label="First Name"
                                    v-model="this.userStore.firstName" variant="outlined"></v-text-field>
                                <v-text-field clearable hide-details="auto" class="mb-3" label="Last Name"
                                    v-model="this.userStore.lastName" variant="outlined"></v-text-field>
                                <v-text-field clearable hide-details="auto" class="mb-3" label="Email"
                                    v-model="this.userStore.emailAddress" variant="outlined"></v-text-field>
                                <v-text-field clearable hide-details="auto" class="mb-3" label="Address"
                                    v-model="this.userStore.homeAddress" variant="outlined"></v-text-field>
                                    
                                <v-text-field clearable hide-details="auto" class="mb-3" label="Postal Code"
                                    v-model="this.userStore.postalCode" variant="outlined"></v-text-field>

                                <v-text-field clearable hide-details="auto" class="mb-3" label="Contact Number"
                                    v-model="this.userStore.contactNo" variant="outlined"></v-text-field>

                                <v-text-field clearable hide-details="auto" class="mb-3" label="Date of Birth"
                                    v-model="this.userStore.dob" variant="outlined" placeholder="YYYY-MM-DD"></v-text-field>

                                <v-select clearable hide-details="auto" class="mb-3" label="Gender"
                                v-model="this.userStore.gender"  :items="['M', 'F', 'Prefer not to say']"
                                ></v-select>
                                
                                <v-btn block color="teal" variant="outlined" class="mb-3" to="/profile/change-password"
                                    density="default" size="large">Change Password</v-btn>

                                <v-btn color="teal" block type="submit" size="large">Update Profile</v-btn>
                            </v-form>
                        </v-card-text>

                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
import { useUserStore } from '@/store/user'

export default {
    name: 'LoginForm',
    setup() {
        const userStore = useUserStore()

        return {
            userStore
        }
    },
    
    data() {
        return {
            firstName: "",
            lastName: "",
            emailAddress: "",
            homeAddress: "",
            postalCode: "",
            selectedFile: this.userStore.displayPicture,
            displayPicture: this.userStore.displayPicture,
            profilePicture: null,
            gender:"",
            dob:"",
        }
    },
    methods: {
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
        async updateProfile() {
            try {

                if (this.selectedFile != this.displayPicture) {
                    const uploadResponse = await this.userStore.uploadAvatar(this.profilePicture)
                    this.displayPicture = uploadResponse.s3Uri
                }

                // uri to uploaded avatar
                console.log(this.displayPicture);

                // trigger update profile form through this API and put in variables
                // Edit the function below accordingly, e.g. update the parameters, etc
                const updateResponse = await this.userStore.updateProfile(
                    firstName = this.userStore.firstName,
                    lastName = this.userStore.lastName,
                    contactNo = this.userStore.contactNo,
                    homeAddress = this.userStore.homeAddress,
                    postalCode = this.userStore.postalCode,
                    gender = this.userStore.gender,
                    dob = this.userStore.dob,
                    displayPicture = this.displayPicture
                )

                if (updateResponse.status == 200) {

                    // Show success modal
                    // <insert your codes here>
                    console.log("Success?")
                    console.log(this.userStore.gender)
                    // redirect to email verification (I put login as temporary measure)
                    // this.$router.push({ path: '/' })

                }
            
    } catch(error) {
        console.log("Update Profile error: ", error);
    }
}
    }
}


</script>

<style lang="scss" scoped></style>