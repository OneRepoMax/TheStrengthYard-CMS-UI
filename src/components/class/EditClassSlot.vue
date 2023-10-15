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
                        <v-col v-if="this.classSlotId == 'create'" cols="12" md="8">
                                <v-autocomplete label="Select Class" :items="classes" item-title="ClassName"
                                item-value="ClassId" v-model="selectedClassId" hide-details="auto" clearable
                                :rules="rules"></v-autocomplete>
                        </v-col>

                        <v-col v-else cols="12" md="7">
                            <v-text-field clearable hide-details="auto" class="mb-3" label="Name"
                                v-model="this.classData.name" required :rules="rules"
                                variant="outlined"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field clearable hide-details="auto" label="Max Capacity"
                                v-model="this.classData.capacity" required :rules="rules" readonly
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
                            <v-text-field clearable hide-details="auto" label="Start Time: 00:00:00"
                                v-model="this.classData.startTime" required :rules="rules"
                                variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field clearable hide-details="auto" label="End Time: 00:00:00"
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
                <Modal v-model="modal.show" :path="modal.path" :title="modal.title" :message="modal.message" :closeOnClick="false"
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

        },

    selectedClassId(newValue){
        if (newValue != null){
            for (const classx of this.classes) {
                if (classx.ClassId === newValue) {
                    this.selectedClass = classx;
                    this.classStore.$state.capacity = classx.MaximumCapacity
                }
            }
            return null;
        }
    },
},
    async mounted() {
        if (this.classSlotId == "create") {
            this.classData = this.classStore.$state
            await this.getClassData();
            
        } else {
            await this.getClassSlotData();
        }
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
            classes: [],
            selectedClassId: null,
            selectedClass: null,
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
            

                if (this.classSlotId == "create") {
                    console.log("creating: new class slot")
                    
                    const response = await this.classStore.createClassSlot(this.classData,this.selectedClassId,this.RecurringUntil).then((response) => {
                        if (response.status == 201) {
                            console.log(response.data);
                            // Show success modal
                            this.modal.show = true
                            this.modal.message = "Your class slot has been created successfully!"
                            this.modal.path = "/admin/class"
                            this.classStore.$state = {
                                classId: null,
                                classSlotId: null,
                                capacity: null,
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
