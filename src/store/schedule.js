import { defineStore } from "pinia";
import axios from "axios";

// Declare variable
const TSY_API = import.meta.env.VITE_TSY_API;

export const useScheduleStore = defineStore("schedule", {
  state: () => ({}),
  actions: {
    async getSchedule() {
      const apiUrl = `${TSY_API}/schedule`;

      try {
        const response = await axios.get(apiUrl);


        // Sorter
        if (response.status === 200) {
            this.schedules = response.data.sort((a, b) => {
                const dateA = new Date(a.PublishDate);
                const dateB = new Date(b.PublishDate);
                return dateB - dateA;
              });
              
              return response;
        }
      } catch (error) {
        console.error(
          "An error occurred during get schedule API request:",
          error
        );

        return error.response;
      }
    },

    async deleteScheduleById(id) {
      const apiUrl = `${TSY_API}/schedule/${id}`;

      try {
        const response = await axios.delete(apiUrl);

        if (response.status === 200) {
          return response;
        }
      } catch (error) {
        console.error(
          "An error occurred during delete schedule API request:",
          error
        );

        return error.response;
      }
    },

    async postSchedule(schedule) {
      const apiUrl = `${TSY_API}/schedule`;

      try {
        const response = await axios.post(apiUrl, schedule);

        if (response.status === 200) {
          return response;
        }
      } catch (error) {
        console.error(
          "An error occurred during post schedule API request:",
          error
        );

        return error.response;
      }
    },
  },
});
