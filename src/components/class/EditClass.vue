<template>
    <v-row justify="center" class="h-100" align="center">

        <v-card elevation="3" class="pa-5" width="700px">
            <v-card-title class="text-center">
                <v-card-title v-if="this.classId
                    == 'create'">Create Class</v-card-title>
                <v-card-title v-else>Manage Class</v-card-title>
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
                            <v-text-field clearable hide-details="auto" label="Capacity"
                                v-model="this.classData.capacity" required :rules="rules"
                                variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-textarea clearable hide-details="auto" class="mb-3" label="Description"
                                v-model="this.classData.description" required :rules="rules"
                                variant="outlined"></v-textarea>
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
                            <v-btn v-if="this.classId == 'create'" color="teal" block type="submit"
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
        classId(newValue) {
            try {
                if (newValue != null) {
                    this.getClassData();
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
    mounted() {
        if (this.classId == "create") {
            this.classData = this.classStore.$state
            console.log(this.classData)
        } else {
            this.getClassData();
        }

        console.log(this.classData)
    },
    data() {
        return {
            rules: [v => (!!v) || 'This field is required'],
            classData: {
                name: null,
                description: null,
                capacity: null,
            },
            modal: {
                show: false,
                type: "success",
                icon: "mdi-check-circle",
                title: "Create successful",
                message: "Your class has been successfully updated!",
                path: "/"
            },
            showError: false,
        }
    },
    computed: {
        classId() {
            return this.$route.params.id || null;
        },
    },

    methods: {
        closeModal() {
            this.modal.show = false
        },

        async getClassData() {
            try {
                const response = await this.classStore.getClassById(this.classId)
                if (response.status == 200) {
                    this.classData.name = response.data[0].ClassName
                    this.classData.description = response.data[0].Description
                    this.classData.capacity = response.data[0].MaximumCapacity
                }
            } catch (error) {
                console.error("Error retrieving user info", error);
            }
        },

        validateForm() {
            state.error = 0;

            if (this.classData.name == "" || this.classData.name == null) { state.error++; }
            if (this.classData.description == "" || this.classData.description == null) { state.error++; }
            if (this.classData.capacity == "" || this.classData.capacity == null) { state.error++; }

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
                ClassName: this.classData.name,
                Description: this.classData.description,
                MaximumCapacity: this.classData.capacity,
            }))
            try {
            
                let tempclassId = this.classId
                if (this.classId == "create") {
                    tempclassId = this.classStore.classId
                    console.log("creating: new class")
                    // trigger update profile form through this API and put in variables
                    // Edit the function below accordingly, e.g. update the parameters, etc
                    
                    const response = await this.classStore.createClass(this.classData);
                        // Show success modal
                        console.log(response)
                        if(response.status == 201) {
                            this.modal.show = true
                            this.modal.message = "Your class has been created successfully!"
                            this.modal.path = "/admin/class"
                            this.classStore.$state = {
                                classId: null,
                                name: null,
                                description: null,
                                capacity: null,
                        }
                        }
                        


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

            } catch (error) {
                console.log("Class error: ", error);
            }
        }
    },

    components: { Modal }
}
</script>
