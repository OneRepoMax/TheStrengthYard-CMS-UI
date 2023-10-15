import { defineStore } from "pinia";
import axios from "axios";

// Declare variable
const TSY_API = import.meta.env.VITE_TSY_API;

export const useClassStore = defineStore("classDetails", {
  state: () => ({
    classId: null,
    name: null,
    description: null,
    capacity: null,
  }),
  actions: {
    async getAllClass() {
      const apiUrl = `${TSY_API}/class`;

      try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          return response;
        }
        return response;
      } catch (error) {
        console.error(
          "An error occurred during get all class API request:",
          error
        );

        return error.response;
      }
    },
    async getClassById(classId) {
      const apiUrl = `${TSY_API}/class/${classId}`;

      try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          return response;
        }
        return response;
      } catch (error) {
        console.error(
          "An error occurred during get class by ID API request:",
          error
        );

        return error.response;
      }
    },
    async getClassSlotById(classSlotId) {
      const apiUrl = `${TSY_API}/classSlot/${classSlotId}`;

      try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          console.log(response);
          return response;
        }
        return response;
      } catch (error) {
        console.error(
          "An error occurred during get class by ID API request:",
          error
        );

        return error.response;
      }
    },

    async updateClassById(classData, classId) {
      try {
        let response = await axios.put(`${TSY_API}/class/${classId}`, {
          ClassName: classData.name,
          Description: classData.description,
          MaximumCapacity: classData.capacity,
        });

        // Handle the response data here
        if (response.status === 200) {
          return response;
        }
      } catch (error) {
        console.error("Update error:", error);
        return;
      }
    },

    async updateClassSlotById(classSlotData, classSlotId) {
      try {
        let response = await axios.put(`${TSY_API}/classSlot/${classSlotId}`, {
          Day: classSlotData.day,
          StartTime: classSlotData.startTime,
          EndTime: classSlotData.endTime,
        });

        // Handle the response data here
        if (response.status === 200) {
          return response;
        }
      } catch (error) {
        console.error("Update error:", error);
        return;
      }
    },

    async deleteClassById(classId) {
      const apiUrl = `${TSY_API}/class/${classId}`;

      try {
        const response = await axios.delete(apiUrl);

        // Handle the response data here
        if (response.status === 200) {
          return response;
        }
      } catch (error) {
        console.error("Deletion error:", error);
        return;
      }
    },

    async deleteClassSlotById(classSlotId) {
      const apiUrl = `${TSY_API}/classSlot/${classSlotId}`;

      try {
        const response = await axios.delete(apiUrl);

        // Handle the response data here
        if (response.status === 200) {
          return response;
        }
      } catch (error) {
        console.error("Deletion error:", error);
        return;
      }
    },

    async createClass(classData) {
      try {
        let response = await axios.post(`${TSY_API}/class`, {
          ClassName: classData.name,
          Description: classData.description,
          MaximumCapacity: classData.capacity,
        });
        // Handle the response data here
        if (response.status === 201) {
          return response;
        }
      } catch (error) {
        console.error("Creation error:", error);
        return;
      }
    },

    async createClassSlot(classSlotData, classId, RecurringUntil) {
      try {
        let response = await axios.post(
          `${TSY_API}/class/${classId}/classSlot`,
          {
            Day: classSlotData.day,
            StartTime: classSlotData.startTime,
            EndTime: classSlotData.endTime,
            RecurringUntil: RecurringUntil,
          }
        );
        // Handle the response data here
        if (response.status === 201) {
          return response;
        }
      } catch (error) {
        console.error("Creation error:", error);
        return;
      }
    },

    async getAllClassSlot() {
      const apiUrl = `${TSY_API}/classSlot`;
      try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          return response;
        }
        return response;
      } catch (error) {
        console.error("An error occurred during get class slots:", error);
      }
    },

    async getClassSlotByDate(date) {
      const apiUrl = `${TSY_API}/classSlot/slots/${date}`;

      try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          console.log(response);
          return response;
        }
        return response;
      } catch (error) {
        console.error(
          "An error occurred during get class by ID API request:",
          error
        );

        return error.response;
      }
    },

    async deleteClassSlotsById(classIds) {

      const apiUrl = `${TSY_API}/classSlot/delete`;

      try {
        const response = await axios.post(apiUrl, {
            ClassSlotIdList: classIds,
        });

        // Handle the response data here
        if (response.status === 200) {
          return response;
        }
      } catch (error) {
        console.error("Deletion error:", error);
        return;
      }
    },
    async getAllBookingByClassSlotId(classSlotId) {
        const apiUrl = `${TSY_API}/booking/classSlot/${classSlotId}`;
    
        try {
            const response = await axios.get(apiUrl);
    
            if (response.status === 200) {
            console.log(response);
            return response;
            }
            return response;
        } catch (error) {
            console.error(
            "An error occurred during get class by ID API request:",
            error
            );
    
            return error.response;
        }
    }
  },
});
