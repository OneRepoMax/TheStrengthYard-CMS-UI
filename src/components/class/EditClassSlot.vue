<template>
    <v-row justify="center" class="h-100" align="center">

        <v-card elevation="3" class="pa-5" width="700px">
            <v-card-title class="text-center">
                <v-card-title v-if="this.classSlotId
                    == 'create'">Create Class Slot</v-card-title>
                <v-card-title v-else>Manage Class Slot</v-card-title>
            </v-card-title>
            <v-form ref="form" @submit.prevent="validateForm" validate-on="submit">

                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="8">
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Name"
                                v-model="this.classData.name" required :rules="rules"
                                variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field clearable hide-details="auto" label="Max Capacity"
                                v-model="this.classData.capacity" required :rules="rules"
                                variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field clearable hide-details="auto" label="Day"
                                v-model="this.classData.day" required :rules="rules"
                                variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field clearable hide-details="auto" label="Start Time"
                                v-model="this.classData.startTime" required :rules="rules"
                                variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field clearable hide-details="auto" label="End Time"
                                v-model="this.classData.endTime" required :rules="rules"
                                variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-divider></v-divider>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-btn color="teal" block variant="outlined" to="/admin/class" size="large">back</v-btn>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-btn v-if="this.classSlotId == 'create'" color="teal" block type="submit"
                                size="large">Create</v-btn>
                            <v-btn v-else color="teal" block type="submit" size="large">Update</v-btn>
                        </v-col>
                        <v-col cols="12" v-if="showError">
                            <v-alert type="error" title="Oops, please check your details"
                                text="Please verify your class details" closable>
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
import { useClassStore } from '@/store/class'
import Modal from '@/components/common/Modal.vue';
import { reactive } from 'vue'

const state = reactive({
    error: 0,
    loading: false,
})

export default {
    setup() {
        const classStore = useClassStore()

        return {
            classStore,
        }
    },
    watch: {
        classSlotId(newValue) {
            try {
                if (newValue != null) {
                    this.getClassSlotData();
                } else {
                    console.log("test");
                    this.classData = this.classStore.$state
                    console.log(this.classData);
                }

            } catch (error) {
                console.error("Error getting user by ID", error)
            }

        }
    },
    async mounted() {
        if (this.classSlotId == "create") {
            this.classData = this.classStore.$state
            console.log(this.classData)
        } else {
            await this.getClassSlotData();
            
        }

        console.log(this.classData)
    },
    data() {
        return {
            rules: [v => (!!v) || 'This field is required'],
            classData: {
                name: null,
                capacity: null,
                day: null,
                startTime: null,
                endTime: null,
            },
            modal: {
                show: false,
                type: "success",
                icon: "mdi-check-circle",
                title: "Update successful",
                message: "Your class has been successfully updated!",
                path: "/"
            },
            showError: false,
            loading: false,
        }
    },
    computed: {
        classSlotId() {
            return this.$route.params.id || null;
        },
    },

    methods: {
        closeModal() {
            this.modal.show = false
        },

        async getClassSlotData() {
            try {
                this.loading = true
                const response = await this.classStore.getClassSlotById(this.classSlotId)
                this.loading = false
                
                console.log(response.data)
                if (response.status == 200) {
                    //this.classData = response.data
                    this.classData.name = response.data.Class.ClassName
                    this.classData.capacity = response.data.Class.MaximumCapacity
                    this.classData.day = response.data.Day
                    this.classData.startTime = response.data.StartTime
                    this.classData.endTime = response.data.EndTime
                }   
            } catch (error) {
                console.error("Error retrieving user info", error);
            }
        },

        validateForm() {
            state.error = 0;

            if (this.classData.name == "" || this.classData.name == null) { state.error++; }
            if (this.classData.capacity == "" || this.classData.capacity == null) { state.error++; }
            if (this.classData.day == "" || this.classData.day == null) { state.error++; }
            if (this.classData.startTime == "" || this.classData.startTime == null) { state.error++; }
            if (this.classData.endTime == "" || this.classData.endTime == null) { state.error++; }

            if (state.error == 0) {
                this.showError = false
                this.updateClass();
            } else {
                console.log("Invalid form")
                console.log("Number of errors: " + state.error)
                this.showError = true
            }

        },

        async updateClass() {

            console.log(JSON.stringify({
                Day: this.classData.day,
                StartTime: this.classData.startTime,
                EndTime: this.classData.endTime,
            }))

            // darren stopped here
            // just checked backend and realised another field call RecurringUntil needed for creating class slots..
            // also need updateClassSlotById, createClassSlot on store,
            //also need updateClassSlotById on backend booking.py
            //need to format time for startTime and endTime,
            //day need to use dropdown list

            // try {
            
                let tempclassId = this.classId
                if (this.classId == "create") {
                    tempclassId = this.classStore.classId
                    console.log("creating: new membership")
                    // trigger update profile form through this API and put in variables
                    // Edit the function below accordingly, e.g. update the parameters, etc
                    await this.classStore.createClass(this.classData).then((response) => {
                        if (response.status == 200) {
                            console.log(response.data);

                            // Show success modal
                            this.modal.message = "Your class has been created successfully!"
                            this.modal.path = "/admin/class"
                            this.classStore.$state = {
                                classId: null,
                                name: null,
                                description: null,
                                capacity: null,
                            }

                        }
                    })

                } else {
                    console.log("Updating: " + tempclassId)
                    // trigger update profile form through this API and put in variables
                    // Edit the function below accordingly, e.g. update the parameters, etc
                    await this.classStore.updateClassById({
                        name: this.classData.name,
                        description: this.classData.description,
                        capacity: this.classData.capacity,
                    }, tempclassId).then((response) => {
                        if (response.status == 200) {

                            console.log(response.data);

                            // Show success modal
                            this.modal.show = true
                            this.modal.path = "/admin/class"

                        }
                    })
                }

            // } catch (error) {
            //     console.log("Membership error: ", error);
            // }
        }
    },

    components: { Modal }
}
</script>
