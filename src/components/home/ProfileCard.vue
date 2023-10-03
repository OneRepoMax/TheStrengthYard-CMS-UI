<template>
    <v-card elevation="3" class="mb-md-3 rounded-0">

        <v-img class="align-end text-white d-none d-md-flex" height="200" src="@/assets/home-cover-photo.jpg" cover></v-img>
        <v-card-title class="mb-10 d-none d-md-flex">
            <v-avatar color="info" size="120" class="profile-avatar" :image="displayPicture" v-if="displayPicture">
            </v-avatar>
            <v-avatar color="black" size="120" class="profile-avatar" v-if="!displayPicture">
                <v-icon icon="mdi-account-circle"></v-icon>
            </v-avatar>
        </v-card-title>

        <div class="d-none d-md-flex ms-5 flex-no-wrap justify-space-between">
            <v-card-title>
                {{ fullName }}
            </v-card-title>
            <div>
                <v-btn class="me-3" icon="mdi-pencil" variant="plain" to="profile/edit"></v-btn>
            </div>
        </div>

        <v-card-subtitle class="d-none d-md-flex ms-5">
            {{ homeAddress }}
        </v-card-subtitle>


        <div class="mx-md-3 d-md-none">
            <v-row class="ms-1 mt-2 d-flex">
                <v-col class="v-col-auto pe-0">
                    <v-avatar color="info" size="80" :image="displayPicture" v-if="displayPicture">
                    </v-avatar>
                    <v-avatar color="black" size="80" v-if="!displayPicture">
                        <v-icon icon="mdi-account-circle"></v-icon>
                    </v-avatar>
                </v-col>
                <v-col class="v-col-auto">
                    <div class="d-flex flex-no-wrap justify-space-between">
                        <v-card-title>
                            {{ fullName }}
                        </v-card-title>
                        <div>
                            <v-btn class="me-3" icon="mdi-pencil" variant="plain" to="profile/edit"></v-btn>
                        </div>
                    </div>

                    <v-card-subtitle>
                        {{ homeAddress }}
                    </v-card-subtitle>
                </v-col>
            </v-row>
        </div>

        <v-card-text class="d-md-flex pb-0 pb-md-5 ms-md-3">
            <!-- Purchase Membership Button -->
            <v-btn class="me-3 mb-3 text-capitalize d-flex" x-large rounded color="teal"
                to="membership/purchase-membership">
                Purchase Membership
            </v-btn>

            <!-- Payment History Button -->
            <v-btn class="me-3 text-capitalize d-flex mb-5 mb-md-0" x-large rounded variant="outlined" to="payment-history">
                Payment History
            </v-btn>
        </v-card-text>
        <div v-if="membershipRecord.length > 0">

            <template class="d-none d-md-block px-5">

                <v-divider></v-divider>

                <v-card-title class="my-2">Registered Memberships</v-card-title>

                <v-card-text class="px-sm-2">
                    <div class="d-flex flex-wrap">
                        <MembershipRecordCard :membershipRecord="this.membershipRecord" />
                    </div>
                </v-card-text>

            </template>

            <template class="d-block d-md-none mb-5">
                <MembershipRecordSlideGroup :membershipRecord="this.membershipRecord" />
            </template>

        </div>
    </v-card>
</template>

<script>
import { useMembershipStore } from "@/store/membership";
import MembershipRecordCard from "@/components/membership/MembershipRecordCard.vue";
import MembershipRecordSlideGroup from "@/components/membership/MembershipRecordSlideGroup.vue"

export default {
    setup() {
        const membershipStore = useMembershipStore();
        return { membershipStore };
    },
    data() {
        return {
            MembershipList: [],
            titles: [],
            loading: false,
        };
    },

    computed: {
        displayedMembership() {
            const startIndex = (this.page - 1) * this.membershipPerPage;
            const endIndex = startIndex + this.membershipPerPage;

            if (this.searchValue != null) {
                const filteredMembership = this.MembershipList.filter((membership) =>
                    `${membership.Title}`
                        .toLowerCase()
                        .includes(this.searchValue.toLowerCase())
                );
                return filteredMembership.slice(startIndex, endIndex);
            }
            return this.MembershipList.slice(startIndex, endIndex);
        },
    },
    methods: {

        createMembership(membershipId) {
            // console.log(membershipId)
            this.$router.push(`/admin/membership/${membershipId}`);
        },
        showComponent(componentName) {
            // Set the 'currentComponent' data variable to the selected component
            this.activeTab = componentName;
            this.currentComponent = componentName;
        },
        toggleButton() {
            this.isActive = !this.isActive;
        },
    },
    name: "ProfileCard",
    props: {
        displayPicture: String,
        fullName: String,
        emailAddress: String,
        homeAddress: String,
        membershipRecord: Array,
    },
    components: {
        MembershipRecordCard,
        MembershipRecordSlideGroup
    },
};
</script>

<style lang="scss" scoped>
.profile-avatar {
    position: absolute;
    top: 130px;
    left: 30px;
    z-index: 99;
}

.active-button {
    color: "teal";
}
</style>
