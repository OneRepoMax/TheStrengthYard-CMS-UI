<template>
  <v-footer class="d-flex flex-column pa-0">
    <div class="bg-teal d-flex w-100 align-center'">
      <v-container style="max-width: 1280px">
        <template v-if="isMobile">
          <div class="d-flex justify-content-between">
            <v-col class="pa-0">
              <a
                class="text-white"
                href="https://www.thestrengthyard.com/terms-conditions-strength-conditioning-gym-singapore/"
                >Terms & Conditions</a
              >
            </v-col>
            <v-col class="pa-0">
              <a
                class="text-white"
                href="https://www.thestrengthyard.com/privacy-policy-strength-yard/"
                >Privacy Policy</a
              >
            </v-col>
          </div>
          <p class="text-body text-start mt-5">
            The Strength Yard - Strength and Conditioning Gym Singapore,
            Copyright All Rights Reserved © 2014 -
            {{ new Date().getFullYear() }}
          </p>
        </template>
        <template v-else>
          <v-row class="d-flex d-columns align-center">
            <v-col>
              <p class="text-body text-start">
                The Strength Yard - Strength and Conditioning Gym Singapore,
                Copyright All Rights Reserved © 2014 -
                {{ new Date().getFullYear() }}
              </p>
            </v-col>
            <v-col class="text-end">
              <a
                class="text-white me-5"
                href="https://www.thestrengthyard.com/terms-conditions-strength-conditioning-gym-singapore/"
                >Terms & Conditions</a
              >
              <a
                class="text-white"
                href="https://www.thestrengthyard.com/privacy-policy-strength-yard/"
                >Privacy Policy</a
              >
            </v-col>
          </v-row>
        </template>
      </v-container>
    </div>
  </v-footer>
</template>
<script>
export default {
  data() {
    return {
      isMobile: window.innerWidth < 800,
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      const isMobileNow = window.innerWidth < 600;
      if (isMobileNow !== this.isMobile) {
        // Screen size has changed, trigger a page reload
        location.reload();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
