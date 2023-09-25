<template>
  <v-card elevation="3" class="mb-3">
    <v-img
      class="align-end text-white"
      height="200"
      src="@/assets/home-cover-photo.jpg"
      cover
    ></v-img>

    <v-card-title class="mb-10">
      <v-avatar
        color="info"
        size="120"
        class="profile-avatar"
        :image="displayPicture"
        v-if="displayPicture"
      >
      </v-avatar>
      <v-avatar
        color="black"
        size="120"
        class="profile-avatar"
        v-if="!displayPicture"
      >
        <v-icon icon="mdi-account-circle"></v-icon>
      </v-avatar>
    </v-card-title>
    <div class="mx-3">
      <div class="d-flex flex-no-wrap justify-space-between">
        <v-card-title>
          {{ fullName }}
        </v-card-title>
        <div>
          <v-btn
            class="me-3"
            icon="mdi-pencil"
            variant="plain"
            to="profile/edit"
          ></v-btn>
        </div>
      </div>

      <v-card-subtitle>
        {{ homeAddress }}
      </v-card-subtitle>

      <v-card-text>
        <!-- Purchase Membership Button -->
        <v-btn
          class="me-3 mb-3 text-capitalize"
          x-large
          rounded
          color="teal"
          to="membership/purchase-membership"
        >
          Purchase Membership
        </v-btn>
        <!-- Payment History Button -->
        <v-btn
          class="me-3 mb-3 text-capitalize"
          x-large
          rounded
          variant="outlined"
          to="payment-history"
        >
          Payment History
        </v-btn>
      </v-card-text>
      <div v-if="membershipRecord.length > 0">
        <v-divider></v-divider>

        <v-card-title class="my-2">Owned Memberships</v-card-title>

        <v-card-text class="px-2">
          <div class="d-flex flex-wrap">
            <MembershipRecordCard :membershipRecord="this.membershipRecord" />
          </div>
        </v-card-text>
      </div>
    </div>
  </v-card>
</template>

<script>
import MembershipRecordCard from "@/components/membership/MembershipRecordCard.vue";
import { useMembershipStore } from "@/store/membership";

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
