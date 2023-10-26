<template>
  <div>
    <apexchart
      type="bar"
      :options="chartOptions"
      :series="series"
      height="300"
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
      series: [
        {
          name: "Total Users",
          data: [],
        },
      ],
      chartOptions: {
            chart: {
              background: '#fff',
              height: 350,
              type: 'line',
              toolbar: {
                show: false
              },
            },
            plotOptions: {
              bar: {
                horizontal: true,
              }
            },
            colors: ['#77B6EA'],
            dataLabels: {
              enabled: false,
            },
            title: {
              text: 'No. of bookings for each class',
              align: 'left'
            },
            grid: {
              borderColor: '#e7e7e7',
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
              },
            },
            markers: {
              size: 1
            },
            xaxis: {
              categories: [],
              title: {
                text: 'No. of Bookings'
              }
            },
            // yaxis: {
            //   title: {
            //     text: 'Classes'
            //   },
            // },
          },
    };
  },

  mounted() {
    this.getBookingForEachClass();
  },

  methods: {
    async getBookingForEachClass() {

      try {
        const response = await this.analyticsStore.getBookingForEachClass();
        
        if (response.status == 200){
          for (const key in response.data){
            if (key != "Total"){
              this.chartOptions.xaxis.categories.push(key)
              this.series[0].data.push(response.data[key])
            }
          }
        }
        
        return

    } catch (error) {
        console.error("An error occurred during get all membership API request:", error);
    }
    
    return

    },


  },
  
};
</script>
