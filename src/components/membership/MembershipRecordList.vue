<template>
    <!-- No membership placeholder -->
    <v-alert v-if="this.membershipRecord.length == 0" type="info" title="There's no membership record found for this user"
        prepend-icon="mdi-information-outline">
    </v-alert>
    <template v-if="this.membershipRecord.length > 0">

        <v-row no-gutters>
            <v-col>
                <h5 class="text-h5">Membership Record</h5>
                <div>All membership record listed in this account.</div>
            </v-col>
            <v-col class="hidden-xs-only text-left" cols="12" md="2" v-if="!membershipRecordForm.show">
                <v-btn block prepend-icon="mdi-plus" color="light-blue" size="small"
                    @click.prevent="membershipRecordForm.show = true">Add</v-btn>
            </v-col>
        </v-row>

        <v-divider class="my-3"></v-divider>
        <v-table density="compact">
            <thead>
                <tr>
                    <th class="text-left font-weight-bold">
                        Membership Title
                    </th>
                    <th class="text-left font-weight-bold">
                        Type
                    </th>
                    <th class="text-left font-weight-bold">
                        Start Date
                    </th>
                    <th class="text-left font-weight-bold">
                        End Date
                    </th>
                    <th class="text-left font-weight-bold">
                        Fee
                    </th>
                    <th class="text-left font-weight-bold">
                        Status
                    </th>
                    <th class="text-left font-weight-bold" v-if="!membershipRecordForm.show">
                        Log
                    </th>
                    <th class="text-left font-weight-bold" v-if="!membershipRecordForm.show">
                        Edit
                    </th>
                    <th class="text-left font-weight-bold" v-if="!membershipRecordForm.show">
                        Delete
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(membershipData, index) in this.membershipRecord" :key="membershipData.MembershipRecordId">
                    <td>
                        {{ membershipData.Membership.Title }}
                    </td>
                    <td>{{ membershipData.Membership.Type }}</td>
                    <td>
                        <template v-if="membershipRecordForm.editIndex === index">
                            <v-text-field type="date" v-model="membershipRecordForm.startDate" density="compact"
                                hide-details="auto" align="center">
                            </v-text-field>
                        </template>
                        <template v-else>
                            {{ this.formattedDate(membershipData.StartDate) }}
                        </template>
                    </td>
                    <td>
                        <template v-if="membershipRecordForm.editIndex === index">
                            <v-text-field type="date" v-model="membershipRecordForm.endDate" density="compact"
                                hide-details="auto" align="center">
                            </v-text-field>
                        </template>
                        <template v-else>
                            {{ this.formattedDate(membershipData.EndDate) }}
                        </template>

                    </td>
                    <td>{{ membershipData.Membership.BaseFee }}</td>
                    <td>
                        <template v-if="membershipRecordForm.editIndex === index">
                            <v-select :items="['Active', 'Pending Payment', 'Paused', 'Expired', 'Terminated', 'Inactive']"
                                hide-details="auto" v-model="membershipRecordForm.status" density="compact"></v-select>
                        </template>
                        <template v-else>
                            <v-chip v-if="membershipData.ActiveStatus.toUpperCase() == 'ACTIVE'" color="primary"
                                prepend-icon="mdi-check">
                                {{ membershipData.ActiveStatus }}
                            </v-chip>
                            <v-chip v-if="membershipData.ActiveStatus.toUpperCase() == 'INACTIVE'
                                || membershipData.ActiveStatus.toUpperCase() == 'EXPIRED'
                                || membershipData.ActiveStatus.toUpperCase() == 'PENDING PAYMENT'" color="secondary"
                                prepend-icon="mdi-close">
                                {{ membershipData.ActiveStatus }}
                            </v-chip>
                            <v-chip v-if="membershipData.ActiveStatus.toUpperCase() == 'PAUSED'" color="orange"
                                prepend-icon="mdi-pause">
                                {{ membershipData.ActiveStatus }}
                            </v-chip>
                        </template>
                    </td>
                    <td v-if="!membershipRecordForm.show"><v-btn size="x-small" icon="mdi-open-in-new" variant="text"
                            @click.prevent="showMembershipLog(membershipData)"></v-btn>
                    </td>
                    <td v-if="!membershipRecordForm.show">
                        <v-btn size="x-small" icon="mdi-pencil" variant="text" @click.prevent="editRow(index)"></v-btn>
                    </td>
                    <td v-if="!membershipRecordForm.show">
                        <v-btn size="x-small" icon="mdi-delete" variant="text"
                            @click.prevent="confirmationModal.show = true"></v-btn>
                        <template>
                            <ConfirmationModal v-model="confirmationModal.show" :title="confirmationModal.title"
                                :message="confirmationModal.message" :icon="confirmationModal.icon"
                                @closeModal="closeConfirmationModal" @confirmAction="deleteMembershipRecord(index)" />
                        </template>
                    </td>

                </tr>
            </tbody>
        </v-table>
        <div v-if="membershipRecordForm.show" align="end" class="my-3">
            <v-btn color="red" class="me-3" size="small" @click.prevent="cancelEdit">Cancel</v-btn>
            <v-btn color="black" class="me-3" size="small" prepend-icon="mdi-content-save" @click.prevent="saveEdit(index)"
                :loading="membershipRecordForm.loading">Save</v-btn>
        </div>
        <v-progress-linear v-if="logLoading" indeterminate></v-progress-linear>

    </template>

    <!-- Membership Log Modal -->
    <template v-if="membershipLog.show">
        <MembershipLogModal v-model="membershipLog.show" @closeModal="closeModal" :membershipLog="membershipLog.data"
            :membership="selectedMembershipRecord" @addMembershipLog="addMembershipLog" />
    </template>

    <template>
        <Modal v-model="modal.show" :path="modal.path" :title="modal.title" :message="modal.message" :icon="modal.icon"
            @closeModal="closeCommonModal" :closeOnClick="true" />
    </template>
