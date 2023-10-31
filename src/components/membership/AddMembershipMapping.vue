<template>
    <v-dialog max-width="800px" @input="$emit('input', $event)">
        <v-card title="Add Membership Mapping">
            <template v-slot:append>
                <v-btn icon="$close" variant="text" @click="$emit('closeModal')"></v-btn>
            </template>
            <v-divider></v-divider>
            <v-form ref="form" validate-on="submit">
                <v-card-text>
                    <v-autocomplete 
                        label="Select Membership" 
                        :items="membershipDropdown" 
                        item-title="Title"
                        item-value="MembershipTypeId" 
                        v-model="selectedMembershipId" 
                        hide-details="auto" 
                        clearable
                        :rules="membershipRules">
                    </v-autocomplete>
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
                                Mapping</v-btn>
                        </v-col>
                        <v-col cols="12" v-if="showError">
                            <v-alert type="error" title="Unable to add membership mapping"
                                text="Please check if current class has existing membership mapping" closable>
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
        classId: Number,
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
            showError: false,
        }
    },
    computed: {
        membershipRules() {
            return [
                (v) => !!v || 'Membership is required',
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

        async addMembershipMapping() {
            this.showError = false
            const payload = {
                MembershipTypeId: this.selectedMembershipId,
                ClassId: this.classId,
            }

            console.log(payload)
            try {
                const response = await this.membershipStore.createMembershipClassMapping(payload);

                if (response.status == 200) {
                    console.log(
                        response.data
                    );
                    this.$emit('action')
                } else if (response.status == 408) {
                    this.showError = true
                }
            } catch (error) {
                console.error("An error occurred during add mapping API request:", error)
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
                this.addMembershipMapping();
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
