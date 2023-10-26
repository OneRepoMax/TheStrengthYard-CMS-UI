<template>
  <div>
    <apexchart
      type="pie"
      :options="chartOptions"
      :series="series"
      height="220"
    />
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
      series: [],
      chartOptions: {
        chart: {
          // width: 380,
          height: 'auto',
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
        // plotOptions: {
        //   pie: {
        //     dataLabels: {
        //       offset: -5
        //     }
        //   }
        // },
        legend: {
          position: 'right',
          show: true,
        },
        // dataLabels: {
        //   formatter(val, opts) {
        //     const name = opts.w.globals.labels[opts.seriesIndex]
        //     return [name, val.toFixed(0) + '%']
        //   }
        // },
      },
    };
  },

  mounted() {
    this.getDemographic();
  },

  methods: {
    async getDemographic() {

      try {
        const response = await this.analyticsStore.getDemographic();
        console.log(response)
        if (response.status == 200){
          for (const key in response.data["Age Demographics"]){
            // console.log(key)
            // console.log(response.data["Age Demographics"][key])
            this.chartOptions.labels.push(key)
            this.series.push(response.data["Age Demographics"][key])
          }
        }
        
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