<template>
    <v-row justify="center" class="h-100" align="center">

        <v-card elevation="3" class="pa-5" max-width="700px">
            <v-card-title class="text-center">
                <v-card-title>Manage Account</v-card-title>
                <v-avatar size="80" color="surface-variant" @click="openFileInput">
                    <v-img v-if="this.userProfileData.displayPicture" :src="this.userProfileData.displayPicture"
                        alt="Avatar" max-height="80px"></v-img>
                    <v-icon v-else>mdi-camera</v-icon>
                </v-avatar>
                <input ref="fileInput" type="file" style="display: none" accept="image/*" @change="handleFileUpload" />
                <v-card-subtitle class="mt-3 mb-3"> Profile Picture </v-card-subtitle>

            </v-card-title>
            <v-card-text>
                <v-form ref="form" @submit.prevent="validateRegistrationForm" validate-on="submit">
                    <v-row class="mb-3">
                        <v-col cols="12" md="6">
                            <v-text-field clearable hide-details="auto" class="mb-3" label="First Name"
                                v-model="this.userProfileData.firstName" required :rules="firstNameRules"
                                variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Last Name"
                                v-model="this.userProfileData.lastName" required :rules="lastNameRules"
                                variant="outlined"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="9">
                            <v-text-field hide-details="auto" class="mb-3" label="Date of Birth" type="date"
                                v-model="formattedDob" required :rules="dobRules" variant="outlined"
                                placeholder="YYYY-MM-DD"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-select hide-details="auto" class="mb-3" label="Gender" v-model="formattedGender"
                                :items="['Male', 'Female', 'Prefer not to say']" required :rules="genderRules"
                                variant="outlined"></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Email"
                                v-model="this.userProfileData.emailAddress" required :rules="emailRules"
                                variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Address"
                                v-model="this.userProfileData.homeAddress" required :rules="addressRules"
                                variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Postal Code"
                                v-model="this.userProfileData.postalCode" required :rules="postalRules"
                                variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Contact Number"
                                v-model="this.userProfileData.contactNo" required :rules="contactRules"
                                variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-btn v-if="this.userId == null" block color="teal" variant="outlined" class="mb-5"
                        to="/profile/change-password" prepend-icon="mdi-key" density="default" size="large">Change
                        Password</v-btn>

                    <v-btn color="teal" block type="submit" size="large">Update Profile</v-btn>
                </v-form>
            </v-card-text>

            <template>
                <Modal v-model="modal.show" :path="modal.path" :title="modal.title" :message="modal.message"
                    :icon="modal.icon" @closeModal="closeModal" />
            </template>

        </v-card>

    </v-row>
</template>

<script>
import { useUserStore } from '@/store/user';
import Modal from '@/components/common/Modal.vue';

