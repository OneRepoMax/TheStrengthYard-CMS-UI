<template>
<v-container fluid class="justify-center">
<v-card max-width="1280px" class="mx-auto">
  <v-card-text>
      <v-row align="center" dense>
          <v-col cols="12" md="5">
              <v-card-title>Payment History</v-card-title>
          </v-col>
          <v-spacer></v-spacer>
      </v-row>
  </v-card-text>

  <v-divider></v-divider>
  <v-card-text v-if="this.displayedPaymentHistory.length == 0" class="text-center">
    <v-btn block v-if="!this.loading" type="info" color="info"
            prepend-icon="mdi-information-outline" to="membership/purchase-membership" class="custom-button">
            <span class="button-content">You have not made any payment, click to purchase membership</span>
    </v-btn>
  </v-card-text>
  <v-card-text v-if="this.displayedPaymentHistory.length > 0">
    <v-data-table
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="displayedPaymentHistory"
    ><template v-slot:bottom> </template></v-data-table>
  </v-card-text>
  
  <v-divider></v-divider>
  <v-card-text class="px-8">
      <v-row>
          <v-col cols="12" sm="2" class="d-flex justify-end align-center">
              <v-select label="Results per page:" :items="[10, 50, 100]" v-model="paymentPerPage"
                  variant="outlined" max-width="40px" density="compact" hide-details="auto"></v-select>
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="d-flex justify-end align-center">
              <v-pagination v-model="page" :length="totalPages"></v-pagination>
          </v-col>
      </v-row>
  </v-card-text>
</v-card>
</v-container>
</template>

<script>
import { useUserStore } from '@/store/user'
import { useMembershipStore } from '@/store/membership'
import { usePaymentStore } from '@/store/payment'

  export default {
    components: {
        VDataTableServer,
    },
    setup () {
        const userStore = useUserStore();
        const membershipStore = useMembershipStore();
        const paymentStore = usePaymentStore();
        return { userStore, membershipStore, paymentStore }
    },
    data () {
      return {
        // sortBy: [{ key: 'membership', order: 'asc' }],
        headers: [
          { title: 'Date', align: 'start', sortable: false, key: 'transactionDate',},
          { title: 'Membership', sortable: false, key: 'membership' },
          { title: 'Type', sortable: false, key: 'type' },
          { title: 'Transaction Id', sortable: false, key: 'transactionId' },
          { title: 'Amount', sortable: false, key: 'amount' },
          { title: 'Payment Mode', sortable: false, key: 'paymentMode' },
        ],
        MembershipRecords: [],
        PaymentHistoryInfo: [],
        page: 1,
        pageLength: 1,
        paymentPerPage: 10,
        loading: true,
      }
    },
    
    mounted() {
        this.getPaymentHistory();
    },
    
    computed: {

        displayedPaymentHistory() {
            const startIndex = (this.page - 1) * this.paymentPerPage;
            const endIndex = startIndex + this.paymentPerPage;

            const sortDate = (obj1, obj2) => {
                const date1 = new Date(obj1.transactionDate);
                const date2 = new Date(obj2.transactionDate);

                return date2 - date1
            };

            // Sort payment history by date
            const sortedPaymentHistoryInfo = this.PaymentHistoryInfo.sort(sortDate)
            // console.log(sortedPaymentHistoryInfo)

            // Format payment history date
            const formattedPaymentHistory = sortedPaymentHistoryInfo.map((payment) => ({
                membership: payment.membership,
                type: payment.type,
                transactionId: payment.transactionId,
                paymentMode: payment.paymentMode,
                amount: payment.amount,
                transactionDate: this.formattedDate(payment.transactionDate),
            }));
            // console.log(formattedPaymentHistory)

            return formattedPaymentHistory.slice(startIndex, endIndex);
        },
        totalPages() {
            return Math.ceil(
                (this.displayedPaymentHistory.length) / this.paymentPerPage
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

        async getPaymentHistory() {
            try {
                this.loading = true;
                
                const response = await this.membershipStore.getMembershipRecordByUserId(this.userStore.userId);

                this.loading = false;
                if (response == null || response.status != 200) {
                    return
                } else {
                    if (response.status == 200) {
                        this.MembershipRecords = response.data
                        console.log(this.MembershipRecords)

                        for (const membership of this.MembershipRecords) {
                            const paymentInfo = await this.paymentStore.getPaymentsByMembershipRecordId(membership.MembershipRecordId)
                            if (paymentInfo.status == 200) {
                                // console.log(paymentInfo.data)
                                
                                for (const payment of paymentInfo.data){
                                    // const date = this.formattedDate(payment.TransactionDate)
                                    const info = {
                                        membership: `${membership.Membership.Title}`,
                                        type: `${membership.Membership.Type}`,
                                        transactionId: `${payment.PayPalTransactionId}`,
                                        paymentMode: `${payment.PaymentMode}`,
                                        amount: `${payment.Amount}`,
                                        transactionDate: `${payment.TransactionDate}`,
                                    }
                                    console.log(info)
                                    this.PaymentHistoryInfo.push(info);
                                }
                                
                            }

                        }
                    }
                }
                console.log(this.PaymentHistoryInfo)
                return

            } catch (error) {
                console.error("An error occurred during get all payment history API request:", error);
            }
            
            return

        },


    },
  }
</script>
<style scoped>
.custom-button{
    height: auto;
    padding: 10px
}
.button-content {
    white-space: wrap;
}
</style>