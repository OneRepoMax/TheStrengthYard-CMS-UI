<template>
  <!-- No membership placeholder -->
  <v-btn
    v-if="this.mappingList.length == 0"
    type="info"
    block
    color="info"
    prepend-icon="mdi-information-outline"
    @click.prevent="membershipMappingForm.show = true"
  >
    There's no membership mapping found for this class, click to add membership
    mapping
  </v-btn>
  <template v-if="this.mappingList.length > 0">
    <v-row no-gutters>
      <v-col>
        <h5 class="text-h5">Membership Mapping</h5>
        <div>All membership mapping listed in this class.</div>
      </v-col>
      <v-col
        class="hidden-xs-only text-left"
        cols="12"
        md="2"
      >
        <v-btn
          block
          prepend-icon="mdi-plus"
          color="light-blue"
          size="small"
          @click.prevent="membershipMappingForm.show = true"
          >Add</v-btn
        >
      </v-col>
    </v-row>

    <v-divider class="my-3"></v-divider>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left font-weight-bold">Membership Title</th>
          <th class="text-left font-weight-bold">Type</th>
          <th class="text-left font-weight-bold">Base Fee</th>
          <th class="text-left font-weight-bold">Set Up Fee</th>
          <th class="text-left font-weight-bold">PayPal Plan Id</th>
          <th class="text-left font-weight-bold">Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="mapping in this.mappingList"
          :key="mapping.ClassId"
        >
          <td>
            {{ mapping.Membership.Title }}
          </td>
          <td>{{ mapping.Membership.Type }}</td>
          <td>${{ mapping.Membership.BaseFee }}</td>
          <td>${{ mapping.Membership.SetupFee }}</td>
          <td>{{ mapping.Membership.PayPalPlanId }}</td>
          
          <td>
            <v-btn
              size="x-small"
              icon="mdi-delete"
              variant="text"
              @click.prevent="
                deleteConfirmation(mapping.MembershipClassMappingId)
              "
            ></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    
  </template>

  <!-- Add Membership Record Form -->
  <template v-if="membershipMappingForm.show">
    <MembershipMappingForm
      v-model="membershipMappingForm.show"
      color="teal"
      @action="addMappingSuccess()"
      :classId="this.classId"
      @closeModal="closeMappingForm()"
    />
  </template>

  <template v-if="modal.show">
    <Modal
      v-model="modal.show"
      :path="modal.path"
      :title="modal.title"
      :message="modal.message"
      :icon="modal.icon"
      @closeModal="closeCommonModal"
      :closeOnClick="true"
    />
  </template>

  <template v-if="modalWarning.show">
    <ModalWarning
      v-model="modalWarning.show"
      :title="modalWarning.title"
      :message="modalWarning.message"
      :icon="modalWarning.icon"
      @closeModal="closeModalWarning"
      @action="deleteMembershipMapping(this.deleteMembershipMappingId)"
      :color="modalWarning.color"
    />
  </template>
</template>

<script>

import { useMembershipStore } from '@/store/membership'
import Modal from '@/components/common/Modal.vue'
import ModalWarning from '@/components/common/ModalWarning.vue'
import MembershipMappingForm from '@/components/membership/AddMembershipMapping.vue'

export default {
  setup() {
    const membershipStore = useMembershipStore();

    return { membershipStore };
  },
  props: {
    mappingList: Object,
    classId: Number,
  },
  emits:['reload-data'],
  components: {
    Modal,
    ModalWarning,
    MembershipMappingForm,
  },

  data() {
    return {
      deleteMembershipMappingId: null,
      membershipMappingForm: {
        show: false,
        data: {
          userId: null,
          membershipTypeId: null,
          startDate: null,
          endDate: null,
        },
      },
      modal: {
        show: false,
        type: "success",
        icon: "mdi-check-circle",
        title: "",
        message: "",
        path: "/admin/class",
      },
      modalWarning: {
        show: false,
        type: "danger",
        icon: "mdi-alert",
        color: "red",
        title: "Delete Mapping",
        message: "Are you sure you want to delete the membership mapping?",
        path: "/admin/class",
      },
    };
  },
  methods: {
    closeModal() {
      this.membershipLog.show = false;
    },

    closeCommonModal() {
      this.modal.show = false;
      this.modal.type = "success";
      this.modal.title = "";
      this.modal.message = "";
      this.$emit('reload-data', this.classId)
    },

    deleteConfirmation(mappingId) {
      this.deleteMembershipMappingId = mappingId;
      this.modalWarning.show = true;
    },

    async deleteMembershipMapping(mappingId) {
      this.modalWarning.show = false;
      console.log(mappingId);
      const response = await this.membershipStore.deleteMembershipClassMapping(mappingId);
      if (response.status === 200) {
        this.modal.show = true;
        this.modal.title = "Delete successful";
        this.modal.message = "Membership mapping has been deleted!";
      }
    },

    closeModalWarning() {
      this.modalWarning.show = false;
    },

    closeMappingForm() {
      this.membershipMappingForm.show = false;
    },

    addMappingSuccess() {
      this.closeMappingForm();
      this.modal.title = "Add successful";
      this.modal.message = "Membership mapping has been successfully added!";
      this.modal.show = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
