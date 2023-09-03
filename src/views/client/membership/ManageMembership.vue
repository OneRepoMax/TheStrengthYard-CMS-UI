<template>
    <v-container fluid class="mx-auto" max-width="800px">
        <v-card>
            <!-- <v-card-text>
                <v-row align="center" dense>
                    <v-col cols="12" md="5">
                        <v-card-title>Manage Memberships</v-card-title>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="12" md="5" class="d-flex justify-end align-center">
                        <v-autocomplete density="compact" variant="outlined" clearable prepend-inner-icon="mdi-magnify"
                        v-model="searchValue" :items="titles" hide-details="auto" class="me-3" label="Search membership"></v-autocomplete>
                        <v-btn variant="outlined" @click="createMembership('create')">Create membership</v-btn>
                    </v-col>
                </v-row>
            </v-card-text> -->


            <!-- Manage membership page -->
            <MembershipRecordList :membershipRecordList="displayedMembershipRecord"/>

            <v-divider></v-divider>
            <v-card-text class="px-8">
                <v-row>
                    <v-col cols="12" sm="2" class="d-flex justify-end align-center">
                        <v-select label="Results per page:" :items="[10, 50, 100]" v-model="membershipPerPage"
                            variant="outlined" max-width="40px" density="compact" hide-details="auto"></v-select>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col class="d-flex justify-end align-center">
                        <v-pagination v-model="page" :length="totalPages"></v-pagination>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

    </v-container>
</template>

<script>
// import { useUserStore } from '@/store/user';
import { useMembershipStore } from '@/store/membership'
import MembershipRecordList from "@/components/membership/MembershipRecordList.vue"

export default {
    components: {
        MembershipRecordList
    },
    setup () {
        // const userStore = useUserStore()
        const membershipStore = useMembershipStore();
        return { 
            membershipStore,
            // userStore 
        }
    },
    data() {
        return {
            MembershipRecordList: [],
            titles: [],
            loading: false,
            searchValue: null,
            page: 1,
            pageLength: 1,
            membershipPerPage: 10
        }
    },
    watch: {
        searchValue(){
            this.page=1;
        },
        
    },
    computed: {
        displayedMembershipRecord() {
            const startIndex = (this.page - 1) * this.membershipPerPage;
            const endIndex = startIndex + this.membershipPerPage;

            if (this.searchValue != null) {

                const filteredMembership = this.MembershipRecordList.filter(membership =>
                    `${membership.Title}`
                        .toLowerCase()
                        .includes(this.searchValue.toLowerCase())
                );
                return filteredMembership.slice(startIndex, endIndex);
            }
            return this.MembershipRecordList.slice(startIndex, endIndex);
        },
        totalPages() {
            return Math.ceil(
                (this.searchValue
                    ? this.displayedMembership.length
                    : this.MembershipRecordList.length) / this.membershipPerPage
            );
        },
        userId() {
            return this.$route.params.id || null;
        },
    },
    mounted() {
        this.getMembershipRecordList();
    },
    methods: {
        async getMembershipRecordList() {

            try {
                this.loading = true;
                const response = await this.membershipStore.getMembershipLogsByMembershipRecordID(this.membershipStore.userId);
                this.loading = false;
                if (response == null || response.status != 200) {
                    return
                } else {
                    if (response.status == 200) {
                        this.MembershipRecordList = response.data
                        console.log(this.MembershipRecordList)
                        for (const membership of this.MembershipRecordList) {
                            const title = `${membership.Title}`;
                            if (this.titles.indexOf(title) === -1) {
                                this.titles.push(title);
                            }
                        }
                    }
                }

                return

            } catch (error) {
                console.error("An error occurred during get all membership API request:", error);
            }
            
            return

        },

    }
}
</script>

<style lang="scss" scoped>

</style>