export default {
    setup() {
        const userStore = useUserStore()

        return {
            userStore,
        }
    },
    watch: {
        userId(newValue) {
            try {
                if (newValue != null) {
                    this.getProfileData();
                } else {
                    console.log("test");
                    this.userProfileData = this.userStore.$state
                    console.log(this.userProfileData);
                }

            } catch (error) {
                console.error("Error getting user by ID", error)
            }

        }
    },
    mounted() {
        if (this.userId == null) {
            this.userProfileData = this.userStore.$state
        } else {
            this.getProfileData();
        }
    },
    data() {
        return {
            selectedFile: this.userStore.displayPicture,
            displayPicture: this.userStore.displayPicture,
            profilePicture: null,
            userProfileData: {
                firstName: null,
                lastName: null,
                emailAddress: null,
                contactNo: null,
                homeAddress: null,
                postalCode: null,
                gender: null,
                dateOfBirth: null,
                displayPicture: null,
            },
            firstNameRules: [
                v => !!v || 'First Name is required',
                v => (v && /^[A-Za-z\s\-']+$/.test(v)) || 'Please enter a valid first name',
            ],
            lastNameRules: [
                v => !!v || 'Last Name is required',
                v => (v && /^[A-Za-z\s\-']+$/.test(v)) || 'Please enter a valid last name',
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
                v => (v && v.toString().length == 6 && /^\d+$/.test(v)) || 'Postal Code must be 6 digits',
            ],
            contactRules: [
                v => !!v || 'Contact Number is required',
                v => (v && v.toString().length == 8 && /^\d+$/.test(v)) ||'Contact Number must be 8 digits',
            ],
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
                const date = new Date(this.userProfileData.dateOfBirth);
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
                this.userProfileData.dateOfBirth = `${year}-${month}-${day}`
            }
        },
        formattedGender: {
            get() {
                switch (this.userProfileData.gender) {
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
                        this.userProfileData.gender = 'M';
                        break;
                    case 'Female':
                        this.userProfileData.gender = 'F';
                        break;
                    case 'Prefer not to say':
                        this.userProfileData.gender = 'O';
                        break;
                }
            }

        },
        userId() {
            return this.$route.params.id || null;
        },
    },

    methods: {
        async validateRegistrationForm() {

            await this.$refs.form.validate();

            const isValid = this.$refs.form.isValid

            if (!isValid) {
                // Form has validation errors, do not submit
                console.log('Form has validation errors');
            } else {
                // Form is valid, submit the data
                this.updateProfile();
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
                    this.userProfileData.displayPicture = reader.result;
                };

                this.profilePicture = file
            }
        },
        closeModal() {
            this.modal.show = false
        },
        async getProfileData() {
            try {
                const response = await this.userStore.getUserById(this.userId)
                if (response.status == 200) {
                    this.userProfileData.firstName = response.data[0].FirstName,
                        this.userProfileData.lastName = response.data[0].LastName,
                        this.userProfileData.emailAddress = response.data[0].EmailAddress,
                        this.userProfileData.contactNo = response.data[0].ContactNo,
                        this.userProfileData.homeAddress = response.data[0].HomeAddress,
                        this.userProfileData.postalCode = response.data[0].PostalCode,
                        this.userProfileData.gender = response.data[0].Gender,
                        this.userProfileData.dateOfBirth = response.data[0].DateOfBirth,
                        this.userProfileData.displayPicture = response.data[0].DisplayPicture
                }
            } catch (error) {
                console.error("Error retrieving user info", error);
            }
        },
        async updateProfile() {

            console.log(JSON.stringify({
                firstName: this.userProfileData.firstName,
                lastName: this.userProfileData.lastName,
                emailAddress: this.userProfileData.emailAddress,
                contactNo: this.userProfileData.contactNo,
                homeAddress: this.userProfileData.homeAddress,
                postalCode: this.userProfileData.postalCode,
                gender: this.userProfileData.gender,
                dateOfBirth: this.userProfileData.dateOfBirth,
                displayPicture: this.userProfileData.displayPicture,
            }))
            try {

                if (this.userProfileData.displayPicture != this.displayPicture) {
                    const uploadResponse = await this.userStore.uploadAvatar(this.profilePicture)
                    this.userProfileData.displayPicture = uploadResponse.s3Uri
                    console.log(this.userProfileData.displayPicture);
                }

                // uri to uploaded avatar
                let tempUserId = this.userId
                if (this.userId == null) {
                    tempUserId = this.userStore.userId
                }

                // trigger update profile form through this API and put in variables
                // Edit the function below accordingly, e.g. update the parameters, etc
                await this.userStore.updateProfile({
                    firstName: this.userProfileData.firstName,
                    lastName: this.userProfileData.lastName,
                    emailAddress: this.userProfileData.emailAddress,
                    contactNo: this.userProfileData.contactNo,
                    homeAddress: this.userProfileData.homeAddress,
                    postalCode: this.userProfileData.postalCode,
                    gender: this.userProfileData.gender,
                    dateOfBirth: this.userProfileData.dateOfBirth,
                    displayPicture: this.userProfileData.displayPicture
                }, tempUserId).then((response) => {
                    if (response.status == 200) {

                        console.log(response.data);

                        if (this.userId == null) {
                            this.userStore.saveResponseToStore(response);
                            this.userStore.saveUserToLocalStorage();
                            this.modal.path = "/"
                        } else {
                            this.modal.path = "/admin/account"
                        }

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