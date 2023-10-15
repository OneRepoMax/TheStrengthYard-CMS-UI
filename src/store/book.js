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

export const useBookStore = defineStore("bookDetails", {
  state: () => ({
    bookingDateTime: null,
    bookingId: null,
    classSlotId: null,
    // classId: null,
    membershipRecordId: null,
    status: null,
    userId: null,
  }),
  actions: {
    async getAllBooking() {
      const apiUrl = `${TSY_API}/booking`;

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
  },
});
