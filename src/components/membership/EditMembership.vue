<template>
    <v-row justify="center" class="h-100" align="center">

        <v-card elevation="3" class="pa-5" width="700px">
            <v-card-title class="text-center">
                <v-card-title v-if="this.membershipId
                    == 'create'">Create Membership</v-card-title>
                <v-card-title v-else>Manage Membership</v-card-title>
            </v-card-title>
            <v-form ref="form" @submit.prevent="validateForm" validate-on="submit">

                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="8">
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Title"
                                v-model="this.membershipData.title" required :rules="rules"
                                variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-select hide-details="auto" class="mb-3" label="Visibility" v-model="this.membershipData.visibility"
                                :items="['Public', 'Private']" required :rules="rules"
                                variant="outlined"></v-select>
                        </v-col>
                        <v-col cols="12" md="12" v-if="this.membershipData.paypalPlanId">
                            <v-text-field clearable hide-details="auto" class="mb-3" label="PayPal Plan ID"
                                v-model="this.membershipData.paypalPlanId" disabled variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-textarea clearable hide-details="auto" class="mb-3" label="Description"
                                v-model="this.membershipData.description" required :rules="rules"
                                variant="outlined"></v-textarea>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-select hide-details="auto" class="mb-3" label="Type" v-model="this.membershipData.type"
                                :items="['One-Time', 'Monthly', 'Yearly']" required :rules="rules"
                                variant="outlined"></v-select>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-if="this.membershipId == 'create'" clearable hide-details="auto" class="mb-3"
                                label="Base Fee ($)" v-model="this.membershipData.basefee" type="number" required
                                :rules="feeRules" variant="outlined"></v-text-field>
                            <v-text-field v-else disabled hide-details="auto" class="mb-3" label="Base Fee ($)"
                                v-model="this.membershipData.basefee" type="number" required :rules="feeRules"
                                variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-if="this.membershipId == 'create'" clearable hide-details="auto" class="mb-3"
                                label="Set Up Fee ($)" v-model="this.membershipData.setupfee" type="number" required
                                :rules="feeRules" variant="outlined"></v-text-field>
                            <v-text-field v-else disabled hide-details="auto" class="mb-3" label="Set Up Fee ($)"
                                v-model="this.membershipData.setupfee" type="number" required :rules="feeRules"
                                variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12" v-if="this.membershipData.picture">
                            <v-card>
                                <v-img :src="this.membershipData.picture" height="300" cover></v-img>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-file-input v-if="this.membershipId == 'create'" label="Upload Picture" prepend-icon=""
                                append-inner-icon="mdi-paperclip" variant="outlined" :rules="pictureRules" accept="image/*"
                                @change="handleFileUpload"></v-file-input>
                            <v-file-input v-else label="Change picture" prepend-icon="" append-inner-icon="mdi-paperclip"
                                variant="outlined" accept="image/*" @change="handleFileUpload"></v-file-input>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-divider></v-divider>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-btn color="teal" block variant="outlined" to="/admin/membership" size="large">back</v-btn>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-btn v-if="this.membershipId == 'create'" color="teal" block type="submit"
                                size="large">Create</v-btn>
                            <v-btn v-else color="teal" block type="submit" size="large">Update</v-btn>
                        </v-col>
                        <v-col cols="12" v-if="showError">
                            <v-alert type="error" title="Oops, please check your details"
                                text="Please verify your membership details" closable>
                            </v-alert>
                        </v-col>
                    </v-row>
                </v-card-text>

            </v-form>

            <template>
                <Modal v-model="modal.show" :path="modal.path" :title="modal.title" :message="modal.message"
                    :icon="modal.icon" @closeModal="closeModal" />
            </template>

        </v-card>

    </v-row>
</template>



<script>
import { useMembershipStore } from '@/store/membership'
import Modal from '@/components/common/Modal.vue';
import { reactive } from 'vue'

const state = reactive({
    error: 0,
    loading: false,
})

