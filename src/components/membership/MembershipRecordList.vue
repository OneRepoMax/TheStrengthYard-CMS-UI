<template>
  <!-- <v-expansion-panels variant="popout" class="pa-4" >
        <v-expansion-panel v-for="membership in this.membershipRecordList" :key="membership.MembershipTypeId" :value="membership.MembershipTypeId">
            <v-expansion-panel-title>
                <v-row align="center" class="spacer" dense>
                    <v-col cols="12" md="6">
                        <p>{{ membership.Title }}</p>
                    </v-col>
                    <v-col cols="12" md="1">
                        <p>{{ membership.Type }}</p>
                    </v-col>
                    <v-col cols="12" md="1">
                        <p>${{ membership.BaseFee }}</p>
                    </v-col>
                    <v-col class="hidden-xs-only" cols="12" md="2">
                        <v-btn block prepend-icon="mdi-pencil" color="amber" size="small" @click.prevent="editMembership(membership.MembershipTypeId)">Membership</v-btn>
                    </v-col>
                    <v-col class="hidden-xs-only" cols="12" md="2">
                        <v-btn block prepend-icon="mdi-delete" color="red" size="small" @click.prevent="showModal(membership.MembershipTypeId)">Delete</v-btn>
                    </v-col>
                </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="3">
                            <v-img :src="membership.Picture" max-height="80px"></v-img>
                        </v-col>
                        <v-col cols="12" md="9">
                            <strong>Description: </strong><br>
                            <p>{{ membership.Description }} </p>
                        </v-col>
                    </v-row>
                    
                </v-card-text>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels> -->
  <template>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Membership</th>
          <th class="text-left">Type</th>
          <th class="text-left">Fee ($)</th>
          <th class="text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in desserts" :key="item.name">
          <td>{{ membership.Title }}</td>
          <td>{{ membership.Type }}</td>
          <td>${{ membership.BaseFee }}</td>
          <td>{{ membership.ActiveStatus }}</td>
        </tr>
      </tbody>
    </v-table>
  </template>

  <!-- <template>
    <Modal
      v-model="modal.show"
      :path="modal.path"
      :title="modal.title"
      :message="modal.message"
      :icon="modal.icon"
      @closeModal="closeModal"
      @actionModal="actionModal"
    />
  </template> -->
</template>

<script>
// import Modal from "@/components/common/ModalWarning.vue";
import { useMembershipStore } from "@/store/membership";

export default {
  props: {
    membershipList: Object,
  },

//   components: { Modal },

  setup() {
    const membershipStore = useMembershipStore();

    return {
      membershipStore,
    };
  },

  data() {
    return {
      membershipId: null,
    //   modal: {
    //     show: false,
    //     type: "success",
    //     icon: "mdi-alert",
    //     title: "Are you sure you want to delete?",
    //     message: "This action cannot be undone",
    //     path: "/admin/membership",
    //     iconColor: "red",
    //   },
    };
  },
  methods: {
    // editMembership(membershipId) {
    //   console.log(membershipId);
    //   this.$router.push(`/admin/membership/${membershipId}`);
    // },

    // deleteMembership(membershipId) {
    //   console.log("deleting: " + membershipId);
    //   this.modal.show = false;
    //   this.membershipStore.deleteMembershipById(membershipId);
    // },
    // showModal(id) {
    //   this.modal.show = true;
    //   this.membershipId = id;
    // },
    // closeModal() {
    //   this.modal.show = false;
    // },
    // actionModal() {
    //   this.deleteMembership(this.membershipId);
    // },
  },
};
</script>
