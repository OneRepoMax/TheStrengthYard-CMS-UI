<template>
  <v-row>
    <v-card
      class="mx-auto my-2"
      min-width="400"
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
        <v-btn color="teal" :disabled="loading" :loading="loading" @click.prevent="showModal()"> Purchase </v-btn>
      </v-card-actions>
    </v-card>
  </v-row>

  <template>
    <Modal
      v-model="modal.show"
      :path="modal.path"
      :title="modal.title"
      :message="modal.message"
      :icon="modal.icon"
      @closeModal="closeModal"
    />
  </template>
</template>

<script>
import { useMembershipStore } from "@/store/membership";
import Modal from "@/components/common/Modal.vue";

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
      modal: {
        show: false,
        type: "success",
        icon: "mdi-cart-check",
        title: "Purchase membership successfully",
        message: "Would you like to make payment now?",
        path: '/'
      },
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
            this.modal.show = true
            // this.membershipId = id
        },
    closeModal() {
      this.modal.show = false;
    },
  },
  components: {
    Modal,
  },
};
</script>
