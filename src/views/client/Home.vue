<template>
  <v-row style="max-width: 1280px" class="mx-auto">
    <v-col cols="12" v-if="!userStore.verified">
      <v-alert
        type="warning"
        border="start"
        color="amber"
        title="Your account is not verified! "
        closable
        elevation="2"
      >
        Please check your email for verification or click
        <v-chip
          prepend-icon="mdi-email"
          variant="tonal"
          @click="resendVerification()"
          >Resend verification email</v-chip
        >
        to verify email address
      </v-alert>
    </v-col>
    <v-col cols="12" md="8" class="pa-0 pa-md-3">
      <!-- Skeleton loaders -->
      <v-skeleton-loader
        class="mb-3"
        elevation="3"
        v-if="loading"
        type="card-avatar, article, divider, list-item-three-line, list-item-three-line"
        loading
      >
      </v-skeleton-loader>

      <v-skeleton-loader
        elevation="3"
        v-if="loading"
        type="article, list-item-three-line, list-item-three-line"
        loading
      >
      </v-skeleton-loader>

      <profile-card
        v-if="!loading"
        :fullName="userStore.firstName + ' ' + userStore.lastName"
        :emailAddress="userStore.emailAddress"
        :homeAddress="userStore.homeAddress"
        :membershipRecord="membershipRecord"
        :displayPicture="userStore.displayPicture"
      />

      <PurchaseMembershipSlider class="d-none d-md-block" v-if="!loading" />

      <Classes v-if="!loading" class="d-none" />

      <PurchaseMembershipSlideGroup class="d-md-none" />
    </v-col>

    <v-col cols="12" md="4" class="pa-0 pa-md-3">
      <!-- Sekelton loaders -->
      <v-skeleton-loader
        class="mb-3"
        elevation="3"
        type="table-heading, list-item-two-line"
        loading
        v-if="loading"
      ></v-skeleton-loader>
      <v-skeleton-loader
        class="mb-3"
        elevation="3"
        type="table-heading	, list-item-avatar-three-line, list-item-avatar-three-line, list-item-avatar-three-line"
        loading
        v-if="loading"
      ></v-skeleton-loader>

      <template v-if="!loading">
        <div class="d-flex flex-column">
          <org-profile-card class="order-1 order-md-0" />
          <upcoming-booking/>
          <div class="order-0 order-md-1" >
            <template v-for="(data, index) in ads" :key="index">
              <AdsCard :adsList="data.adsList" :title="data.title"/>
            </template>
          </div>
        </div>
      </template>
    </v-col>
  </v-row>

  <!-- Modal -->
  <template>
    <Modal
      v-model="modal.show"
      :path="modal.path"
      :title="modal.title"
      :message="modal.message"
      :icon="modal.icon"
      @closeModal="closeModal"
      :closeOnClick="true"
    />
  </template>
</template>

<script>
import { useUserStore } from "@/store/user";
import { useMembershipStore } from "@/store/membership";
import ProfileCard from "@/components/home/ProfileCard.vue";
import Classes from "@/components/home/Classes.vue";
import OrgProfileCard from "@/components/home/OrgProfileCard.vue";
import Modal from "@/components/common/Modal.vue";
import PurchaseMembershipSlider from "@/components/membership/PurchaseMembershipSlider.vue";
import AdsCard from "@/components/home/AdsCard.vue";
import PurchaseMembershipSlideGroup from "@/components/membership/PurchaseMembershipSlideGroup.vue";
import UpcomingBooking from "@/components/home/UpcomingBooking.vue";

export default {
  setup() {
    const userStore = useUserStore();
    const membershipStore = useMembershipStore();

    return {
      userStore,
      membershipStore,
    };
  },
  data() {
    return {
      loading: false,
      modal: {
        show: false,
        message: "",
        type: "",
        icon: "",
        path: "/",
      },
      membershipRecord: [],
      ads: [
        {
          title: "SBD Singapore",
          adsList: [
            {
              src: "https://sbd.sg/cdn/shop/files/SBD_BELT_MAIN_UPDATE_1296x.jpg?v=1637286913",
              path: "https://sbd.sg/products/13mm-lever-belt-2020?variant=33208204460114",
            },
            {
              src: "https://sbd.sg/cdn/shop/files/SBDSG_7MM_POWERLIFTING_KNEE_SLEEVES_BANNER_1_1280x.jpg?v=1685530323",
              path: "https://sbd.sg/blogs/news-1/7mm-powerlifting-knee-sleeves",
            },
            {
              src: "https://cdn.shopify.com/s/files/1/2782/7592/files/SBDSG_IPF_WORLD_MALTA_20234_TEAM_SINGAPORE_600x600.jpg?v=1685368701",
              path: "https://sbd.sg/blogs/news-1/ipf-world-malta-2023-team-singapore",
            },
          ],
        },
        {
          title: "TSY Official Merchandise",
          adsList: [
            {
              src: "https://www.thestrengthyard.com/wp-content/uploads/the-strength-yard-t-shirt-black.jpg",
              path: "https://www.thestrengthyard.com/merchandise/",
            },
            {
              src: "https://www.thestrengthyard.com/wp-content/uploads/the-strength-yard-t-shirt-green.jpg",
              path: "https://www.thestrengthyard.com/merchandise/",
            },
          ],
        },
      ],
    };
  },
  mounted() {
    // Get membership record
    this.getMembershipRecord();
  },
  methods: {
    async resendVerification() {
      const response = await this.userStore.resendVerificationEmail(
        this.userStore.emailAddress
      );
      if (response.status === 200) {
        this.modal.show = true;
        this.modal.title = "Success"
        this.modal.message = 
          "Success! Please check your email for verification";
        this.modal.type = "success";
        this.modal.icon = "mdi-email";
      } else {
        this.modal.show = true;
        this.modal.title = "Error"
        this.modal.message = "Error! Please contact administrator";
        this.modal.type = "error";
        this.modal.icon = "mdi-error";
      }
    },
    async getMembershipRecord() {
      this.loading = true;
      const response = await this.membershipStore.getMembershipRecordByUserId(
        this.userStore.userId
      );
      this.loading = false;

      if (response.status == 200) {
        console.log("Membership Record");
        console.log(response.data);
        this.membershipRecord = response.data;
      }
    },
    async getMembership() {},
    closeModal() {
      this.modal.show = false;
    },
  },
  components: {
    ProfileCard,
    Classes,
    OrgProfileCard,
    Modal,
    PurchaseMembershipSlider,
    AdsCard,
    PurchaseMembershipSlideGroup,
    UpcomingBooking
  },
};
</script>

