<template>
  <v-sheet class="mx-auto my-5" elevation="8" min-height="200">
    <v-slide-group
      v-model="model"
      class="pa-4"
      selected-class="bg-success"
      show-arrows
    >
      <v-slide-group-item>
        <v-card
          class="mx-5 my-2"
          width="250"
          height="250"
          min-height="150"
          v-for="membership in this.membershipList"
          :key="membership.MembershipTypeId"
          :value="membership.MembershipTypeId"
        >
          <v-img
            class="align-end text-white"
            min-height="100"
            src="@/assets/home-cover-photo.jpg"
            cover
          >
            <v-card-title>{{ membership.Type }}</v-card-title>
          </v-img>

          <v-card-subtitle class="pt-4 text-wrap">
            {{ membership.Title }}
          </v-card-subtitle>

          <v-card-text>
            <div>{{ membership.BaseFee }}</div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="teal"
              :disabled="loading"
              :loading="loading"
              to="membership/purchase-membership"
            >
              Purchase
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>

<script>
import { useMembershipStore } from "@/store/membership";
// import Modal from "@/components/common/Modal.vue";

export default {
  props: {
    membershipList: Object,
  },
  setup() {
    const membershipStore = useMembershipStore();
    return { membershipStore };
  },
  data() {
    return {
      membershipId: null,
      loading: false,
      // modal: {
      //   show: false,
      //   type: "success",
      //   icon: "mdi-cart-check",
      //   title: "Purchase membership successfully",
      //   message: "Would you like to make payment now?",
      //   path: '/'
      // },
    };
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
          return;
        } else {
          if (response.status == 200) {
            this.MembershipList = response.data;
            console.log(this.MembershipList);
          }
        }

        return;
      } catch (error) {
        console.error(
          "An error occurred during get all membership API request:",
          error
        );
      }

      return;
    },
    showModal() {
      this.modal.show = true;
      // this.membershipId = id
    },
    closeModal() {
      this.modal.show = false;
    },
  },
  components: {
    // Modal,
  },
};
</script>
