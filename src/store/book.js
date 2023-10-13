import { defineStore } from "pinia";
import axios from "axios";

// Declare variable
const TSY_API = import.meta.env.VITE_TSY_API;

export const useBookStore = defineStore("book", {
  state: () => ({

  }),
  actions: {

    async createBooking(MembershipRecordId, UserId, ClassSlotId) {

      try {
        let response = await axios.post(`${TSY_API}/booking`, {
          MembershipRecordId: MembershipRecordId,
          UserId: UserId,
          ClassSlotId: ClassSlotId,
        });

        // Handle the response data here
        if (response.status === 200) {
          return response;
        }
      } catch (error) {
        console.error("Creation error:", error);
        return;
      }
    },

     
  },


});
