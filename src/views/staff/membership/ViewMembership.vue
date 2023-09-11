<template>
    <v-container fluid class="mx-auto">
        <v-card max-width="1280px" class="mx-auto">
            <v-card-text>
                <v-row align="center" dense>
                    <v-col cols="12" md="5">
                        <v-card-title>Manage Memberships</v-card-title>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="12" md="3" >
                        <v-autocomplete density="compact" variant="outlined" clearable prepend-inner-icon="mdi-magnify"
                        v-model="searchValue" :items="titles" hide-details="auto" class="me-3 w-100" label="Search membership"></v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-btn class="d-none d-md-block" variant="outlined" @click="createMembership('create')">Create membership</v-btn>
                        <v-btn block class="d-block d-sm-none" variant="outlined" @click="createMembership('create')">Create membership</v-btn>
                        
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider></v-divider>

            <!-- Skeleton loaders -->
            <template v-if="loading">
                <v-card-text class="px-8">
                    <v-skeleton-loader 
                        type="list-item-three-line"
                        :loading="loading"
                        v-for="index in 10" :key="index"
                    ></v-skeleton-loader>
                </v-card-text>
            </template>


            <!-- Manage membership page -->
            <MembershipList :membershipList="displayedMembership"/>

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

import { useMembershipStore } from '@/store/membership'
import MembershipList from "@/components/membership/MembershipList.vue"

export default {
    components: {
        MembershipList
    },
    setup () {
        const membershipStore = useMembershipStore();
        return { membershipStore }
    },
    data() {
        return {
            MembershipList: [],
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
        }
    },
    computed: {
        displayedMembership() {
            const startIndex = (this.page - 1) * this.membershipPerPage;
            const endIndex = startIndex + this.membershipPerPage;

            if (this.searchValue != null) {

                const filteredMembership = this.MembershipList.filter(membership =>
                    `${membership.Title}`
                        .toLowerCase()
                        .includes(this.searchValue.toLowerCase())
                );
                return filteredMembership.slice(startIndex, endIndex);
            }
            return this.MembershipList.slice(startIndex, endIndex);
        },
        totalPages() {
            return Math.ceil(
                (this.searchValue
                    ? this.displayedMembership.length
                    : this.MembershipList.length) / this.membershipPerPage
            );
        },
    },
    mounted() {
        this.getMembershipList();
    },
    methods: {
        async getMembershipList() {

            try {
                this.loading = true;
                const response = await this.membershipStore.getAllMembership();
                this.loading = false;
                if (response == null || response.status != 200) {
                    return
                } else {
                    if (response.status == 200) {
                        this.MembershipList = response.data
                        console.log(this.MembershipList)
                        for (const membership of this.MembershipList) {
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

        createMembership(membershipId) {
            // console.log(membershipId)
            this.$router.push(`/admin/membership/${membershipId}`)
        },
    }
}
</script>

<style lang="scss" scoped>

</style>