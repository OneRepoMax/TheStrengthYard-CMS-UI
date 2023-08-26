<template>
    <v-row justify="center" class="h-100" align="center">

        <v-card elevation="3" class="pa-5" max-width="700px">
            <v-card-title class="text-center">
                <v-card-title>Manage Account</v-card-title>
                <v-avatar size="80" color="surface-variant" @click="openFileInput">
                    <v-img v-if="selectedFile" :src="selectedFile" alt="Avatar" max-height="80px"></v-img>
                    <v-icon v-else>mdi-camera</v-icon>
                </v-avatar>
                <input ref="fileInput" type="file" style="display: none" accept="image/*" @change="handleFileUpload" />
                <v-card-subtitle class="mt-3 mb-3"> Profile Picture </v-card-subtitle>

            </v-card-title>
            <v-card-text>
                <v-form @submit.prevent="updateProfile" validate-on="submit">
                    <v-row class="mb-3">
                        <v-col cols="12" md="6">
                            <v-text-field clearable hide-details="auto" class="mb-3" label="First Name"
                                v-model="this.userStore.firstName" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Last Name"
                                v-model="this.userStore.lastName" variant="outlined"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="9">
                            <v-text-field hide-details="auto" class="mb-3" label="Date of Birth" type="date"
                                v-model="formattedDob" variant="outlined" placeholder="YYYY-MM-DD"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-select hide-details="auto" class="mb-3" label="Gender" v-model="formattedGender"
                                :items="['Male', 'Female', 'Prefer not to say']" variant="outlined"></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Email"
                                v-model="this.userStore.emailAddress" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Address"
                                v-model="this.userStore.homeAddress" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Postal Code"
                                v-model="this.userStore.postalCode" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Contact Number"
                                v-model="this.userStore.contactNo" variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-btn block color="teal" variant="outlined" class="mb-5" to="/profile/change-password"
                        prepend-icon="mdi-key" density="default" size="large">Change Password</v-btn>

                    <v-btn color="teal" block type="submit" size="large">Update Profile</v-btn>
                </v-form>
            </v-card-text>

            <v-template>
                <Modal v-model="modal.show" :path="modal.path" :title="modal.title" :message="modal.message"
                    :icon="modal.icon" @closeModal="closeModal" />
            </v-template>

        </v-card>

    </v-row>
</template>

<script>
import { useUserStore } from '@/store/user';
import Modal from './Modal.vue';

export default {
    setup() {
        const userStore = useUserStore()

        return {
            userStore,
        }
    },

    data() {
        return {
            selectedFile: this.userStore.displayPicture,
            displayPicture: this.userStore.displayPicture,
            profilePicture: null,
            modal: {
                show: false,
                type: "success",
                icon: "mdi-check-circle",
                title: "Update successful",
                message: "Your account has been successfully updated!",
                path: "/"
            }
        }
    },
    computed: {
        formattedDob: {
            get() {
                const date = new Date(this.userStore.dateOfBirth);
                const year = date.getUTCFullYear();
                const month = String(date.getUTCMonth() + 1).padStart(2, "0");
                const day = String(date.getUTCDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
            },
            set(newValue) {
                const date = new Date(newValue);
                const year = date.getUTCFullYear();
                const month = String(date.getUTCMonth() + 1).padStart(2, "0");
                const day = String(date.getUTCDate()).padStart(2, "0");
                this.userStore.dateOfBirth = `${year}-${month}-${day}`
            }


        },
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
        closeModal() {
            this.modal.show = false
        },
        async updateProfile() {

            console.log(JSON.stringify({
                firstName: this.userStore.firstName,
                lastName: this.userStore.lastName,
                contactNo: this.userStore.contactNo,
                homeAddress: this.userStore.homeAddress,
                postalCode: this.userStore.postalCode,
                gender: this.userStore.gender,
                dateOfBirth: this.userStore.dateOfBirth,
                displayPicture: this.displayPicture,
            }))
            try {

                if (this.selectedFile != this.displayPicture) {
                    const uploadResponse = await this.userStore.uploadAvatar(this.profilePicture)
                    this.displayPicture = uploadResponse.s3Uri
                }

                // uri to uploaded avatar
                console.log(this.displayPicture);

                // trigger update profile form through this API and put in variables
                // Edit the function below accordingly, e.g. update the parameters, etc
                await this.userStore.updateProfile({
                    firstName: this.userStore.firstName,
                    lastName: this.userStore.lastName,
                    contactNo: this.userStore.contactNo,
                    homeAddress: this.userStore.homeAddress,
                    postalCode: this.userStore.postalCode,
                    gender: this.userStore.gender,
                    dateOfBirth: this.userStore.dateOfBirth,
                    displayPicture: this.displayPicture
                }).then((response) => {
                    if (response.status == 200) {

                        console.log(response.data);

                        // Show success modal
                        this.modal.show = true

                    }
                })


            } catch (error) {
                console.log("Update Profile error: ", error);
            }
        }
    },
    components: { Modal }
}


</script>

<style lang="scss" scoped></style>