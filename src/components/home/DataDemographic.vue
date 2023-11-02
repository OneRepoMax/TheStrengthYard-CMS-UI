<template>
  <div>
    <v-select
        v-model="selectedDataset"
        :items="['Age', 'Gender']"
        label="Select Category"
        variant="outlined"
        density="compact"
        required
    ></v-select>

    <div style="height: 250px;">
      <apexchart
        type="pie"
        :options="chartOptions"
        :series="series"
        height="245"
      />
    </div>
  </div>
</template>


<script>
import VueApexCharts from "vue3-apexcharts";
import { useAnalyticsStore } from '@/store/analytics'

export default {
  components: {
    apexchart: VueApexCharts,
  },

  setup () {
    const analyticsStore = useAnalyticsStore();
    return { analyticsStore }
  },

  data() {
    return {
      selectedDataset: "Gender", // Default to gender dataset
      series: [],
      chartOptions: {
        chart: {
          height: "245",
          type: 'pie',
        },
        theme: {
          monochrome: {
            enabled: false
          }
        },
        labels: [],
        title: {
          text: 'Client Demographics',
          align: 'left'
        },
        legend: {
          position: 'right',
          show: true,
        },
      },
    };
  },

  mounted() {
    this.getDemographic();
  },

  watch: {
    selectedDataset(){
      this.getDemographic();
      console.log(this.chartOptions.labels)
      console.log(this.series)
    }
  },

  methods: {
    async getDemographic() {
      
      try {
        const response = await this.analyticsStore.getDemographic();
        console.log(response)
        console.log(this.selectedDataset)
        if (response.status == 200){
          this.chartOptions.labels = [];
          this.series = [];

          if (this.selectedDataset == "Gender") {
            // this.chartOptions.labels = Object.keys(response.data["Gender Demographics"])
            this.series = Object.values(response.data["Gender Demographics"])
            this.chartOptions = {
              chart: {
                height: "245",
                type: 'pie',
              },
              theme: {
                monochrome: {
                  enabled: false
                }
              },
              labels: Object.keys(response.data["Gender Demographics"]),
              title: {
                text: 'Client Demographics',
                align: 'left'
              },
              legend: {
                position: 'right',
                show: true,
              },
            }
          } else if (this.selectedDataset == "Age") {
            this.series = Object.values(response.data["Age Demographics"])
            this.chartOptions = {
              chart: {
                height: "245",
                type: 'pie',
              },
              theme: {
                monochrome: {
                  enabled: false
                }
              },
              labels: Object.keys(response.data["Age Demographics"]),
              title: {
                text: 'Client Demographics',
                align: 'left'
              },
              legend: {
                position: 'right',
                show: true,
              },
            }
          }

        }
        // this.chartOptions.labels = Object.keys(response.data["Age Demographics"])
        //     this.series = Object.values(response.data["Age Demographics"])
        return

    } catch (error) {
        console.error("An error occurred during get demographics API request:", error);
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