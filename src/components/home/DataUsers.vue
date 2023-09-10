<template>
  <div>
    <apexchart
      type="line"
      :options="chartOptions"
      :series="series"
      height="300"
    />
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      series: [
        {
          name: "Total Users",
          data: [28, 29, 33, 36, 32, 32, 33],
        },
        {
          name: "Active Users",
          data: [12, 11, 14, 18, 17, 13, 13],
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
            colors: ['#77B6EA', '#545454'],
            dataLabels: {
              enabled: false,
            },
            title: {
              text: 'No. of Active Users',
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
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
              title: {
                text: 'Month'
              }
            },
            yaxis: {
              title: {
                text: 'No. of Users'
              },
              min: 5,
              max: 40
            },
            legend: {
              position: 'top',
              horizontalAlign: 'right',
              floating: true,
              offsetY: -25,
              offsetX: -5
            }
          },
    };
  },
};
</script>
