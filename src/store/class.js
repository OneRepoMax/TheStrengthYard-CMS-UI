import { defineStore } from "pinia";
// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import axios from "axios";
// import { v4 as uuidv4 } from "uuid";

// Declare variable
const TSY_API = import.meta.env.VITE_TSY_API;
// const secretAccessKey = import.meta.env.VITE_S3_SECRET_KEY; // IAM user secret key
// const accessKeyId = import.meta.env.VITE_S3_ACCESS_KEY; // IAM user access id
// const bucket = import.meta.env.VITE_S3_BUCKET_ADMIN_NAME; // Bucket name
// const region = import.meta.env.VITE_AWS_REGION; // Region

export const useClassStore = defineStore("classDetails", {
  state: () => ({
    classId: null,
    name: null,
    description: null,
    capacity: null,
    // basefee: null,
    // setupfee: null,
    // visibility: null,
    // picture: null,
    // membershipRecord: null,
    // selectedMembership: null,
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
          console.log(response)
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
          let response = await axios.post(`${TSY_API}/class/${classId}/classSlot`, {
            Day: classSlotData.day,
            StartTime: classSlotData.startTime,
            EndTime: classSlotData.endTime,
            RecurringUntil: RecurringUntil,
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

      async getAllClassSlot(){
        const apiUrl = `${TSY_API}/classSlot`;
        try {
          const response = await axios.get(apiUrl);
  
          if (response.status === 200) {
            return response;
          }
          return response;
        } catch (error) {
          console.error(
            "An error occurred during get class slots:",
            error
          );
        }
      },

  },


});
