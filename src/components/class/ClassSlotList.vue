<template>
    <v-expansion-panels variant="popout" class="pa-4">
        <v-expansion-panel v-for="classDetails in this.classList" :key="classDetails.classId"
            :value="classDetails.classId">
            <v-expansion-panel-title>
                <v-row align="center" dense>
                    <v-col cols="12" md="3">
                        <p> {{ classDetails.Class.ClassName}}</p>
                    </v-col>
                    <v-col cols="12" md="3">
                        <p>{{ classDetails.Day }}</p>
                    </v-col>
                    <v-col cols="12" md="4">
                        <p>Start Time: {{ this.formattedTime(classDetails.StartTime) }}</p>
                    </v-col>
                    <v-col cols="12" md="4">
                        <p>End Time: {{ this.formattedTime(classDetails.EndTime) }}</p>
                    </v-col>
                    <v-col cols="12" md="4">
                        <p>{{ classDetails.CurrentCapacity }}</p>
                    </v-col>
                    <!-- <v-col cols="12" md="2">
                        <p>Setup Fee ${{ membership.SetupFee }}</p>
                    </v-col> -->
                   
                    <!-- <v-col cols="12" md="1">
                        <v-chip class="font-weight-medium" size="small">
                            {{ classDetails.Visibility }}
                        </v-chip>
                    </v-col> -->
                    <v-col cols="12" md="1" class="d-flex ms-auto me-5">
                        <v-btn  variant="text" icon="mdi-square-edit-outline" size="small" class="me-2"
                            @click.prevent="editClass(classDetails.classId)"></v-btn>
                        <v-btn variant="text" icon="mdi-delete" color="red" size="small"
                            @click.prevent="showModal(classDetails.ClassSlotId)"></v-btn>
                    </v-col>
                </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <!-- Skeleton loaders -->
                <template v-if="loading">
                    <v-card-text class="px-8">
                        <v-skeleton-loader type="list-item-three-line" :loading="loading"></v-skeleton-loader>
                    </v-card-text>
                </template>
                <!-- <v-card-text>
                    <v-row>
                        <v-col cols="12" md="3">
                            <v-img :src="membership.Picture" height="200px" cover></v-img>
                        </v-col>
                        <v-col cols="12" md="9">
                            <strong>Description </strong><br>
                            <p>{{ membership.Description }} </p><br>
                            <template v-if="membership.PayPalPlanId != null">
                                <strong>PayPal Plan Id </strong><br>
                                <p>{{ membership.PayPalPlanId }} </p>
                            </template>
                        </v-col>

                    </v-row>

                </v-card-text> -->
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>

    <template>
        <Modal v-model="modal.show" :title="modal.title" :message="modal.message" :icon="modal.icon"
            @closeModal="closeModal" @action="actionModal" :color="modal.color" />
    </template>
</template>



<script>

import Modal from '@/components/common/ModalWarning.vue';
import { useClassStore } from '@/store/class'

export default {
    props: {
        classList: Object,
    },

    components: { Modal },

    setup() {
        const classStore = useClassStore()

        return {
            classStore,
        }
    },

    data() {
        return {
            classId: null,
            loading: false,
            modal: {
                show: false,
                type: "success",
                icon: "mdi-alert",
                title: "Confirm deletion?",
                message: "This action cannot be undone",
                path: "/admin/class",
                color: "red"
            }
        }
    },

    methods: {
        editClass(classId) {
            console.log(classId)
            this.$router.push(`/admin/class/${classId}`)
        },
        formattedTime(timeInput){
            const date = new Date(timeInput);

            // Get hours and minutes as two-digit strings
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return hours + minutes;
        },

        async deleteClassSlot(classSlotId) {
            console.log("deleting: Class slot " + classSlotId)
            try {
                await this.classStore.deleteClassSlotById(classSlotId).then((response) => {
                    if (response.status == 200) {
                        location.reload()
                        console.log(response.data)
                        this.modal.show = false
                    }
                })
            } catch (error) {
                console.error("Error deleting Class Slot", error);
            }
        },


        showModal(id) {
            this.modal.show = true
            this.classSlotId = id
        },
        closeModal() {
            this.modal.show = false
        },
        actionModal() {
            this.deleteClassSlot(this.classSlotId)
        }
    }
}
</script>