<template>
    <v-container fluid class="mx-auto">
        <v-card max-width="500px" class="mx-auto">
            <v-card-text>
                <v-row align="center" dense>
                    <v-col cols="8">
                        <v-card-title>Classes</v-card-title>
                    </v-col>
                    <v-spacer></v-spacer>
                    <!-- <v-col cols="12" md="3" >
                        <v-autocomplete density="compact" variant="outlined" clearable prepend-inner-icon="mdi-magnify"
                        v-model="searchValue" :items="names" hide-details="auto" class="me-3 w-100" label="Search class"></v-autocomplete>
                    </v-col> -->
                    <v-col cols="2">
                        <v-btn variant="text" icon="mdi-plus-circle" size="large" class="me-2" @click="createClass('create')"></v-btn>
                        <!-- <v-btn class="d-none d-md-block" variant="outlined" @click="createClass('create')">Create class</v-btn> -->
                        <v-btn block class="d-block d-sm-none" variant="outlined" @click="createClass('create')">Create class</v-btn>
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


            <!-- Manage class page -->
            <ClassList :classList="displayedClass"/>

            <v-divider></v-divider>
            
            <v-card-text class="px-8">
                <v-row>
                    <v-col cols="12" sm="2" class="d-flex justify-end align-center">
                        <v-select label="Results per page:" :items="[10, 50, 100]" v-model="classPerPage"
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

import { useClassStore } from '@/store/class'
import ClassList from "@/components/class/ClassList.vue"

export default {
    components: {
        ClassList
    },
    setup () {
        const classStore = useClassStore();
        return { classStore }
    },
    data() {
        return {
            ClassList: [],
            names: [],
            loading: false,
            searchValue: null,
            page: 1,
            pageLength: 1,
            classPerPage: 10
        }
    },
    watch: {
        searchValue(){
            this.page=1;
        }
    },
    computed: {
        displayedClass() {
            const startIndex = (this.page - 1) * this.classPerPage;
            const endIndex = startIndex + this.classPerPage;

            if (this.searchValue != null) {

                const filteredClass = this.ClassList.filter(classDetails =>
                    `${classDetails.ClassName}`
                        .toLowerCase()
                        .includes(this.searchValue.toLowerCase())
                );
                return filteredClass.slice(startIndex, endIndex);
            }
            return this.ClassList.slice(startIndex, endIndex);
        },
        totalPages() {
            return Math.ceil(
                (this.searchValue
                    ? this.displayedClass.length
                    : this.ClassList.length) / this.classPerPage
            );
        },
    },
    mounted() {
        this.getClassList();
    },
    methods: {
        async getClassList() {

            try {
                this.loading = true;
                const response = await this.classStore.getAllClass();
                this.loading = false;
                if (response == null || response.status != 200) {
                    return
                } else {
                    if (response.status == 200) {
                        this.ClassList = response.data
                        console.log(this.ClassList)
                        for (const classDetails of this.ClassList) {
                            const name = `${classDetails.ClassName}`;
                            if (this.names.indexOf(name) === -1) {
                                this.names.push(name);
                            }
                        }
                    }
                }

                return

            } catch (error) {
                console.error("An error occurred during get all class API request:", error);
            }
            
            return

        },

        createClass(classId) {
            this.$router.push(`/admin/class/${classId}`)
        },
    }
}
</script>

<style lang="scss" scoped>

</style>