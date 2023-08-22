
<template>
    <v-main>
        <v-container fluid class="login-bg" justify="center">
            <v-row justify="center" class="h-100" align="center">
                <v-col cols="12" lg="4" md="5" align="center">
                    <v-card elevation="3">
                        <v-card-title class="text-center">
                            <v-card-title>Edit Profile</v-card-title>
                            <v-avatar size="80" color="surface-variant" @click="openFileInput">
                                <v-img v-if="selectedFile" :src="selectedFile" alt="Avatar" max-height="80px"></v-img>
                                <v-icon v-else>mdi-camera</v-icon>
                            </v-avatar>
                            <input ref="fileInput" type="file" style="display: none" accept="image/*"
                                @change="handleFileUpload" />
                            <v-card-subtitle class="mt-3 mb-3"> Profile Picture </v-card-subtitle>

                        </v-card-title>
                        <v-card-text>
                            <v-form @submit.prevent="updateProfile" validate-on="submit" >
                            <v-text-field clearable hide-details="auto" class="mb-3" label="First Name" v-model="this.userStore.firstName"
                                variant="outlined"></v-text-field>
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Last Name" v-model="this.userStore.lastName"
                                variant="outlined"></v-text-field>
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Email" v-model="this.userStore.emailAddress"
                                variant="outlined"></v-text-field>
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Address" v-model="this.userStore.homeAddress"
                                variant="outlined"></v-text-field>
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Contact Number" v-model="this.userStore.contactNo"
                            variant="outlined"></v-text-field>
                            <v-col>
                                <v-btn class="mb-3" to="account/reset-password" density="default" >Change Password</v-btn>
                            </v-col>
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
            firstName:"",
            lastName: "",
            emailAddress: "",
            homeAddress: "",
            selectedFile: null,
            profilePicture: null,
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
                const uploadResponse = await this.userStore.uploadAvatar(this.profilePicture)
                if (uploadResponse.status == 200) {
                    console.log("success");

                    // uri to uploaded avatar
                    console.log(uploadResponse);

                    // trigger update profile form through this API and put in variables
                    // Edit the function below accordingly, e.g. update the parameters, etc
                    const registerResponse = await this.userStore.updateProfile(
                        this.userStore.emailAddress,
                        this.userStore.firstName,
                        this.userStore.lastName,
                        this.userStore.contactNo,
                        this.userStore.gender,
                        this.userStore.homeAddress,
                        this.userStore.postalCode,
                        this.userStore.dob,
                        uploadResponse
                    )

                    if (registerResponse.status == 200) {

                        // Show success modal
                        // <insert your codes here>
                            console.log("Success?")
                        // redirect to email verification (I put login as temporary measure)
                        this.$router.push({ path: '/' })

                    }
                }
            } catch (error) {
                console.log("Registration error: ", error);
            }
        }
    }
}


</script>

<style lang="scss" scoped></style>