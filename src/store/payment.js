import { defineStore } from "pinia";
import axios from "axios";

// Declare variable
const TSY_API = import.meta.env.VITE_TSY_API;

export const usePaymentStore = defineStore("payment", {
  state: () => ({

  }),
  actions: {

    async getAllPayments() {
      const apiUrl = `${TSY_API}/payments`;

      try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          return response;
        }
        return response;
      } catch (error) {
        console.error(
          "An error occurred during get all payment API request:",
          error
        );

        return error.response;
      }
    },
    async getPaymentsByMembershipRecordId(membershipRecordId) {
      const apiUrl = `${TSY_API}/payments/history/membershiprecord/${membershipRecordId}`;

      try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          return response;
        }
        return response;
      } catch (error) {
        console.error(
          "An error occurred during get payment by membership record ID API request:",
          error
        );

        return error.response;
      }
    },
     
  },


});
