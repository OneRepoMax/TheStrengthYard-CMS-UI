<template>
    <v-dialog max-width="800px" @input="$emit('input', $event)">
        <v-card elevation="3" title="Membership Log">
            <template v-slot:append>
                <v-btn icon="$close" variant="text" @click="$emit('closeModal')"></v-btn>
            </template>
            <template v-slot:prepend>
                <v-icon prepend-icon class="me-2">mdi-text-account</v-icon>
            </template>
            <v-divider></v-divider>
            <v-img :src="membership.Membership.Picture" cover max-height="130px"></v-img>
            <v-card-title>{{ membership.Membership.Title }}</v-card-title>
            <v-card-subtitle class="d-flex d-cols flex-wrap">
                <v-chip v-if="membership.ActiveStatus.toUpperCase() == 'INACTIVE'
                    || membership.ActiveStatus.toUpperCase() == 'EXPIRED'
                    || membership.ActiveStatus.toUpperCase() == 'PENDING PAYMENT'" color="secondary"
                    prepend-icon="mdi-close" class="me-3 mb-3">
                    {{ membership.ActiveStatus }}
                </v-chip>
                <v-chip v-if="membership.ActiveStatus.toUpperCase() == 'ACTIVE'" color="primary"
                    prepend-icon="mdi-check" class="me-3 mb-3">
                    {{ membership.ActiveStatus }}
                </v-chip>
                <v-chip v-if="membership.ActiveStatus.toUpperCase() == 'PAUSED'" color="orange"
                    prepend-icon="mdi-pause" class="me-3 mb-3">
                    {{ membership.ActiveStatus }}
                </v-chip>
                <v-chip class="me-3 mb-3">
                    {{ membership.Membership.Type }}
                </v-chip>
                <v-chip class="me-3 mb-3">
                    Base Fee: {{ membership.Membership.BaseFee }}
                </v-chip>
                <v-chip class="me-3 mb-3">
                    Membership Record ID: {{ membership.MembershipRecordId }}
                </v-chip>
                <v-chip>
                    <v-icon icon="mdi-calendar" size="18" color="error" class="me-1 pb-1"></v-icon>
                    {{ formattedDate(membership.StartDate) }} to {{ formattedDate(membership.EndDate) }}
                </v-chip>
            </v-card-subtitle>
            <div>
                <v-card-text>
                    <div class="font-weight-bold ms-1 mb-2">
                        Membership Log
                    </div>
                    <v-card color="grey-lighten-4" title="Add membership log" v-if="logForm.show">
                        <template v-slot:append>
                            <v-btn icon="$close" variant="text" @click="logForm.show = false"></v-btn>
                        </template>
                        <v-card-text>
                            <v-row class="d-flex d-cols" dense>
                                <v-col cols="12" sm="3">
                                    <v-select :items="logForm.actionTypes" v-model="input.actionType" label="Action Type"
                                        hide-details="auto" density="compact" class="p-0" variant="solo">
                                    </v-select>
                                </v-col>
                                <v-col cols="12" sm="3">
                                    <v-text-field type="date" density="compact" label="Date" hide-details="auto"
                                        variant="solo">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field label="Description" placeholder="Enter description here..." type="text"
                                        hide-details="auto" density="compact" variant="solo">
                                        <template v-slot:append-inner>
                                            <v-btn size="small" color="black" @click.prevent="addMembershipLog()">
                                                Submit
                                            </v-btn>
                                        </template>
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <v-timeline align="start" density="compact">
                        <v-timeline-item fill-dot class="mb-12" dot-color="orange" size="large" v-if="!logForm.show">
                            <template v-slot:icon>
                                <v-icon>mdi-plus</v-icon>
                            </template>
                            <v-btn class="mx-0" color="orange" block @click.prevent="logForm.show = !logForm.show">
                                New log
                            </v-btn>
                        </v-timeline-item>

                        <v-timeline-item v-for="log in membershipLog" :key="log.MembershipLogId" dot-color="black"
                            size="x-small">
                            <div class="mb-4">
                                <div class="font-weight-normal">
                                    <strong>{{ log.ActionType }}</strong> @ {{ formattedDate(log.Date) }}
                                </div>
                                <div>{{ log.Description }}</div>
                            </div>
                        </v-timeline-item>
                    </v-timeline>
                </v-card-text>
            </div>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        membershipLog: Object,
        membership: Object
    },
    data() {
        return {
            input: {
                actionType: null,
                description: null,
                date: null,
                membershipRecordId: this.membershipLog.MembershipRecordId
            },
            logForm: {
                show: false,
                actionTypes: ['Active', 'Pause', 'Terminate']
            }
        }
    },
    methods: {
        formattedDate(dateInput) {
            const date = new Date(dateInput);
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, "0");
            const day = String(date.getUTCDate()).padStart(2, "0");
            return `${day}-${month}-${year}`;
        },
        formattedInputDate(dateInput) {
            const date = new Date(dateInput);
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, "0");
            const day = String(date.getUTCDate()).padStart(2, "0");
            return `${day}-${month}-${year}`;
        },
        addMembershipLog(){
            this.$emit('addMembershipLog', {...this.input})
        },
        emits: ['closeModal', 'addMembershipLog']
    }
}
</script>

<style lang="scss" scoped></style>