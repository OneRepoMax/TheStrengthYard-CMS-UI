<template>
    <v-row style="max-width: 1280px;" class="mx-auto">
        <v-col cols="12" v-if="!userStore.verified">
            <v-alert type="warning" border="start" color="amber" title="Your account is not verified! " closable
                elevation="2">
                Please check your email for verification or click <v-chip prepend-icon="mdi-email" variant="tonal"
                    @click="resendVerification()">Resend verification
                    email</v-chip> to verify email address
            </v-alert>
        </v-col>
        <v-col cols="12" lg="8">

            <!-- Skeleton loaders -->
            <v-skeleton-loader class="mb-3" elevation="3" v-if="loading"
                type="card-avatar, article, divider, list-item-three-line, list-item-three-line" loading>
            </v-skeleton-loader>

            <v-skeleton-loader elevation="3" v-if="loading" type="article, list-item-three-line, list-item-three-line"
                loading>
            </v-skeleton-loader>

            <profile-card v-if="!loading" :fullName="userStore.firstName + ' ' + userStore.lastName"
                :emailAddress="userStore.emailAddress" :homeAddress="userStore.homeAddress"
                :membershipRecord="membershipRecord" :displayPicture="userStore.displayPicture" />
            <Classes />

            <PurchaseMembershipSlider />

        </v-col>

        <v-col cols="12" lg="4">


            <!-- Sekelton loaders -->
            <v-skeleton-loader class="mb-3" elevation="3" type="table-heading, list-item-two-line" loading
                v-if="loading"></v-skeleton-loader>
            <v-skeleton-loader class="mb-3" elevation="3"
                type="table-heading	, list-item-avatar-three-line, list-item-avatar-three-line, list-item-avatar-three-line"
                loading v-if="loading"></v-skeleton-loader>

            <template v-if="!loading">
                <org-profile-card />
                <membership-log />
            </template>

        </v-col>

    </v-row>

    <template v-if="modal.show">
        <Modal v-model="modal.show" :path="modal.path" :title="modal.title" :message="modal.message" :icon="modal.icon"
            @closeModal="closeModal" />
    </template>
</template>

<script>

import { useUserStore } from '@/store/user'
import { useMembershipStore } from '@/store/membership'
import ProfileCard from '@/components/home/ProfileCard.vue'
import MembershipLog from '@/components/home/MembershipLog.vue'
import Classes from '@/components/home/Classes.vue'
import OrgProfileCard from '@/components/home/OrgProfileCard.vue'
import Modal from '@/components/common/Modal.vue'
import PurchaseMembershipSlider from "@/components/membership/PurchaseMembershipSlider.vue";


export default {
    name: 'LoginForm',
    setup() {
        const userStore = useUserStore()
        const membershipStore = useMembershipStore()

        return {
            userStore,
            membershipStore
        }
    },
    data() {
        return {
            loading: false,
            modal: {
                show: false,
                message: "",
                type: "",
                icon: "",
                path: "/",
            },
            membershipRecord: []
        }
    },
    mounted() {
        // Get membership record
        this.getMembershipRecord();
    },
    methods: {
        async resendVerification() {
            const response = await this.userStore.resendVerificationEmail(this.userStore.emailAddress);
            if (response.status === 200) {
                this.modal.show = true;
                this.modal.message = "Success! Please check your email for verification"
                this.modal.type = "success"
                this.modal.icon = "mdi-email"
            } else {
                this.modal.show = true;
                this.modal.message = "Error! Please contact administrator"
                this.modal.type = "error"
                this.modal.icon = "mdi-error"
            }
        },
        async getMembershipRecord() {
            this.loading = true
            const response = await this.membershipStore.getMembershipRecordByUserId(this.userStore.userId)
            this.loading = false;

            if (response.status == 200) {
                console.log("Membership Record");
                console.log(response.data);
                this.membershipRecord = response.data
            }
        },
        async getMembership(){

        },
        closeModal() {
            this.modal.show = false
        },
    },

    components: { ProfileCard, MembershipLog, Classes, OrgProfileCard, Modal, PurchaseMembershipSlider }

}




</script>
