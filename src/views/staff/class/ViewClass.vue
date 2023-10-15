<template>
    <v-container fluid class="mx-auto">
        <v-card max-width="1200px" class="mx-auto">
            <v-tabs v-model="tab" bg-color="black">
                <v-tab value="class">Class</v-tab>
                <v-tab value="class-slot">Class Slot</v-tab>
            </v-tabs>

            <v-card-text>
                <v-window v-model="tab">
                    <v-window-item value="class" id="class">
                        <v-card-text>
                            <v-row align="center" dense>
                                <v-col cols="8">
                                    <v-card-title>Classes</v-card-title>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="2">
                                    <v-btn block color="grey-darken-4" @click="createClass('create')">Create
                                        Class</v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-divider></v-divider>

                        <!-- Skeleton loaders -->
                        <template v-if="loading">
                            <v-card-text class="px-8">
                                <v-skeleton-loader type="list-item-three-line" :loading="loading" v-for="index in 10"
                                    :key="index"></v-skeleton-loader>
                            </v-card-text>
                        </template>
                        <v-card-item class="px-2">
                            <!-- Manage class page -->
                            <ClassList :classList="displayedClass" />
                        </v-card-item>


                        <v-divider></v-divider>

                        <v-card-text class="px-8">
                            <v-row>
                                <v-col cols="12" sm="2" class="d-flex justify-end align-center">
                                    <v-select label="Results per page:" :items="[10, 50, 100]" v-model="classPerPage"
                                        variant="outlined" max-width="40px" density="compact"
                                        hide-details="auto"></v-select>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col class="d-flex justify-end align-center">
                                    <v-pagination v-model="page" :length="totalPages"></v-pagination>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-window-item>

                    <v-window-item value="class-slot">
                        <!-- Class Slot -->

                        <v-card-text>
                            <v-row align="center" dense>
                                <v-col cols="8">
                                    <v-card-title id="class-slot">Class Slots</v-card-title>
                                </v-col>
                                <v-spacer></v-spacer>

                                <v-col cols="2">
                                    <v-btn block color="grey-darken-4" @click="createClassSlot('create')">Create
                                        Slot</v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-divider></v-divider>

                        <!-- Skeleton loaders -->
                        <template v-if="loading">
                            <v-card-text class="px-8">
                                <v-skeleton-loader type="list-item-three-line" :loading="loading" v-for="index in 10"
                                    :key="index"></v-skeleton-loader>
                            </v-card-text>
                        </template>


                        <!-- Manage class page -->
                        <ClassSlotList :classSlotList="displayedClassSlot" @reload-data="this.getClassSlotList()"/>

                        <v-divider></v-divider>

                        <v-card-text class="px-8">
                            <v-row>
                                <v-col cols="12" sm="2" class="d-flex justify-end align-center">
                                    <v-select label="Results per page:" :items="[10, 50, 100]" v-model="classPerPage"
                                        variant="outlined" max-width="40px" density="compact"
                                        hide-details="auto"></v-select>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col class="d-flex justify-end align-center">
                                    <v-pagination v-model="page" :length="totalPages"></v-pagination>
                                </v-col>
                            </v-row>
                        </v-card-text>

                    </v-window-item>
                </v-window>
            </v-card-text>
        </v-card>




    </v-container>
</template>

<script>

import { useClassStore } from '@/store/class'
import ClassList from "@/components/class/ClassList.vue"
import ClassSlotList from "@/components/class/ClassSlotList.vue"

export default {
    components: {
        ClassList,
        ClassSlotList
    },
    setup() {
        const classStore = useClassStore();
        return { classStore }
    },
    data() {
        return {
            ClassList: [],
            ClassSlotList: [],
            names: [],
            loading: false,
            searchValue: null,
            page: 1,
            pageLength: 1,
            classPerPage: 10,
            tab: null,
        }
    },
    watch: {
        searchValue() {
            this.page = 1;
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

        displayedClassSlot() {
            const startIndex = (this.page - 1) * this.classPerPage;
            const endIndex = startIndex + this.classPerPage;

            if (this.searchValue != null) {

                const filteredClassSlot = this.ClassSlotList.filter(classSlotDetails =>
                    `${classSlotDetails.ClassName}`
                        .toLowerCase()
                        .includes(this.searchValue.toLowerCase())
                );
                return filteredClassSlot.slice(startIndex, endIndex);
            }
            return this.ClassSlotList.slice(startIndex, endIndex);
        },

    },

    mounted() {
        this.getClassList();
        this.getClassSlotList();
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

        async getClassSlotList() {

            this.loading = true;
            const response = await this.classStore.getAllClassSlot();
            this.loading = false;
            if (response.status == 200) {
                this.ClassSlotList = response.data
            }
            if (response.status == 200) {
                this.ClassSlotList = response.data
            }

        },

        createClass(classId) {
            this.$router.push(`/admin/class/${classId}`)
        },
        createClassSlot(classSlotId) {
            this.$router.push(`/admin/class-slot/${classSlotId}`)
        },
    }
}
</script>

<style lang="scss" scoped></style>