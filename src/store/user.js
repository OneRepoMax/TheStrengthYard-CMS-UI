import { defineStore } from "pinia";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid'; 

export const useUserStore = defineStore("user", {
  state: () => ({
    emailAddress: null,
    firstName: null,
    lastName: null,
    contactNo: null,
    gender: null,
    homeAddress: null,
    postalCode: null,
    userType: null,
    verified: false,
  }),
  actions: {
    loadUserFromLocalStorage() {
      const storedUser = window.localStorage.getItem("tsyUserInfo");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        Object.assign(this, parsedUser);
      }
    },

    saveUserToLocalStorage() {
      const userStore = {
        emailAddress: this.emailAddress,
        firstName: this.firstName,
        lastName: this.lastName,
        contactNo: this.contactNo,
        gender: this.gender,
        homeAddress: this.homeAddress,
        postalCode: this.postalCode,
        userType: this.userType,
        verified: this.verified,
      };
      localStorage.setItem("tsyUserInfo", JSON.stringify(userStore));
    },

    async login(emailAddress, password) {
      try {
        let response = await axios.post("http://localhost:5000/login", {
          EmailAddress: emailAddress,
          Password: password,
        });

        // Handle the response data here
        if (response.status === 200) {
          this.emailAddress = response.data.EmailAddress;
          this.firstName = response.data.FirstName;
          this.lastName = response.data.LastName;
          this.contactNo = response.data.ContactNo;
          this.gender = response.data.Gender;
          this.homeAddress = response.data.HomeAddress;
          this.postalCode = response.data.PostalCode;
          this.userType = response.data.UserType;
          this.saveUserToLocalStorage();
        }

        return response;
      } catch (error) {
        // Handle errors here
        console.error("Login error:", error);
        return;
      }
    },

    async uploadAvatar(file) {
      const secretAccessKey = import.meta.env.VITE_S3_SECRET_KEY; // IAM user secret key
      const accessKeyId = import.meta.env.VITE_S3_ACCESS_KEY; // IAM user access id
      const bucket = import.meta.env.VITE_S3_BUCKET_NAME; // Bucket name
      const region = import.meta.env.VITE_S3_REGION; // Region

      const client = new S3Client({
        region,
        credentials: {
          secretAccessKey,
          accessKeyId,
        },
      });

      // Generate random file name
      const originalFileName = file.name
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
            s3Uri: `https://${bucket}.s3.${region}.amazonaws.com/${randomFileName}`
          };
        }
        return false;
      } catch (err) {
        console.error(err);
        return false;
      }
    },

    // Add the register action here in a similar manner
    async register(
      emailAddress,
      firstName,
      lastName,
      contactNo,
      gender,
      homeAddress,
      postalCode,
      password,
      dob,
      feedbackDiscover,
      ackTnC,
      ackGymRules,
      medicalHistory,
      MedicalRemarks
    ) {
      try {
        let response = await axios.post("http://localhost:5000/user", {
          EmailAddress: emailAddress,
          Password: password,
          FirstName: firstName,
          LastName: lastName,
          Gender: gender,
          DateOfBirth: dob,
          HomeAddress: homeAddress,
          PostalCode: postalCode,
          ContactNo: contactNo,
          UserType: "C",
          Verified: false,
          FeedbackDiscover: feedbackDiscover,
          MedicalHistory: medicalHistory,
          MedicalRemarks: MedicalRemarks,
          AcknowledgementTnC: ackTnC,
          AcknowledgementOpenGymRules: ackGymRules,
        });

        // Handle the response data here
        if (response.status === 200) {
          // Update the state or take necessary actions
          // For example, you might want to update the user's information or authentication status
          return response;
        }
      } catch (error) {
        // Handle errors here
        console.error("Registration error:", error);
      }
    },
  },
});
