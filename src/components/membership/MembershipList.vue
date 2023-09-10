<template>
    <v-expansion-panels variant="popout" class="pa-4" >
        <v-expansion-panel v-for="membership in this.membershipList" :key="membership.MembershipTypeId" :value="membership.MembershipTypeId">
            <v-expansion-panel-title>
                <v-row align="center" class="spacer" dense>
                    <v-col cols="12" md="6">
                        <strong>{{ membership.Title }}</strong>
                    </v-col>
                    <v-col cols="12" md="1">
                        <p>{{ membership.Type }}</p>
                    </v-col>
                    <v-col cols="12" md="1">
                        <p>${{ membership.BaseFee }}</p>
                    </v-col>
                    <v-col  cols="12" md="2">
                        <v-btn block prepend-icon="mdi-square-edit-outline" color="amber" size="small" @click.prevent="editMembership(membership.MembershipTypeId)">Edit</v-btn>
                    </v-col>
                    <v-col cols="12" md="2" align="right">
                        <v-btn block prepend-icon="mdi-delete" color="red" size="small" @click.prevent="showModal(membership.MembershipTypeId)">Delete</v-btn>
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
                        <v-col cols="12" md="3">
                            <v-img :src="membership.Picture" max-height="80px"></v-img>
                        </v-col>
                        <v-col cols="12" md="9">
                            <strong>Description: </strong><br>
                            <p>{{ membership.Description }} </p>
                        </v-col>
                    </v-row>
                    
                </v-card-text>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>

    <template>
        <Modal v-model="modal.show" :title="modal.title" 
        :message="modal.message" :icon="modal.icon" 
                    @closeModal="closeModal" @action="actionModal" :color="modal.color" />
    </template>
</template>



<script>

import Modal from '@/components/common/ModalWarning.vue';
import { useMembershipStore } from '@/store/membership'

export default {
    props: {
        membershipList: Object,
    },

    components: { Modal },

    setup() {
        const membershipStore = useMembershipStore()

        return {
            membershipStore,
        }
    },

    data() {
        return {
            membershipId: null,
            loading: false,
            modal: {
                show: false,
                type: "success",
                icon: "mdi-alert",
                title: "Confirm deletion?",
                message: "This action cannot be undone",
                path: "/admin/membership",
                color: "red"
            }
        }
    },
    methods: {
        editMembership(membershipId) {
            console.log(membershipId)
            this.$router.push(`/admin/membership/${membershipId}`)
        },

        async deleteMembership(membershipId) {
            console.log("deleting: " + membershipId)
            try {
                 await this.membershipStore.deleteMembershipById(membershipId).then((response) => {
                    if (response.status == 200){
                        location.reload()
                        console.log(response.data)
                        this.modal.show = false
                    }
                 })
            } catch (error) {
                console.error("Error deleting membership", error);
            }
        },
        showModal(id) {
            this.modal.show = true
            this.membershipId = id
        },
        closeModal() {
            this.modal.show = false
        },
        actionModal() {
            this.deleteMembership(this.membershipId)
        }
    }
  }
</script>