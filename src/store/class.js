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

export const useClassStore = defineStore("class", {
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
    async getclassById(classId) {
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
    async getMembershipLogByMembershipRecordId(membershipRecordId) {
      const apiUrl = `${TSY_API}/membershiplog/${membershipRecordId}`;

      try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          return response;
        }
        return response;
      } catch (error) {
        console.error(
          "An error occurred during get membership log by membership record ID:",
          error
        );
        return error.response;
      }
    },
      async updateClassById(classData, classId) {


        try {
          let response = await axios.put(`${TSY_API}/memberships/${classId}`, {
            Name: classData.name,
            Description: classData.description,
            Capacity: classData.capacity,
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

        const apiUrl = `${TSY_API}/memberships/${classId}`;
  
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

        console.log(classData);

        try {
          let response = await axios.post(`${TSY_API}/class`, {
            Name: classData.name,
            Description: classData.description,
            Capacity: classData.capacity,
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
