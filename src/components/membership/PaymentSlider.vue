<template>
  <v-sheet class="mx-auto my-5" elevation="8" min-height="200">
    <v-card-title class="pt-4 pb-0">Available Memberships</v-card-title>
    <v-slide-group
      v-model="model"
      class="pa-4"
      selected-class="bg-success"
      show-arrows
      
    >
      <v-slide-group-item >
        <v-hover v-slot="{ isHovering }">
          <v-card
            class="mx-5 my-2"
            width="250"
            height="250"
            min-height="150"
            v-for="membership in this.membershipList"
            :key="membership.MembershipTypeId"
            :value="membership.MembershipTypeId"
            :class="{ 'on-hover': isHovering }"
            variant="flat"
            @click="navigateToRoute('/membership/purchase-membership')"
          >
            <v-img
              class="align-end text-white"
              min-height="100"
              src="@/assets/purchaseMembershipBanner.png"
              cover
            >
              <v-card-title>{{ membership.Type }}</v-card-title>
            </v-img>

            <v-card-subtitle class="pt-4 text-wrap subtext">
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
        </v-hover>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>

<script>
import { useMembershipStore } from "@/store/membership";

export default {
  props: {
    membershipList: Object,
    membershipRecord: Array,
  },
  setup() {
    const membershipStore = useMembershipStore();
    return { membershipStore };
  },
  data() {
    return {
      membershipId: null,
      loading: false,
    };
  },
  mounted() {
    this.getMembershipList();
  },
  computed: {
    availableMemberships() {
      // Filter out memberships that are in the membershipRecord
      return this.membershipList.filter(membership => !this.isInMembershipRecord(membership));
    },
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
    navigateToRoute(route) {
      this.$router.push(route);
    },
    isInMembershipRecord(membership) {
      // Ensure this.membershipRecord is defined before using some
      if (this.membershipRecord && this.membershipRecord.length > 0) {
        return this.membershipRecord.some(
          (record) => record.MembershipTypeId === membership.MembershipTypeId
        );
      }
      return false; // Return false if membershipRecord is undefined or empty
    },
  },
  components: {
    // Modal,
  },
};
</script>

<style lang="scss" scoped>
.subtext {
  height: 50px;
}

.v-card {
  transition: opacity 0.2s ease-in-out;
}

.v-card:hover {
  cursor: pointer;
}

.v-card:not(.on-hover) {
  opacity: 1;
}
</style>
