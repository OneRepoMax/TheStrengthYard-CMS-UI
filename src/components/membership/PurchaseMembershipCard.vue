<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      class="my-2 me-4"
      max-width="250px"
      min-height="540px"
      height="550px"
      :class="{ 'on-hover': isHovering }"
      v-bind="props"
      variant="flat"
      @click="makePayment(membership)"
    >
      <v-img
        class="align-end text-white"
        height="200"
        :src="membership.Picture"
        h
      >
        <v-card-title>{{ membership.Type }}</v-card-title>
      </v-img>
      <v-card-title class="text-subtitle-1 mb-1">
        <p class="text-wrap">{{ membership.Title }}</p>
      </v-card-title>
      <v-card-subtitle class="text-wrap">{{
        membership.Description
      }}</v-card-subtitle>
      
      <v-card-subtitle class="my-2">
        <v-icon icon="mdi-refresh" size="small"></v-icon>
        <span class="mx-1">{{ membership.Type }}</span>
      </v-card-subtitle>
      <v-card-subtitle class="mb-2">
        <v-icon icon="mdi-currency-usd" size="small"></v-icon>
        <span class="mx-1">{{ membership.BaseFee }}</span>
      </v-card-subtitle>
    </v-card>
  </v-hover>
</template>

<script>
import { useMembershipStore } from "@/store/membership";

export default {
  props: {
    membership: Object,
    membershipRecord: Array,
  },
  setup() {
        const membershipStore = useMembershipStore();

        return { membershipStore }
    },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    navigateToRoute(route) {
        console.log(route);
      this.$router.push(route);
    },
    makePayment(membership) {
            console.log(membership);
            this.membershipStore.selectedMembership = membership
            this.$router.push(`/membership/checkout`)
        }
  },
};
</script>

<style lang="scss" scoped>


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
