<template>
  <v-data-table
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="this.MembershipRecordsInfo"
    class="elevation-1"
  ></v-data-table>
  <!-- <v-code class="mt-4">
    <pre>{{ sortBy }}</pre>
  </v-code> -->
</template>

<script>
import { useMembershipStore } from '@/store/membership'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

  export default {
    components: {
        VDataTableServer,
    },
    setup () {
        const membershipStore = useMembershipStore();
        return { membershipStore }
    },
    data () {
      return {
        sortBy: [{ key: 'membership', order: 'asc' }],
        headers: [
          {
            title: 'Account',
            align: 'start',
            sortable: false,
            key: 'account',
          },
          { title: 'Contact', key: 'contact' },
          { title: 'Membership', key: 'membership' },
          { title: 'Type', key: 'type' },
          { title: 'Start Date', key: 'start' },
          { title: 'End Date', key: 'end' },
        ],
        MembershipRecords: [],
        MembershipRecordsInfo: [],
      }
    },
    
    mounted() {
        this.getActiveMembershipRecord();
    },
    methods: {
        formattedDate(dateInput) {
            const date = new Date(dateInput);
            const year = String(date.getUTCFullYear()).slice(2);
            const monthNames = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            const month = monthNames[date.getUTCMonth()];
            const day = String(date.getUTCDate());
            return `${day} ${month} ${year}`;
        },

        async getActiveMembershipRecord() {

            try {
                this.loading = true;
                const response = await this.membershipStore.getMembershipRecordsByFilter("Active");
                this.loading = false;
                if (response == null || response.status != 200) {
                    return
                } else {
                    if (response.status == 200) {
                        this.MembershipRecords = response.data
                        console.log(this.MembershipRecords)
                        for (const membership of this.MembershipRecords) {
                            const startdate = this.formattedDate(membership.StartDate)
                            const enddate = this.formattedDate(membership.EndDate)
                            const info = {
                                account: `${membership.User.FirstName} ${membership.User.LastName}`,
                                contact: membership.User.ContactNo,
                                membership: `${membership.Membership.Title}`,
                                type: `${membership.Membership.Type}`,
                                start: `${startdate}`,
                                end: `${enddate}`,
                            };
                            this.MembershipRecordsInfo.push(info);
                        }
                    }
                }
                console.log(this.MembershipRecordsInfo)
                return

            } catch (error) {
                console.error("An error occurred during get all membership API request:", error);
            }
            
            return

        },


    },
  }
</script>