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

export const useMembershipStore = defineStore("membership", {
  state: () => ({
    membershipId: null,
  }),
  actions: {
    async getAllMembership() {
      const apiUrl = `${TSY_API}/memberships`;

      try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          return response;
        }
        return response;
      } catch (error) {
        console.error(
          "An error occurred during get all membership API request:",
          error
        );

        return error.response;
      }
    },
    async getAllMembershipById(membershipId) {
      const apiUrl = `${TSY_API}/memberships/${membershipId}`;

      try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          return response;
        }
        return response;
      } catch (error) {
        console.error(
          "An error occurred during get membership by ID API request:",
          error
        );

        return error.response;
      }
    },
    async getMembershipRecordByUserId(userId) {
      const apiUrl = `${TSY_API}/membershiprecord/${userId}`;

      try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          return response;
        }
        return response;
      } catch (error) {
        console.error(
          "An error occurred during get membership by userId API request:",
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
          "An error occurred during get membership log by membershyip record ID:",
          error
        );
        return error.response;
      }
    },
    async addMembershipLog(payload) {
      const apiUrl = `${TSY_API}/membershiplog`;

      try {
        const response = await axios.post(apiUrl, {
          Date: payload.date,
          ActionType: payload.actionType,
          Description: payload.description,
          MembershipRecordId: payload.membershipRecordId,
        });

        if (response.status === 200) {
          return response;
        }
        return response;
      } catch (error) {
        console.error("An error occurred during POST membership log:", error);
        return error.response;
      }
    },
    async updateMembershipRecord(payload) {

      const membershipRecordId = payload.membershipRecordId;
      const apiUrl = `${TSY_API}/membershiprecord/${membershipRecordId}`;

      try {
        const response = await axios.put(apiUrl, {
            MembershipRecordId: membershipRecordId,
            StartDate: payload.startDate,
            EndDate: payload.endDate,
            ActiveStatus: payload.status
        });

        if (response.status === 200) {
          return response;
        }
        return response;
      } catch (error) {
        console.error(
          "An error occurred updating membership log by membership record ID:",
          error
        );
        return error.response;
      }
    },
    async deleteMembershipRecord(membershipRecordId){
        const apiUrl = `${TSY_API}/membershiprecord/${membershipRecordId}`;

      try {
        const response = await axios.delete(apiUrl);

        if (response.status === 200) {
          return response;
        }
        return response;
      } catch (error) {
        console.error(
          "An error occurred updating membership log by membership record ID:",
          error
        );
        return error.response;
      }
    },
    async createMembershipLog(payload) {

        const apiUrl = `${TSY_API}/membershiplog`;
  
        try {
          const response = await axios.post(apiUrl, {
              MembershipRecordId: payload.membershipRecordId,
              Date: payload.date,
              ActionType: payload.actionType,
              Description: payload.description,
          });
  
          if (response.status === 200) {
            return response;
          }
          return response;
        } catch (error) {
          console.error(
            "An error occurred when creating membership log by membership record ID:",
            error
          );
          return error.response;
        }
      },
  },
});
