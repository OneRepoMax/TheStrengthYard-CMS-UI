import { defineStore } from "pinia";
import axios from "axios";

// Declare variable
const TSY_API = import.meta.env.VITE_TSY_API;

export const useAnalyticsStore = defineStore("analytics", {
  state: () => ({

  }),
  actions: {

    async getTotalUserCount() {
      const apiUrl = `${TSY_API}/analytics/totalusers`;

      try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          return response;
        }
        return response;
      } catch (error) {
        console.error(
          "An error occurred during get total user count API request:",
          error
        );

        return error.response;
      }
    },

    async getNewUsersThisMonth() {
      const apiUrl = `${TSY_API}/analytics/newmemberships/thismonth`;

      try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          return response;
        }
        return response;
      } catch (error) {
        console.error(
          "An error occurred during get new user count API request:",
          error
        );

        return error.response;
      }
    },

    async getBookingForEachClass() {
      const apiUrl = `${TSY_API}/analytics/totalbookings`;

      try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          return response;
        }
        return response;
      } catch (error) {
        console.error(
          "An error occurred during get booking for each class API request:",
          error
        );

        return error.response;
      }
    },

    async getDemographic() {
      const apiUrl = `${TSY_API}/analytics/userdemographics`;

      try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          return response;
        }
        return response;
      } catch (error) {
        console.error(
          "An error occurred during get demographics API request:",
          error
        );

        return error.response;
      }
    },
    
  },
});
