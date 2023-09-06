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
    <div class="mx-3 mb-3">
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
        <v-btn
          class="me-3 mb-3 text-capitalize"
          x-large
          rounded
          :color="activeTab === 'BookClass' ? 'teal' : ''"
          @click="showComponent('BookClass')"
        >
          Book class
        </v-btn>
        <v-btn
          class="me-3 mb-3 text-capitalize"
          x-large
          :color="activeTab === 'MakePayment' ? 'teal' : ''"
          rounded
          to="membership/purchase-membership"
        >
          Purchase Membership
        </v-btn>
      </v-card-text>
      <div v-if="membershipRecord.length > 0">
        <v-divider></v-divider>

        <v-card-title class="my-2">Owned Memberships</v-card-title>

        <v-card-text>
          <div class="d-flex flex-wrap">
            <MembershipRecordCard :membershipRecord="this.membershipRecord" />
          </div>
        </v-card-text>
      </div>
    </div>
  </v-card>
  <MakePaymentSlide :membershipList="displayedMembership" />
</template>

<script>
import MakePaymentSlide from "../membership/PaymentSlider.vue";
import MembershipRecordCard from "@/components/membership/MembershipRecordCard.vue";
import { useMembershipStore } from "@/store/membership";

export default {
  setup() {
    const membershipStore = useMembershipStore();
    return { membershipStore };
  },
  data() {
    return {
      activeTab: "BookClass",
      currentComponent: "BookClass",
      MembershipList: [],
      titles: [],
      loading: false,
      searchValue: null,
      page: 1,
      pageLength: 1,
      membershipPerPage: 10,
    };
  },
  watch: {
    searchValue() {
      this.page = 1;
    },
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
            for (const membership of this.MembershipList) {
              const title = `${membership.Title}`;
              if (this.titles.indexOf(title) === -1) {
                this.titles.push(title);
              }
            }
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
    MakePaymentSlide,
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
