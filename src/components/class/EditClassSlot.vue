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
                        <!-- to make this loop through this.classes, allow user to select name through dropdown list -->
                        <v-col v-if="this.classSlotId == 'create'" cols="12" md="8">
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Select Class"
                                v-model="this.classData.name" required :rules="rules"
                                variant="outlined"></v-text-field>
                        </v-col>

                        <v-col v-else cols="12" md="7">
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Name"
                                v-model="this.classData.name" required :rules="rules"
                                variant="outlined"></v-text-field>
                        </v-col>

                        <!-- to make capacity display based on selected class -->
                        <v-col cols="12" md="4">
                            <v-text-field clearable hide-details="auto" label="Max Capacity"
                                v-model="this.classData.capacity" required :rules="rules"
                                variant="outlined"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-select clearable hide-details="auto" label="Day"
                                v-model="this.classData.day" 
                                :items="['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']"
                                required :rules="rules"
                                variant="outlined"></v-select>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field clearable hide-details="auto" label="Start Time: 0000"
                                v-model="this.classData.startTime" required :rules="rules"
                                variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field clearable hide-details="auto" label="End Time: 0000"
                                v-model="this.classData.endTime" required :rules="rules"
                                variant="outlined"></v-text-field>
                        </v-col>
                        <v-col v-if="this.classSlotId == 'create'" cols="12" md="12">
                            <v-text-field hide-details="auto" class="mb-3" label="Recurring Until" type="date"
                                v-model="this.RecurringUntil" required :rules="dobRules" variant="outlined"
                                placeholder="YYYY-MM-DD"></v-text-field>
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
            await this.getClassData();
            console.log(this.classData)
            console.log(this.classes)
            
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
            classes: {
                name: null,
                description: null,
                capacity: null,
            },
            RecurringUntil: null,
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
            classId: null,
        }
    },
    computed: {
        classSlotId() {
            return this.$route.params.id || null;
        },

        // formattedStart: {
        //     get() {
        //         // Assuming timeValue is in "HHMM" format
        //         const hours = this.classData.startTime.substring(0, 2);
        //         const minutes = this.classData.startTime.substring(2, 4);
        //         return `${hours}:${minutes}`;
        //     },
        //     set(newValue) {
        //         // Parse the input string in "HH:MM" format
        //         const [hours, minutes] = newValue.split(":");
        //         if (hours.length === 2 && minutes.length === 2) {
        //         // Update the timeValue with the formatted input
        //         this.classData.startTime = hours + minutes;
        //         }
        //     }
        // },

    },

    methods: {
        closeModal() {
            this.modal.show = false
        },
        async getClassData() {
            try {
                const response = await this.classStore.getAllClass()
                if (response.status == 200) {
                    this.classes = response.data
                }
            } catch (error) {
                console.error("Error retrieving user info", error);
            }
        },

        async getClassSlotData() {
            try {
                this.loading = true
                const response = await this.classStore.getClassSlotById(this.classSlotId)
                this.loading = false
                
                console.log(response.data)
                if (response.status == 200) {
                    //this.classData = response.data
                    this.classId = response.data.Class.ClassId
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


            // try {
            
                let tempclassSlotId = this.classSlotId
                if (this.classSlotId == "create") {
                    tempclassId = this.classStore.classId
                    console.log("creating: new class slot")
                    
                    //need to make select class work, compute max capacity based on selected class
                    //not working yet, need to pass in classId to create, need to get class id based on what classname user select
                    // need to format start and end time to "09:00:00"

                    await this.classStore.createClassSlot(this.classData,this.classId,this.RecurringUntil).then((response) => {
                        if (response.status == 200) {
                            console.log(response.data);

                            // Show success modal
                            this.modal.message = "Your class has been created successfully!"
                            this.modal.path = "/admin/class"
                            this.classStore.$state = {
                                classSlotId: null,
                                day: null,
                                startTime: null,
                                endTime: null,
                            }

                        }
                    })

                } else {
                    console.log("Updating: " + tempclassSlotId)
                    // trigger update profile form through this API and put in variables
                    // Edit the function below accordingly, e.g. update the parameters, etc
                    await this.classStore.updateClassSlotById({
                        day: this.classData.day,
                        startTime: this.classData.startTime,
                        endTime: this.classData.endTime,
                    }, tempclassSlotId).then((response) => {
                        if (response.status == 200) {
                            console.log(response.data);
                            // Show success modal
                            this.modal.show = true
                            this.modal.path = "/admin/class"

                        }
                        else{
                            console.log(response.status)
                            console.log('cannot update')
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
