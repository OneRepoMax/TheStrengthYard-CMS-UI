<template>
  <div>
    <apexchart
      type="pie"
      :options="chartOptions"
      :series="series"
      height="300"
    />
  </div>

</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import { useMembershipStore } from '@/store/membership'
import MembershipList from "@/components/membership/MembershipList.vue"

export default {
  components: {
    apexchart: VueApexCharts,
    MembershipList
  },
  setup () {
    const membershipStore = useMembershipStore();
    return { membershipStore }
  },
  data() {
    return {
      MembershipList: [],
      // titles: [],
      // values: [],
      series: [],
          chartOptions: {
            chart: {
              // width: 380,
              height: 'auto',
              type: 'pie',
            },
            theme: {
              monochrome: {
                enabled: true
              }
            },
            labels: [],
            title: {
              text: 'No. of Active Users in each Membership',
              align: 'left'
            },
            legend: {
              position: 'right',
              show: true,
            },
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }]
          },
    };
  },

  mounted() {
        this.getMembershipList();
        console.log(this.chartOptions.labels)
        console.log(this.series)
    },
    methods: {
        async getMembershipList() {

            try {
                this.loading = true;
                const response = await this.membershipStore.getAllMembership();
                this.loading = false;
                if (response == null || response.status != 200) {
                    return
                } else {
                    if (response.status == 200) {
                        this.MembershipList = response.data
                        console.log(this.MembershipList)
                        for (const membership of this.MembershipList) {
                            const title = `${membership.Title} (${membership.Type})`;
                            if (this.chartOptions.labels.indexOf(title) === -1) {
                                this.chartOptions.labels.push(title);
                            }
                            // testing putting in value using id
                            const value = membership.MembershipTypeId;
                            if (this.series.indexOf(value) === -1) {
                                this.series.push(value);
                            }
                        }
                    }
                }
                
                return

            } catch (error) {
                console.error("An error occurred during get all membership API request:", error);
            }
            
            return

        },

    }
};
</script>

<style>
.apexcharts-legend-series {
  white-space: nowrap;      /* Prevent line breaks */
  overflow: hidden;        /* Hide overflow */
  text-overflow: ellipsis; /* Add ellipsis for overflowed content */
  max-width: 150px;        /* Adjust the maximum width as needed */
}
</style>