<template>
<v-card class="mx-auto">
  <v-card-text>
      <v-row align="center" dense>
          <v-col cols="12" md="5">
              <v-card-title>Memberships Records</v-card-title>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="3" >
              <v-autocomplete  variant="outlined" clearable prepend-inner-icon="mdi-magnify"
              v-model="searchValue" :items="MembershipList" hide-details="auto" class="me-3 w-100" label="Search membership"></v-autocomplete>
          </v-col>
          <v-col>
              <v-select hide-details="auto" v-model="status" @input="test" variant="outlined" :items="statusItems" label="Status"></v-select>
          </v-col>
      </v-row>
  </v-card-text>

  <v-divider></v-divider>
  <v-card-text>
    <v-data-table
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="displayedMembership"
    ><template v-slot:bottom> </template></v-data-table>
  </v-card-text>
  
  <v-divider></v-divider>
  <v-card-text class="px-8">
      <v-row>
          <v-col cols="12" sm="2" class="d-flex justify-end align-center">
              <v-select label="Results per page:" :items="[10, 50, 100]" v-model="membershipPerPage"
                  variant="outlined" max-width="40px" density="compact" hide-details="auto"></v-select>
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="d-flex justify-end align-center">
              <v-pagination v-model="page" :length="totalPages"></v-pagination>
          </v-col>
      </v-row>
  </v-card-text>
</v-card>
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
            // sortable: false,
            key: 'account',
          },
          { title: 'Contact', key: 'contact' },
          { title: 'Membership', key: 'membership' },
          { title: 'Type', key: 'type' },
          { title: 'Status', key: 'status' },
          { title: 'Start Date', key: 'start' },
          { title: 'End Date', key: 'end' },
        ],
        MembershipRecords: [],
        MembershipRecordsInfo: [],
        MembershipList: [],
        searchValue: null,
        page: 1,
        pageLength: 1,
        membershipPerPage: 10,
        statusItems: ['All', 'Active', 'Pending Payment', 'Paused', 'Expired', 'Terminated'],
        status: 'All',
      }
    },
    
    mounted() {
        this.getMembershipRecord();
    },

    watch: {
      status(){
        this.MembershipRecords = [],
        this.MembershipRecordsInfo = [],
        this.getMembershipRecord();
      }
    },
    
    computed: {
      displayedMembership() {
            const startIndex = (this.page - 1) * this.membershipPerPage;
            const endIndex = startIndex + this.membershipPerPage;

            if (this.searchValue != null) {

                const filteredMembership = this.MembershipRecordsInfo.filter(info =>
                    `${info.membership}`
                        .toLowerCase()
                        .includes(this.searchValue.toLowerCase())
                );
                return filteredMembership.slice(startIndex, endIndex);
            }
            return this.MembershipRecordsInfo.slice(startIndex, endIndex);
        },
        totalPages() {
            return Math.ceil(
                (this.searchValue
                    ? this.displayedMembership.length
                    : this.MembershipList.length) / this.membershipPerPage
            );
        },
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

        test (){
          console.log("alert")
        },

        async getMembershipRecord() {
            
            try {
                this.loading = true;
                // const response = await this.membershipStore.getMembershipRecordsByFilter("Active");
                console.log(this.status)
                if (this.status == 'All'){
                  var response = await this.membershipStore.getAllMembershipRecords();
                } else {
                  var response = await this.membershipStore.getMembershipRecordsByFilter(this.status);
                }

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
                                status: `${membership.ActiveStatus}`,
                                start: `${startdate}`,
                                end: `${enddate}`,
                            };
                            this.MembershipRecordsInfo.push(info);

                            const title = `${membership.Membership.Title}`;
                            if (this.MembershipList.indexOf(title) === -1) {
                                this.MembershipList.push(title);
                            }
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