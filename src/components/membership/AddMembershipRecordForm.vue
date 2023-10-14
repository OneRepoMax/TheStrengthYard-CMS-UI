<template>
    <v-dialog max-width="800px" @input="$emit('input', $event)">
        <v-card title="Add Membership Record">
            <template v-slot:append>
                <v-btn icon="$close" variant="text" @click="$emit('closeModal')"></v-btn>
            </template>
            <v-divider></v-divider>
            <v-form ref="form" validate-on="submit">
                <v-card-text>

                    <v-row>
                        <v-col cols="12">
                            <v-autocomplete label="Select Membership" :items="membershipDropdown" item-title="Title"
                                item-value="MembershipTypeId" v-model="selectedMembershipId" hide-details="auto" clearable
                                :rules="membershipIdRules"></v-autocomplete>
                        </v-col>
                        <template v-if="selectedMembership">
                            <v-col cols="12">
                                <v-card variant="outlined">
                                    <v-img max-height="120px" cover :src="selectedMembership.Picture"></v-img>
                                    <v-card-title>
                                        <strong>{{ selectedMembership.Title }}</strong>
                                    </v-card-title>
                                    <v-card-subtitle class="text-wrap">
                                        {{ selectedMembership.Description }}
                                    </v-card-subtitle>
                                    <v-card-text class="d-flex flex-wrap">
                                        <span class="me-3 mb-3"><v-chip> Membership Id: {{
                                            selectedMembership.MembershipTypeId }}
                                            </v-chip></span>
                                        <span class="me-3 mb-3">
                                            <v-chip> Base Fee: ${{ selectedMembership.BaseFee }} </v-chip>
                                        </span>
                                        <span class="me-3 mb-3">
                                            <v-chip prepend-icon="mdi-refresh">
                                                Recurring {{ selectedMembership.Type }}
                                            </v-chip>
                                        </span>
                                    </v-card-text>
                                </v-card>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-text-field type="date" v-model="startDate" density="compact" hide-details="auto"
                                    align="center" label="Start Date" required :rules="startDateRules">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field type="date" v-model="endDate" density="compact" hide-details="auto"
                                    align="center" label="End Date" required :rules="endDateRules">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-select
                                    :items="['Active', 'Pending Payment', 'Paused', 'Expired', 'Terminated', 'Inactive']"
                                    hide-details="auto" v-model="status" label="Status" :rules="statusRules"
                                    required></v-select>
                            </v-col>
                        </template>

                    </v-row>
                </v-card-text>


                <v-divider></v-divider>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" md="6">
                            <v-btn block variant="outlined" :color="this.color" class="mb-5"
                                @click="$emit('closeModal')">No</v-btn>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-btn block :color="this.color" class="mb-5" type="submit" @click.prevent="submitForm">Add
                                Record</v-btn>
                        </v-col>
                        <v-col cols="12" v-if="showError">
                            <v-alert type="error" title="Unable to add membership record"
                                text="Please check if current user has the same membership record" closable>
                            </v-alert>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-form>
        </v-card>
    </v-dialog>
</template>
    
<script>

import { useMembershipStore } from '@/store/membership'

export default {
    props: {
        value: Boolean,
        userId: Number,
        color: String,
    },
    setup() {
        const membershipStore = useMembershipStore()
        return { membershipStore }
    },
    mounted() {
        this.getMembership()
    },
    data() {
        return {
            membershipDropdown: [],
            selectedMembershipId: null,
            selectedMembership: null,
            startDate: null,
            endDate: null,
            status: null,
            isFormValid: false,
            showError: false,
        }
    },
    computed: {
        membershipIdRules() {
            return [
                (v) => !!v || 'Membership ID is required',
            ];
        },
        startDateRules() {
            return [
                (v) => !!v || 'Start Date is required',
            ];
        },
        statusRules() {
            return [
                (v) => !!v || 'Status is required'
            ];
        },
        endDateRules() {
            return [
                (v) => !!v || 'End Date is required',
                (v) => (this.startDate ? v > this.startDate : true) || 'End Date must be after Start Date',
            ];
        },
    },
    methods: {
        async getMembership() {
            const response = await this.membershipStore.getAllMembership();

            if (response.status == 200) {
                this.membershipDropdown = response.data
            }

        },
        async addMembershipRecord() {
            const payload = {
                userId: this.userId,
                membershipTypeId: this.selectedMembershipId,
                startDate: this.startDate,
                endDate: this.endDate,
                status: this.status
            }
            try {
                const response = await this.membershipStore.addMembershipRecord(payload);

                if (response.status == 200) {
                    console.log(
                        response.data
                    );
                    this.$emit('action')
                }
            } catch (error) {
                this.showError = true
            }

        },
        async submitForm() {
            await this.$refs.form.validate();

            const isValid = this.$refs.form.isValid

            if (!isValid) {
                // Form has validation errors, do not submit
                console.log('Form has validation errors');
            } else {
                // Form is valid, submit the data
                this.addMembershipRecord();
            }
        },
    },
    watch: {
        selectedMembershipId(newValue) {
            for (const membership of this.membershipDropdown) {
                if (membership.MembershipTypeId === newValue) {
                    this.selectedMembership = membership;
                }
            }
            return null;
        }
    }
}
</script>
