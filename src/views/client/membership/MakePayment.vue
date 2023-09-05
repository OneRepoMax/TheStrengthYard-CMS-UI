<template>
  <v-main>
    <v-container fluid justify="center" class="h-screen">
      <v-row justify="center" class="h-100 w-100" align="center">
        <v-card
          class="mx-auto my-2"
          min-width="400"
          height="400"
          v-for="membership in this.membershipList"
          :key="membership.MembershipTypeId"
          :value="membership.MembershipTypeId"
        >
          <v-img
            class="align-end text-white"
            height="200"
            src="@/assets/home-cover-photo.jpg"
            cover
          >
            <v-card-title>{{ membership.Type }}</v-card-title>
          </v-img>

          <v-card-subtitle class="pt-4">
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
              
            >
              Purchase
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-container>
  </v-main>

</template>

<script>
import { useMembershipStore } from "@/store/membership";

export default {
  name: "purchseMembership",
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
  },
  components: {
  },
};
</script>
