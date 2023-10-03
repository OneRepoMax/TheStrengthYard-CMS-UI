<template>
    <v-card-title class="pb-1">Registered Membership</v-card-title>
    <v-card-subtitle class="pt-0">Manage your registered membership</v-card-subtitle>
    <v-slide-group v-model="model" class="pa-4" selected-class="bg-success">
        <v-slide-group-item v-for="membership, index in membershipRecord" :key="index">
            <v-card variant="flat" class="me-2" max-height="300" width="200" @click="showMembershipLog(membership)">
                <v-img class="align-end text-white" max-height="130px" :src="membership.Membership.Picture" cover>
                </v-img>
                <v-card-item class="pt-2 ps-1 pb-0 text-subtitle-2 card-title mb-1">
                    {{ membership.Membership.Title }}
                </v-card-item>
                <v-card-subtitle class="text-caption ps-1 mb-1">
                    <v-icon icon="mdi-calendar" size="15" class="me-1 pb-1"></v-icon>
                    {{ formattedDate(membership.StartDate) }} to
                    {{ formattedDate(membership.EndDate) }}
                </v-card-subtitle>
                <v-card-subtitle class="text-caption ps-1 text-wrap">
                    <StatusChip :status="membership.ActiveStatus" :mobile="true" />•
                    <v-icon color="error" icon="mdi-refresh" size="small"></v-icon>
                    <span class="mx-1">{{ membership.Membership.Type }}</span>
                </v-card-subtitle>
                <v-card-actions v-if="membership.ActiveStatus.toLowerCase()=='pending payment'">
                <v-btn color="primary" variant="tonal" @click.prevent="makePayment(membership)" size="small" block>
                    Make Payment
                </v-btn>
              </v-card-actions>
            </v-card>
        </v-slide-group-item>
    </v-slide-group>
    <!-- Membership Log Modal -->
    <template v-if="membershipLog.show">
        <MembershipLogModal v-model="membershipLog.show" @closeModal="closeModal" :membershipLog="this.membershipLog.data"
            :membership="selectedMembershipRecord" @addMembershipLog="addMembershipLog" />
    </template>
</template>

<script>
import { useMembershipStore } from "@/store/membership";
import MembershipLogModal from "@/components/membership/MembershipLogModal.vue";
import StatusChip from '@/components/common/StatusChip.vue'

export default {
    props: {
        membershipRecord: Array,
    },
    components: {
        StatusChip,
        MembershipLogModal
    },
    setup() {
        const membershipStore = useMembershipStore();
        return { membershipStore };
    },
    data: () => ({
        model: null,
        loading: false,
        selectedMembershipRecord: null,
        membershipLog: {
            show: false,
            data: [],
        },
    }),
    methods: {
        formattedDate(dateInput) {
            const date = new Date(dateInput);
            const year = String(date.getUTCFullYear()).slice(2);
            const month = date.getUTCMonth();
            const day = String(date.getUTCDate());
            return `${day}/${month}/${year}`;
        },
        async showMembershipLog(membershipRecord) {
            this.selectedMembershipRecord = membershipRecord;

            const response =
                await this.membershipStore.getMembershipLogByMembershipRecordId(
                    membershipRecord.MembershipRecordId
                );

            if (response.status == 200) {
                this.membershipLog.data = response.data;
                console.log(this.membershipLog.data);
                this.membershipLog.show = true;
            }
        },
        closeModal() {
            this.membershipLog.show = false;
        },
        getColumnsCount() {
            // Determine the number of columns based on screen width
            return window.innerWidth < 800 ? 1 : 3; // Show 1 card on mobile, 3 cards on larger screens
        },
        handleResize() {
            const isMobileNow = window.innerWidth < 600;
            if (isMobileNow !== this.isMobile) {
                // Screen size has changed, trigger a page reload
                location.reload();
            }
        },
        makePayment(membershipRecord) {
            this.membershipStore.membershipRecord = membershipRecord
            this.membershipStore.selectedMembership = membershipRecord.Membership
            this.$router.push(`/membership/checkout`)
        }
    },
}
</script>
<style scoped>
#card-title {
    line-height: 1.5em;
    height: 3em;
    /* height is 2x line-height, so two lines will display */
    overflow: hidden;
    /* prevents extra lines from being visible */
}
</style>