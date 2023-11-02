<template>
  <div>
    <v-select
        v-model="selectedDataset"
        :items="this.classNames"
        label="Select Class"
        variant="outlined"
        density="compact"
        required
    ></v-select>

    <div v-if="this.series.length == 0">
      <div style="height: 250px;" class="d-flex align-center justify-center">
        <p class="text-center">There is no time slots for this class</p>
      </div>
    </div>
    <div v-else style="height: 250px;">
      <apexchart 
        type="heatmap"
        :options="chartOptions"
        :series="series"
        height="230"
      />
    </div>

    
  </div>
</template>


<script>
import VueApexCharts from "vue3-apexcharts";
import { useAnalyticsStore } from '@/store/analytics'
import { useClassStore } from '@/store/class'


export default {
  components: {
    apexchart: VueApexCharts,
  },

  setup () {
    const analyticsStore = useAnalyticsStore();
    const classStore = useClassStore()
    return { analyticsStore, classStore }
  },

  data() {
    return {
      classId: 300,
      classList: [],
      classNames: [],
      selectedDataset: "",
      uniqueTimeSlot: [],
      series: [],
      chartOptions: {
        chart: {
          height: 350,
          type: 'heatmap',
          toolbar: {show: false},
        },
        dataLabels: {
          enabled: false
        },
        tooltip: {
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            const value = series[seriesIndex][dataPointIndex] -1;
            // Check if the value is -1 and customize the tooltip content
            if (value === -1) {
              return `<div class="tooltip-custom">0</div>`;
            }
            // Default tooltip content for other values
            return `<div class="tooltip-custom">${value}</div>`;
          },
        },
        xaxis: {
          type: 'category',
          categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // Add more days if needed
        },
        colors: ["#008FFB"],
        title: {
          text: 'Peak Time Slots'
        },
      },
    };
  },

  mounted() {
    this.peakTimings();
    this.getClass();
  },

  watch: {
    selectedDataset(){
      this.classId = this.getClassId(this.selectedDataset)
      this.peakTimings();
    }
  },

  methods: {
    async getClass() {

      try {
        const response = await this.classStore.getAllClass();
        console.log(response.data)
        if (response.status == 200){
          for (const item of response.data){
            this.classNames.push(item.ClassName)
            const info = {
              classId: item.ClassId,
              className: item.ClassName
            }
            this.classList.push(info)
          }

        }
        this.selectedDataset = this.classNames[0]
        // console.log(this.selectedDataset)
        // console.log(this.getClassId(this.selectedDataset))
        return

    } catch (error) {
        console.error("An error occurred during get demographics API request:", error);
    }
    
    return
    },

    getClassId(className){
      return(this.classList.find(item => item.className == className).classId)
    },

    getIndex(day){
      if (day == "Sunday"){return 0} 
      else if (day == "Monday"){return 1} 
      else if (day == "Tuesday"){return 2} 
      else if (day == "Wednesday"){return 3} 
      else if (day == "Thursday"){return 4} 
      else if (day == "Friday"){return 5} 
      else if (day == "Saturday"){return 6} 
    },

    convertTime(hour){
      var hourStr = hour.toString();
      if (hourStr.length == 1){return `0${hour}00`}
      else {return `${hour}00`}
    },

    async peakTimings() {
      
      try {
        const response = await this.analyticsStore.peakTimings(this.classId);

        if (response.status == 200){

          this.uniqueTimeSlot = []
          const tempSeries = []
          for (const slots of response.data["Time Slots"]){
            if (!this.uniqueTimeSlot.includes(this.convertTime(slots.hour))){
              this.uniqueTimeSlot.push(this.convertTime(slots.hour))
              const info = {
                name: this.convertTime(slots.hour),
                data: [0, 0, 0, 0, 0, 0, 0],
              }
              info.data[this.getIndex(slots.day)] = Number(slots.Bookings_This_Month) + 1
              tempSeries.push(info)
            } else {
              const targetObject = tempSeries.find(item => item.name == this.convertTime(slots.hour))
              targetObject.data[this.getIndex(slots.day)] = Number(slots.Bookings_This_Month) + 1
            }
          }

          this.series = tempSeries;
          
          console.log(this.uniqueTimeSlot)
          console.log(this.series)
        }
        return

    } catch (error) {
        console.error("An error occurred during get peak timing API request:", error);
    }
    
    return

    },

  }
};
</script>

<style>
.tooltip-custom {
  background-color: #0078D4;
  color: white;
  padding: 8px;
}
</style>