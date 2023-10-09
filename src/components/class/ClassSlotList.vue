<template>
    <v-table>
        <thead>
            <tr class="font-weight-bold">
                <th class="text-left">Class Name</th>
                <th class="text-left">Date</th>
                <th class="text-left">Class Time</th>
                <th class="text-left">Capacity</th>
                <th class="text-left">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="classSlot in this.classSlotList" :key="classSlot.ClassSlotId">
                <td class="font-weight-medium">
                    {{ classSlot.Class.ClassName }}
                </td>
                <td>
                    <v-chip variant="text" prependIcon="mdi-calendar">{{ formattedDate(classSlot.StartTime) }}</v-chip>
                </td>
                <td>
                    <v-chip variant="text" prepend-icon="mdi-clock-outline">
                        {{ this.formattedTime(classSlot.StartTime) }} - {{ this.formattedTime(classSlot.EndTime) }}
                    </v-chip>
                </td>
                <td>
                    <v-chip variant="text" prependIcon="mdi-account-multiple">{{ classSlot.CurrentCapacity }}/{{
                        classSlot.Class.MaximumCapacity }}</v-chip>
                </td>
                <td>
                    <v-btn variant="text" icon="mdi-square-edit-outline" size="small" class="me-2"
                        @click.prevent="editClass(classSlot.ClassSlotId)"></v-btn>
                    <v-btn variant="text" icon="mdi-delete" color="red" size="small"
                        @click.prevent="showModal(classSlot.ClassSlotId)"></v-btn>
                </td>
            </tr>
        </tbody>
    </v-table>

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
        classSlotList: Object,
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
        editClass(classSlotId) {
            console.log(classSlotId)
            this.$router.push(`/admin/class-slot/${classSlotId}`)
        },
        formattedTime(timeInput) {
            const date = new Date(timeInput);

            // Get hours and minutes as two-digit strings
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return hours + minutes;
        },
        // Format to ddd, mm/yy
        formattedDate(dateInput){
            const date = new Date(dateInput);
            const options = { weekday: 'long', year: '2-digit', month: '2-digit' };
            const formatted = date.toLocaleDateString("en-US", options);
            return formatted
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