</template>

<script>

import { useMembershipStore } from '@/store/membership'
import MembershipLogModal from '@/components/membership/MembershipLogModal.vue'
import Modal from '@/components/common/Modal.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'

export default {
    setup() {
        const membershipStore = useMembershipStore();

        return { membershipStore }
    },
    props: {
        membershipRecord: Object
    },
    components: {
        MembershipLogModal,
        Modal,
        ConfirmationModal,
    },
    data() {
        return {
            membershipLog: {
                show: false,
                data: [],
            },
            selectedMembershipRecord: null,
            logLoading: false,
            membershipRecordForm: {
                show: false,
                status: [],
                startDate: null,
                endDate: null,
                membershipRecordId: null,
                loading: false,
                editIndex: -1,
            },
            modal: {
                show: false,
                type: "success",
                icon: "mdi-check-circle",
                title: "",
                message: "",
                path: "/admin/account"
            },
            confirmationModal: {
                show: false,
                type: "danger",
                icon: "mdi-delete",
                title: "Delete Record",
                message: "Are you sure you want to delete the membership record?",
                path: "/admin/account"
            }
        }
    },
    methods: {
        formattedDate(dateInput) {
            const date = new Date(dateInput);
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, "0");
            const day = String(date.getUTCDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        },
        closeModal() {
            this.membershipLog.show = false
        },
        async showMembershipLog(membershipData) {
            this.logLoading = true;
            this.membershipLog.data = []
            this.selectedMembershipRecord = membershipData
            const response = await this.membershipStore.getMembershipLogByMembershipRecordId(membershipData.MembershipRecordId)

            this.logLoading = false;

            if (response.status == 200) {
                this.membershipLog.data = response.data
                this.membershipLog.show = true
            }
        },
        async addMembershipLog(payload) {
            const response = await this.membershipStore.addMembershipLog(payload);

            if (response.status == 200) {
                console.log(response.data);
            }
        },
        editRow(index) {

            // Populate form data 
            console.log(this.membershipRecord[index]);

            this.membershipRecordForm.startDate = this.formattedDate(this.membershipRecord[index].StartDate)
            this.membershipRecordForm.endDate = this.formattedDate(this.membershipRecord[index].EndDate)
            this.membershipRecordForm.status = this.membershipRecord[index].ActiveStatus
            this.membershipRecordForm.membershipRecordId = this.membershipRecord[index].MembershipRecordId

            // Change UI
            this.membershipRecordForm.editIndex = index;
            this.membershipRecordForm.show = true;


        },
        async saveEdit() {
            // Save the edited data and reset the editIndex
            this.membershipRecordForm.editIndex = -1;

            // API Call
            this.membershipRecordForm.loading = true;
            const response = await this.membershipStore.updateMembershipRecord(this.membershipRecordForm);
            this.membershipRecordForm.loading = false;
            if (response.status === 200) {
                this.modal.title = "Update successful"
                this.modal.message = "Membership record has been successfully updated!"
                this.modal.show = true;
            }

        },
        cancelEdit() {
            // Cancel the edit and reset the editIndex
            this.membershipRecordForm.editIndex = -1;
            this.membershipRecordForm.show = false;
            // You may want to reset the edited data as well
        },
        closeCommonModal() {
            this.modal.show = false
            this.$router.go()
        },
        async deleteMembershipRecord(index) {
            this.confirmationModal.show = false;
            console.log(this.membershipRecord[index].MembershipRecordId);
            const response = await this.membershipStore.deleteMembershipRecord(this.membershipRecord[index].MembershipRecordId);
            if (response.status === 200) {
                this.modal.show = true;
                this.modal.message = "Membership record has been deleted!"
            }
        },
        closeConfirmationModal() {
            this.confirmationModal.show = false
        }

    }
}
</script>

<style lang="scss" scoped></style>