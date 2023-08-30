<template>
    <v-expansion-panels variant="popout" class="pa-4" >
        <v-expansion-panel v-for="account in this.clientAccounts" :key="account.UserId" :value="account.UserId">
            <v-expansion-panel-title>
                <v-row align="center" class="spacer" dense>
                    <v-col cols="2" md="1">
                        <v-avatar size="36px">
                            <v-img v-if="account.DisplayPicture" alt="Avatar" :src="account.DisplayPicture"></v-img>
                            <v-icon v-else color="black" icon="mdi-account"></v-icon>
                        </v-avatar>
                    </v-col>
                    <v-col class="hidden-xs-only text-left" cols="8" md="2">
                        <strong>{{ account.FirstName + " " + account.LastName }}</strong>
                    </v-col>
                    <v-col class="hidden-xs-only text-left" cols="12" md="3">
                        {{ account.EmailAddress }}
                    </v-col>
                    <v-col class="hidden-xs-only text-left" cols="12" md="2">
                        <v-chip prepend-icon="mdi-phone">{{ account.ContactNo }}</v-chip>
                    </v-col>
                    <v-col class="hidden-xs-only text-left " cols="12" md="2">
                        <v-btn prepend-icon="mdi-pencil" color="amber" size="small" @click.prevent="editProfile(account.UserId)">Profile</v-btn>
                    </v-col>
                    <v-col class="hidden-xs-only text-left" cols="12" md="2">
                        <v-btn prepend-icon="mdi-pencil" color="light-blue" size="small">Memberships</v-btn>
                    </v-col>
                </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-card-text>
                    <v-icon class="me-3">mdi-home</v-icon>Home Address: {{ account.HomeAddress }}
                </v-card-text>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>


export default {

    props: {
        clientAccounts: Object,
    },
    methods: {
        editProfile(userId) {
            this.$router.push(`/admin/account/${userId}`)
        }
    }

}

</script>

<style lang="scss" scoped></style>