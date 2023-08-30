<template>
    <v-expansion-panels variant="popout" class="pa-4" >
        <v-expansion-panel v-for="membership in this.membershipList" :key="membership.MembershipTypeId" :value="membership.MembershipTypeId">
            <v-expansion-panel-title>
                <v-row align="center" class="spacer" dense>
                    <v-col cols="12" md="1">
                        <p>{{membership.MembershipTypeId }}</p>
                    </v-col>
                    <v-col cols="12" md="5">
                        <p>{{membership.Title }}</p>
                    </v-col>
                    <v-col cols="12" md="1">
                        <p>{{membership.Type }}</p>
                    </v-col>
                    <v-col cols="12" md="1">
                        <p>{{membership.BaseFee }}</p>
                    </v-col>
                    <v-col class="hidden-xs-only" cols="12" md="2">
                        <v-btn prepend-icon="mdi-pencil" color="amber" size="small" @click.prevent="editProfile()">Membership</v-btn>
                    </v-col>
                    <v-col class="hidden-xs-only" cols="12" md="2">
                        <v-btn prepend-icon="mdi-delete" color="red" size="small">Delete</v-btn>
                    </v-col>
                </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-card-text>
                    <strong>Description: </strong><br>
                    <p>{{ membership.Description }} </p>
                </v-card-text>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>



<script>
  export default {
    props: {
        membershipList: Object,
    },
    data () {
      return {

      }
    },
  }
</script>