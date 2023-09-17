import { defineStore } from "pinia";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Declare variable
const TSY_API = import.meta.env.VITE_TSY_API;
const secretAccessKey = import.meta.env.VITE_S3_SECRET_KEY; // IAM user secret key
const accessKeyId = import.meta.env.VITE_S3_ACCESS_KEY; // IAM user access id
const bucket = import.meta.env.VITE_S3_BUCKET_ADMIN_NAME; // Bucket name
const region = import.meta.env.VITE_AWS_REGION; // Region

export const useMembershipStore = defineStore("membership", {
  state: () => ({
    membershipId: null,
    title: null,
    description: null,
    type: null,
    basefee: null,
    picture: null,
  }),
  actions: {
    async uploadPicture(file) {
      const client = new S3Client({
        region,
        credentials: {
          secretAccessKey,
          accessKeyId,
        },
      });

      // Generate random file name
      const originalFileName = file.name;
      const extension = originalFileName.split(".").pop(); // Get the file extension

      const tempRandomFileName = uuidv4();

      const randomFileName = `${tempRandomFileName}.${extension}`;

      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: randomFileName,
        Body: file,
      });

      try {
        const response = await client.send(command);
        if (response.$metadata.httpStatusCode == 200) {
          // Access link will be this one
          return {
            status: 200,
            s3Uri: `https://${bucket}.s3.${region}.amazonaws.com/${randomFileName}`,
          };
        }
        return false;
      } catch (err) {
        console.error(err);
        return false;
      }
    },

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
    async getMembershipById(membershipId) {
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
          "An error occurred during get membership log by membership record ID:",
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

      async updateMembershipById(membershipData, membershipId) {


        try {
          let response = await axios.put(`${TSY_API}/memberships/${membershipId}`, {
            Title: membershipData.title,
            Description: membershipData.description,
            Type: membershipData.type,
            BaseFee: membershipData.basefee,
            Picture: membershipData.picture
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

      async deleteMembershipById(membershipId) {

        const apiUrl = `${TSY_API}/memberships/${membershipId}`;
  
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

      async createMembership(membershipData) {

        try {
          let response = await axios.post(`${TSY_API}/memberships`, {
            Title: membershipData.title,
            Description: membershipData.description,
            Type: membershipData.type,
            BaseFee: membershipData.basefee,
            Picture: membershipData.picture
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
      async getMembershipLogsByMembershipRecordID(userId){
        const apiUrl = `${TSY_API}/membershiprecord/${userId}`;
    
        try {
          const response = await axios.get(apiUrl);
    
          if (response.status === 200) {
            return response;
          }
          return response;
        } catch (error) {
          console.error(
            "An error occurred during get membership Record by ID API request:",
            error
          );
        }
      },

      async getAllMembershipRecords(){
        const apiUrl = `${TSY_API}/membershiprecord`;
        try {
          const response = await axios.get(apiUrl);
  
          if (response.status === 200) {
            return response;
          }
          return response;
        } catch (error) {
          console.error(
            "An error occurred during get membership Record:",
            error
          );
        }
      },

      async getMembershipRecordsByFilter(status){
        const apiUrl = `${TSY_API}/membershiprecord/filter`;
        const data = {
          ActiveStatus: status,
        };
        try {
          const response = await axios.post(apiUrl, data);
  
          if (response.status === 200) {
            return response;
          }
          return response;
        } catch (error) {
          console.error(
            "An error occurred during get membership Record by filter:",
            error
          );
        }
      },

      async addMembershipRecord(payload){
        const apiUrl = `${TSY_API}/membershiprecord`;
        const data = {
             UserId: payload.userId,
             MembershipTypeId: payload.membershipTypeId,
             StartDate: payload.startDate,
             EndDate: payload.endDate,
             ActiveStatus: payload.status,
             PayPalSubscriptionId: payload.subscriptionId,
        }
        try {
            const response = await axios.post(apiUrl, data);
    
            if (response.status === 200) {
              return response;
            }
            return response;
          } catch (error) {
            console.error(
              "An error occurred during add membership Record:",
              error
            );
          }
      } 
  },


});
