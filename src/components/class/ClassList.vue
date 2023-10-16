<template>
    <v-expansion-panels class="pa-1">
        <v-expansion-panel v-for="classDetails in this.classList" :key="classDetails.ClassId"
            :value="classDetails.ClassId">
            <v-expansion-panel-title>
                <v-row align="center" dense>
                    <v-col cols="12" md="6">
                        <p class="lh-lg">{{ classDetails.ClassName }}</p>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-chip prependIcon="mdi-account-multiple">{{ classDetails.MaximumCapacity }}</v-chip>
                    </v-col>
                    <v-col cols="12" md="1" class="d-flex ms-auto me-5">
                        <v-btn  variant="text" icon="mdi-square-edit-outline" size="small" class="me-1"
                            @click.prevent="editClass(classDetails.ClassId)"></v-btn>
                        <v-btn variant="text" icon="mdi-delete" color="red" size="small"
                            @click.prevent="showModal(classDetails.ClassId)"></v-btn>
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
                <v-card-text>
                    <v-row>
                        <p>{{ classDetails.Description }} </p><br>
                    </v-row>

                </v-card-text>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>

    <!-- Add the expansion to see who are in the class   -->
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

        async deleteClass(classId) {
            console.log("deleting: " + classId)
            try {
                await this.classStore.deleteClassById(classId).then((response) => {
                    if (response.status == 200) {
                        location.reload()
                        console.log(response.data)
                        this.modal.show = false
                    }
                })
            } catch (error) {
                console.error("Error deleting class", error);
            }
        },
        showModal(id) {
            this.modal.show = true
            this.classId = id
        },
        closeModal() {
            this.modal.show = false
        },
        actionModal() {
            this.deleteClass(this.classId)
        }
    }
}
</script>