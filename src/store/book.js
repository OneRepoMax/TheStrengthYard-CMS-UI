import { defineStore } from "pinia";
import axios from "axios";

// Declare variable
const TSY_API = import.meta.env.VITE_TSY_API;

export const useBookStore = defineStore("book", {
  state: () => ({
    bookingDateTime: null,
    bookingId: null,
    classSlotId: null,
    status: null,
    userId: null,
  }),
  actions: {

    async createBooking(UserId, ClassSlotId) {

      try {
        let response = await axios.post(`${TSY_API}/booking2`, {
          UserId: UserId,
          ClassSlotId: ClassSlotId,
        });

        // Handle the response data here
        if (response.status === 201) {
          return response;
        }
      } catch (error) {
        console.error("Creation error:", error);
        return error;
      }
    },
    
    async getAllBookingByUserId(userId) {
      const apiUrl = `${TSY_API}/booking/user/${userId}`;

      try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          return response;
        }
        return response;
      } catch (error) {
        console.error(
          "An error occurred during get all booking API request:",
          error
        );

        return error.response;
      }
    },

    async getPointHistoryPaidByMembershipRecordId(membershipRecordId) {
        const apiUrl = `${TSY_API}/pointsHistory/user/${membershipRecordId}`;
    
        try {
            const response = await axios.get(apiUrl);
    
            if (response.status === 200) {
            return response;
            }
            return response;
        } catch (error) {
            console.error(
            "An error occurred during get all booking API request:",
            error
            );
    
            return error.response;
        }
        }

     
  },


});