export default {
    setup() {
        const membershipStore = useMembershipStore()

        return {
            membershipStore,
        }
    },
    watch: {
        membershipId(newValue) {
            try {
                if (newValue != null) {
                    this.getMembershipData();
                } else {
                    console.log("test");
                    this.membershipData = this.membershipStore.$state
                    console.log(this.membershipData);
                }

            } catch (error) {
                console.error("Error getting user by ID", error)
            }

        }
    },
    mounted() {
        if (this.membershipId == "create") {
            this.membershipData = this.membershipStore.$state
            console.log(this.membershipData)
        } else {
            this.getMembershipData();
        }

        console.log(this.membershipData)
    },
    data() {
        return {
            rules: [v => (!!v) || 'This field is required'],
            pictureRules: [v => (v == null) || 'This field is required'],
            feeRules: [
                v => (!!v) || 'This field is required',
                v => (v >= 0) || 'Base fee have to be more than or equal to 0',
            ],
            picture: this.membershipStore.Picture,
            membershipData: {
                title: null,
                visibility: null,
                description: null,
                type: null,
                basefee: null,
                setupfee: null,
                picture: null,
            },
            modal: {
                show: false,
                type: "success",
                icon: "mdi-check-circle",
                title: "Update successful",
                message: "Your membership has been successfully updated!",
                path: "/"
            },
            showError: false,
        }
    },
    computed: {
        membershipId() {
            return this.$route.params.id || null;
        },
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
                    this.membershipData.picture = reader.result;
                };

                this.picture = file
            }
        },
        closeModal() {
            this.modal.show = false
        },

        async getMembershipData() {
            try {
                const response = await this.membershipStore.getMembershipById(this.membershipId)
                if (response.status == 200) {
                    this.membershipData.title = response.data[0].Title
                    this.membershipData.visibility = response.data[0].Visibility
                    this.membershipData.description = response.data[0].Description
                    this.membershipData.type = response.data[0].Type
                    this.membershipData.basefee = response.data[0].BaseFee
                    this.membershipData.setupfee = response.data[0].SetupFee
                    this.membershipData.picture = response.data[0].Picture
                    this.membershipData.paypalPlanId = response.data[0].PayPalPlanId
                }
            } catch (error) {
                console.error("Error retrieving user info", error);
            }
        },

        validateForm() {
            state.error = 0;

            if (this.membershipData.title == "" || this.membershipData.title == null) { state.error++; }
            if (this.membershipData.description == "" || this.membershipData.description == null) { state.error++; }
            if (this.membershipData.type == "" || this.membershipData.type == null) { state.error++; }
            if (this.membershipData.basefee == null || this.membershipData.basefee <= 0) { state.error++; }
            if (this.membershipData.picture == null) { state.error++; }
            if (this.membershipData.picture != null) { this.pictureRules = []; }

            if (state.error == 0) {
                this.showError = false
                this.updateMembership();
            } else {
                console.log("Invalid form")
                console.log("Number of errors: " + state.error)
                this.showError = true
            }

        },

        async updateMembership() {

            console.log(JSON.stringify({
                Title: this.membershipData.title,
                Description: this.membershipData.description,
                Type: this.membershipData.type,
                BaseFee: this.membershipData.basefee,
                Picture: this.membershipData.picture
            }))
            try {

                // uri to uploaded picture
                if (this.picture != this.membershipStore.Picture) {
                    const uploadResponse = await this.membershipStore.uploadPicture(this.picture)
                    this.membershipData.picture = uploadResponse.s3Uri
                    console.log(this.membershipData.picture);
                }


                let tempmembershipId = this.membershipId
                if (this.membershipId == "create") {
                    tempmembershipId = this.membershipStore.membershipId
                    console.log("creating: new membership")
                    // trigger update profile form through this API and put in variables
                    // Edit the function below accordingly, e.g. update the parameters, etc
                    await this.membershipStore.createMembership({
                        title: this.membershipData.title,
                        description: this.membershipData.description,
                        type: this.membershipData.type,
                        basefee: this.membershipData.basefee,
                        picture: this.membershipData.picture
                    }).then((response) => {
                        if (response.status == 200) {

                            console.log(response.data);

                            // Show success modal
                            this.modal.show = true
                            this.modal.message = "Your membership has been successfully updated!"
                            this.modal.path = "/admin/membership"
                            this.membershipStore.$state = {
                                membershipId: null,
                                title: null,
                                description: null,
                                type: null,
                                basefee: null,
                                picture: null,
                            }

                        }
                    })

                } else {
                    console.log("Updating: " + tempmembershipId)
                    // trigger update profile form through this API and put in variables
                    // Edit the function below accordingly, e.g. update the parameters, etc
                    await this.membershipStore.updateMembershipById({
                        title: this.membershipData.title,
                        description: this.membershipData.description,
                        type: this.membershipData.type,
                        basefee: this.membershipData.basefee,
                        picture: this.membershipData.picture
                    }, tempmembershipId).then((response) => {
                        if (response.status == 200) {

                            console.log(response.data);

                            // Show success modal
                            this.modal.show = true
                            this.modal.path = "/admin/membership"

                        }
                    })
                }

            } catch (error) {
                console.log("Membership error: ", error);
            }
        }
    },

    components: { Modal }
}
</script>
