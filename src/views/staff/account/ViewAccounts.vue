<template>
    <v-container fluid>
        <v-card max-width="1280px" class="mx-auto">
            <v-card-text>
                <v-row align="center" dense>
                    <v-col cols="12" md="5">
                        <v-card-title>Manage Client Accounts</v-card-title>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="12" md="5" class="d-flex justify-end align-center">
                        <v-autocomplete density="compact" variant="outlined" clearable prepend-inner-icon="mdi-magnify"
                            v-model="searchValue" :items="fullNames" hide-details="auto" class="me-3" label="Search account name"></v-autocomplete>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider></v-divider>

            <!-- Skeleton loaders -->
            <template v-if="loading">
                <v-card-text class="px-8">
                    <v-skeleton-loader 
                        type="list-item-avatar-three-line"
                        :loading="loading"
                        v-for="index in 10" :key="index"
                    ></v-skeleton-loader>
                </v-card-text>
            </template>

            <ClientAccountList :clientAccounts="displayedAccounts" />

            <v-divider></v-divider>
            <v-card-text class="px-8">
                <v-row>
                    <v-col cols="12" sm="2" class="d-flex justify-end align-center">
                        <v-select label="Results per page:" :items="[10, 50, 100]" v-model="accountsPerPage"
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

import { useUserStore } from "@/store/user";
import ClientAccountList from "@/components/account/ClientAccountList"


export default {
    components: {
        ClientAccountList
    },
    setup() {
        const userStore = useUserStore();
        return { userStore }
    },
    data() {
        return {
            clientAccounts: [],
            fullNames: [],
            loading: false,
            searchValue: null,
            page: 1,
            pageLength: 1,
            accountsPerPage: 10,
        }
    },
    watch: {
        searchValue(){
            this.page=1;
        },
        accountsPerPage(){
            this.page=1;
        }
    },
    computed: {
        displayedAccounts() {
            const startIndex = (this.page - 1) * this.accountsPerPage;
            const endIndex = startIndex + this.accountsPerPage;

            if (this.searchValue != null) {

                const filteredAccounts = this.clientAccounts.filter(account =>
                    `${account.FirstName} ${account.LastName}`
                        .toLowerCase()
                        .includes(this.searchValue.toLowerCase())
                );
                return filteredAccounts.slice(startIndex, endIndex);
            }
            return this.clientAccounts.slice(startIndex, endIndex);
        },
        totalPages() {
            return Math.ceil(
                (this.searchValue
                    ? this.displayedAccounts.length
                    : this.clientAccounts.length) / this.accountsPerPage
            );
        },
    },
    mounted() {
        this.getAllClientAccount();
    },
    methods: {
        async getAllClientAccount() {

            try {
                this.loading = true;
                const response = await this.userStore.getAllUser();
                this.loading = false;
                if (response == null || response.status != 200) {
                    return
                } else {
                    if (response.status == 200) {
                        this.clientAccounts = response.data
                        // Populate first name for search
                        for (const account of this.clientAccounts) {
                            const fullName = `${account.FirstName} ${account.LastName}`;
                            if (this.fullNames.indexOf(fullName) === -1) {
                                this.fullNames.push(fullName);
                            }
                        }
                    }
                }

                return

            } catch (error) {
                console.error("Error getting client accounts", error);
            }


            return

        }
    }
}
</script>

<style lang="scss" scoped></style>