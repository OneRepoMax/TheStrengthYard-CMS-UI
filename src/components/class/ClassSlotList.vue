<template>
    <!-- Dynamic Toolbar -->
    <v-toolbar v-if="selected.length" :color="selected.length ? 'grey darken-4' : 'deep-purple accent-4'" dark>
        <v-btn icon @click="selected = []">
            <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-toolbar-title>
            {{ `${selected.length} selected` }}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-scale-transition>
            <v-btn icon="mdi-delete" key="delete" v-if="selected.length" @click.prevent="showModal()"></v-btn>
        </v-scale-transition>

    </v-toolbar>
    <v-table>
        <thead>
            <tr class="font-weight-bold">
                <th class="text-left">Class Slot Id</th>
                <th class="text-left">Class Name</th>
                <th class="text-left">Date</th>
                <th class="text-left">Class Time</th>
                <th class="text-left">Capacity</th>
                <th class="text-left" v-if="!selected.length">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="classSlot in this.classSlotList" :key="classSlot.ClassSlotId">
                <td class="font-weight-medium">
                    <v-checkbox-btn v-model="selected" :label="classSlot.ClassSlotId" :value="classSlot.ClassSlotId"
                        class="text-wrap"></v-checkbox-btn>
                </td>
                <td class="font-weight-medium">
                   {{ classSlot.Class.ClassName }}
                       
                </td>
                <td>
                    <v-chip variant="text" prependIcon="mdi-calendar">{{ this.formattedDate(classSlot.StartTime) }}</v-chip>
                </td>
                <td>
                    <v-chip variant="text" prepend-icon="mdi-clock-outline">
                        {{ this.formattedTime(classSlot.StartTime) }} - {{ this.formattedTime(classSlot.EndTime) }}
                    </v-chip>
                </td>
                <td>
                    <v-chip @click.prevent="console.log('hello')" color="classSlot" prependIcon="mdi-account-multiple">{{ classSlot.CurrentCapacity }}/{{
                        classSlot.Class.MaximumCapacity }}</v-chip>
                </td>
                <td v-if="!selected.length">
                    <v-btn variant="text" icon="mdi-delete" color="red" size="small"
                        @click.prevent="showModal(classSlot.ClassSlotId)"></v-btn>
                </td>
            </tr>
        </tbody>
    </v-table>

    <template>
        <ModalWarning v-model="modalWarning.show" :title="modalWarning.title" :message="modalWarning.message"
            :icon="modalWarning.icon" @closeModal="closeModalWarning" @action="actionModal" :color="modalWarning.color" />
    </template>

    <template>
        <Modal v-model="modal.show" :path="modal.path" :title="modal.title" :message="modal.message" :icon="modal.icon"
            :closeOnClick="true" @closeModal="closeModal" />
    </template>
</template>



<script>

import ModalWarning from '@/components/common/ModalWarning.vue';
import Modal from '@/components/common/Modal.vue'
import { useClassStore } from '@/store/class'

export default {
    props: {
        classSlotList: Object,
    },

    components: { ModalWarning, Modal },

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
            selected: [],
            modalWarning: {
                show: false,
                type: "success",
                icon: "mdi-alert",
                title: "Confirm deletion?",
                message: "This action cannot be undone",
                path: "/admin/class",
                color: "red"
            },
            modal: {
                show: false,
                type: "success",
                icon: "mdi-check-circle",
                title: "Delete successful",
                message: "Class slots has been successfully deleted!",
                path: "/admin/class"
            },
        }
    },

    methods: {
        editClass(classSlotId) {
            console.log(classSlotId)
            this.$router.push(`/admin/class-slot/${classSlotId}`)
        },
        formattedTime(timeInput) {
            const date = new Date(timeInput);
            date.setHours(date.getHours() - 8);
            // Get hours and minutes as two-digit strings
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return hours + minutes;
        },
        
        formattedDate(dateInput) {
            const inputDate = new Date(dateInput);
            const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are 0-indexed
            const day = inputDate.getUTCDate().toString().padStart(2, '0');
            return month + '/' + day;
        },

        async deleteClassSlots() {
            console.log("deleting: Class slots " + this.selected)

            console.log(this.selected);

            const response = await this.classStore.deleteClassSlotsById(this.selected)
            this.modalWarning.show = false

            if (response.status == 200) {
                this.modal.show = true
            }

        },
        showModal(classIds) {
            if (classIds) {
                this.selected = [classIds]
            }
            this.modalWarning.show = true
        },
        closeModal() {
            this.modal.show = false
            location.reload();
        },
        closeModalWarning() {
            this.modalWarning.show = false
        },
        async actionModal() {
            await this.deleteClassSlots()
        }
    }
}
</script>