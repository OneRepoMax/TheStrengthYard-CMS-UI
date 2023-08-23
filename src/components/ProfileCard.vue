<template>
    <v-card elevation="3 mb-3">

        <v-img class="align-end text-white" height="200" src="@/assets/home-cover-photo.jpg" cover></v-img>

        <v-card-title class="mb-10">
            <v-avatar color="info" size="120" class="profile-avatar"
                :image="displayPicture" v-if="displayPicture">
            </v-avatar>
            <v-avatar color="black" size="120" class="profile-avatar"
                v-if="!displayPicture">
                <v-icon icon="mdi-account-circle"></v-icon>
            </v-avatar>
        </v-card-title>
        <div class="mx-3 mb-3">
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

            <v-card-text>
                <v-btn class="me-3 mb-3 text-capitalize" x-large color="teal" rounded >
                    Book class
                </v-btn>
                <v-btn class="me-3 mb-3 text-capitalize" x-large color="teal" rounded variant="outlined">
                    Purchase Membership
                </v-btn>
                <v-btn class="me-3 mb-3 text-capitalize" x-large color="teal" rounded variant="outlined">
                    Manage Membership
                </v-btn>
            </v-card-text>

            <div v-if="membershipRecord.length>0">

                <v-divider></v-divider>

                <v-card-title class="my-2">Active Memberships</v-card-title>

                <v-card-text>

                    <v-btn v-for="membership in membershipRecord" :key="membership.id" rounded size="small"
                        class="ma-1 text-capitalize" color="deep-purple-lighten-2">
                        {{ membership.Membership.Description }}
                    </v-btn>
                </v-card-text>

            </div>



        </div>

    </v-card>
</template>

<script>
import { useUserStore } from '@/store/user';


export default {
    name: 'ProfileCard',
    props: {
        displayPicture: String,
        fullName: String,
        emailAddress: String,
        homeAddress: String,
        membershipRecord: Array,
    },


}

</script>

<style lang="scss" scoped>
.profile-avatar {
    position: absolute;
    top: 130px;
    left: 30px;
    z-index: 99;
}
</style>