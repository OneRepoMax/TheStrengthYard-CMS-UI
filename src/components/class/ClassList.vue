<template>
    <v-expansion-panels class="pa-1">
        <v-expansion-panel v-for="classDetails in this.classList" :key="classDetails.ClassId"
            :value="classDetails.ClassId">
            <v-expansion-panel-title @click.prevent="updateMapping(classDetails.ClassId)">
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
                    <p class="text-h6 mb-2"><v-icon class="me-3" size="small">mdi-note-text-outline</v-icon>Description
                    </p>
                    {{ classDetails.Description }}
                </v-card-text>
                <v-divider></v-divider>
                <v-card-text>
                    <!-- Skeleton loaders -->
                    <template v-if="loading">
                        <v-card-text class="px-8">
                            <v-skeleton-loader type="list-item-three-line" :loading="loading"></v-skeleton-loader>
                        </v-card-text>
                    </template>
                    <MembershipMapping v-if="!loading" :mappingList="this.mappingList" :classId="classDetails.ClassId" @reload-data="getMembershipClassMappingsByClassID"/>
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
import MembershipMapping from '@/components/membership/MembershipMapping.vue'
import Modal from '@/components/common/ModalWarning.vue';
import { useClassStore } from '@/store/class'
import { useMembershipStore } from '@/store/membership'

export default {
    props: {
        classList: Object,
    },

    components: {
        MembershipMapping,
        Modal,
    },

    setup() {
        const classStore = useClassStore()
        const membershipStore = useMembershipStore();

        return {
            classStore,
            membershipStore
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
            },
            mappingList: []
        }
    },
    mounted() {
        this.getMembershipClassMappingsByClassID(this.classId);
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
        },

        updateMapping(classId){
            this.getMembershipClassMappingsByClassID(classId);
        },

        async getMembershipClassMappingsByClassID(classId) {
            this.loading = true;
            
            this.mappingList = []
            const response = await this.membershipStore.getMembershipClassMappingsByClassID(classId);
            this.loading = false;

            if (response.status != 200) {
                console.log("No membership record found");
            } else {
                this.mappingList = response.data
            }
            console.log(this.mappingList)
        },
    }
}
</script>