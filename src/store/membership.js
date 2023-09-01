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
  },
});
