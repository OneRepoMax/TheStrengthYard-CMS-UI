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
      @click="navigateToRoute('/next-route')"
    >
      <!-- navigateToRoute's route to change when new screen is built -->
      <v-img
        class="align-end text-white"
        height="200"
        src="@/assets/purchaseMembershipBanner.png"
        cover
      >
        <v-card-title>{{ membership.Type }}</v-card-title>
      </v-img>
      <v-card-title class="text-subtitle-1 title">
        <p class="text-wrap">{{ membership.Title }}</p>
      </v-card-title>
      <v-card-subtitle class="text-wrap text">{{
        membership.Description
      }}</v-card-subtitle>

      <v-card-subtitle class="mb-2">
        <v-icon color="error" icon="mdi-refresh" size="small"></v-icon>
        <span class="mx-1">{{ membership.Type }}</span>
      </v-card-subtitle>
      <v-card-subtitle class="mb-2">
        <v-icon color="error" icon="mdi-currency-usd" size="small"></v-icon>
        <span class="mx-1">{{ membership.BaseFee }}</span>
      </v-card-subtitle>
      <v-card-actions>
        <!-- <v-spacer></v-spacer> -->
        <v-btn color="teal" :disabled="loading" :loading="loading"
          >Purchase</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  props: {
    membership: Object,
    membershipRecord: Array,
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    navigateToRoute(route) {
      this.$router.push(route);
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  min-height: 70px;
  line-height: 24px;
}
.text {
  height: 180px;
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
