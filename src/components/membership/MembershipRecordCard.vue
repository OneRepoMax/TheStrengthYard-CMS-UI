<template>
  <v-carousel
    :continuous="false"
    v-model="page"
    hide-delimiter-background
    :show-arrows="membershipRecord.length > 3 ? 'hover' : false"
    height="420px"
    :hide-delimiters="membershipRecord.length > 3 ? false : true"
  >
    <v-carousel-item
      v-for="(slice, index) in slicedMembershipRecords"
      :key="index"
    >
      <v-row class="cardSpace">
        <v-col
          v-for="membership in slice"
          :key="membership.MembershipTypeId"
          cols="12"
          md="6"
          lg="4"
        >
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              variant="flat"
              :class="{ 'on-hover': isHovering }"
              v-bind="props"
              @click.prevent="showMembershipLog(membership)"
              :loading="loading"
              height="400px"
              min-width="250px"
            >
              <template v-slot:loader="{ isActive }">
                <v-progress-linear
                  :active="isActive"
                  color="deep-purple"
                  height="4"
                  indeterminate
                ></v-progress-linear>
              </template>
              <v-img
                :src="membership.Membership.Picture"
                max-height="150px"
                cover
              >
              </v-img>
              <v-card-title class="text-subtitle-1">
                <p class="text-wrap">{{ membership.Membership.Title }}</p>
              </v-card-title>
              <v-card-subtitle>
                <v-chip
                  v-if="
                    membership.ActiveStatus.toUpperCase() === 'INACTIVE' ||
                    membership.ActiveStatus.toUpperCase() === 'EXPIRED' ||
                    membership.ActiveStatus.toUpperCase() === 'PENDING PAYMENT'
                  "
                  color="secondary"
                  prepend-icon="mdi-close"
                  class="me-3 mb-3"
                >
                  {{ membership.ActiveStatus }}
                </v-chip>
                <v-chip
                  v-else-if="membership.ActiveStatus.toUpperCase() === 'ACTIVE'"
                  color="primary"
                  prepend-icon="mdi-check"
                  class="me-3 mb-3"
                >
                  {{ membership.ActiveStatus }}
                </v-chip>
                <v-chip
                  v-else-if="membership.ActiveStatus.toUpperCase() === 'PAUSED'"
                  color="orange"
                  prepend-icon="mdi-pause"
                  class="me-3 mb-3"
                >
                  {{ membership.ActiveStatus }}
                </v-chip>
              </v-card-subtitle>
              <v-card-subtitle class="mb-2">
                <v-icon color="error" icon="mdi-refresh" size="small"></v-icon>
                <span class="mx-1">{{ membership.Membership.Type }}</span>
              </v-card-subtitle>
              <v-card-subtitle class="mb-2">
                <v-icon
                  color="error"
                  icon="mdi-currency-usd"
                  size="small"
                ></v-icon>
                <span class="mx-1">{{ membership.Membership.BaseFee }}</span>
              </v-card-subtitle>
              <v-card-subtitle class="mb-3">
                <v-icon
                  icon="mdi-calendar"
                  size="18"
                  class="me-1 pb-1"
                ></v-icon>
                {{ formattedDate(membership.StartDate) }} to
                {{ formattedDate(membership.EndDate) }}
              </v-card-subtitle>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-carousel-item>
  </v-carousel>
  <!-- Membership Log Modal -->
  <template v-if="membershipLog.show">
    <MembershipLogModal
      v-model="membershipLog.show"
      @closeModal="closeModal"
      :membershipLog="this.membershipLog.data"
      :membership="selectedMembershipRecord"
      @addMembershipLog="addMembershipLog"
    />
  </template>
</template>

<script>
import { useMembershipStore } from "@/store/membership";
import MembershipLogModal from "@/components/membership/MembershipLogModal.vue";

export default {
  props: {
    membershipRecord: Array,
  },
  setup() {
    const membershipStore = useMembershipStore();
    return { membershipStore };
  },
  data() {
    return {
      page: 0,
      loading: false,
      selectedMembershipRecord: null,
      membershipLog: {
        show: false,
        data: [],
      },
    };
  },
  methods: {
    formattedDate(dateInput) {
      const date = new Date(dateInput);
      const year = String(date.getUTCFullYear()).slice(2);
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = monthNames[date.getUTCMonth()];
      const day = String(date.getUTCDate());
      return `${day} ${month} ${year}`;
    },
    async showMembershipLog(membershipRecord) {
      this.selectedMembershipRecord = membershipRecord;

      const response =
        await this.membershipStore.getMembershipLogByMembershipRecordId(
          membershipRecord.MembershipRecordId
        );

      if (response.status == 200) {
        this.membershipLog.data = response.data;
        console.log(this.membershipLog.data);
        this.membershipLog.show = true;
      }
    },
    closeModal() {
      this.membershipLog.show = false;
    },
    getColumnsCount() {
      // Determine the number of columns based on screen width
      return window.innerWidth < 600 ? 1 : 3; // Show 1 card on mobile, 3 cards on larger screens
    },
  },
  computed: {
    slicedMembershipRecords() {
      // Slice the membership records into groups based on the number of columns
      const sliced = [];
      const columns = this.getColumnsCount();
      for (let i = 0; i < this.membershipRecord.length; i += columns) {
        sliced.push(this.membershipRecord.slice(i, i + columns));
      }
      return sliced;
    },
  },
  components: { MembershipLogModal },
};
</script>

<style scoped>
.cardSpace {
  justify-content: space-between;
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
