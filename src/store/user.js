import { defineStore } from "pinia";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Declare variable
const TSY_API = import.meta.env.VITE_TSY_API;
const secretAccessKey = import.meta.env.VITE_S3_SECRET_KEY; // IAM user secret key
const accessKeyId = import.meta.env.VITE_S3_ACCESS_KEY; // IAM user access id
const bucket = import.meta.env.VITE_S3_BUCKET_NAME; // Bucket name
const region = import.meta.env.VITE_AWS_REGION; // Region

export const useUserStore = defineStore("user", {
  state: () => ({
    userId: null,
    emailAddress: null,
    firstName: null,
    lastName: null,
    dateOfBirth: null,
    gender: null,
    homeAddress: null,
    postalCode: null,
    contactNo: null,
    password: null,
    confirmPassword: null,
    userType: null,
    verified: false,
    displayPicture: null,
    FeedbackDiscover: [],
    otherFeedbackDiscover: "",
    MedicalHistory: [],
    otherMedicalHistory: "",
    MedicalRemarks: "",
    AcknowledgementOpenGymRules: false,
    AcknowledgementTnC: false,
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
        userId: this.userId,
        emailAddress: this.emailAddress,
        firstName: this.firstName,
        lastName: this.lastName,
        gender: this.gender,
        dateOfBirth: this.dateOfBirth,
        homeAddress: this.homeAddress,
        postalCode: this.postalCode,
        contactNo: this.contactNo,
        password: this.password,
        confirmPassword: this.confirmPassword,
        userType: this.userType,
        verified: this.verified,
        displayPicture: this.displayPicture,
        FeedbackDiscover: this.FeedbackDiscover,
        otherFeedbackDiscover: this.otherFeedbackDiscover,
        MedicalHistory: this.MedicalHistory,
        otherMedicalHistory: this.otherMedicalHistory,
        MedicalRemarks: this.MedicalRemarks,
        AcknowledgementOpenGymRules: this.AcknowledgementOpenGymRules,
        AcknowledgementTnC: this.AcknowledgementTnC,
      };
      localStorage.setItem("tsyUserInfo", JSON.stringify(userStore));
    },

    saveResponseToStore(response) {
      // format DateOfBirth
      const dob = new Date(response.data.DateOfBirth);
      const year = dob.getUTCFullYear();
      const month = String(dob.getUTCMonth() + 1).padStart(2, "0");
      const day = String(dob.getUTCDate()).padStart(2, "0");
      const formattedDob = `${year}-${month}-${day}`

      this.userId = response.data.UserId;
      this.emailAddress = response.data.EmailAddress;
      this.firstName = response.data.FirstName;
      this.lastName = response.data.LastName;
      this.contactNo = response.data.ContactNo;
      this.gender = response.data.Gender;
      this.dateOfBirth = formattedDob;
      this.homeAddress = response.data.HomeAddress;
      this.postalCode = response.data.PostalCode;
      this.userType = response.data.UserType;
      this.displayPicture = response.data.DisplayPicture;
      this.saveUserToLocalStorage();
    },

    async getUserInfo() {
      try {
        let response = await axios.get(`${TSY_API}/user/${this.userId}`);

        console.log(response);

        // Handle the response data here
        if (response.status === 200) {
          this.saveResponseToStore(response);
          this.saveUserToLocalStorage();
          return;
        }
      } catch (error) {
        console.error("Get User Info error:", error);
        return;
      }
    },

    async login(emailAddress, password) {
      try {
        let response = await axios.post(`${TSY_API}/login`, {
          EmailAddress: emailAddress,
          Password: password,
        });

        // Handle the response data here
        if (response.status === 200) {
          this.saveResponseToStore(response);
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

    // Add the register action here in a similar manner
    async register(
      emailAddress,
      firstName,
      lastName,
      gender,
      dob,
      homeAddress,
      postalCode,
      contactNo,
      password,
      displayPicture,
      feedbackDiscover,
      medicalHistory,
      MedicalRemarks,
      ackTnC,
      ackGymRules
    ) {
      try {
        let response = await axios.post(`${TSY_API}/register`, {
          EmailAddress: emailAddress,
          FirstName: firstName,
          LastName: lastName,
          Gender: gender,
          DateOfBirth: dob,
          HomeAddress: homeAddress,
          PostalCode: postalCode,
          ContactNo: contactNo,
          Password: password,
          UserType: "C",
          DisplayPicture: displayPicture,
          Verified: false,
          FeedbackDiscover: feedbackDiscover,
          MedicalHistory: medicalHistory,
          MedicalRemarks: MedicalRemarks,
          AcknowledgementTnC: ackTnC,
          AcknowledgementOpenGymRules: ackGymRules,
        });

        // Handle the response data here
        if (response.status === 200) {
          this.userId = response.UserId;
          this.saveResponseToStore(response);
          this.saveUserToLocalStorage();
          return response;
        }
      } catch (error) {
        console.error("Registration error:", error);
      }
    },

    async updateProfile(profileData) {
      try {
        let response = await axios.put(`${TSY_API}/user/${this.userId}`, {
          FirstName: profileData.firstName,
          LastName: profileData.lastName,
          ContactNo: profileData.contactNo,
          HomeAddress: profileData.homeAddress,
          PostalCode: profileData.postalCode,
          Gender: profileData.gender,
          DateOfBirth: profileData.dateOfBirth,
          DisplayPicture: profileData.displayPicture,
        });

        // Handle the response data here
        if (response.status === 200) {
          this.saveResponseToStore(response);
          this.saveUserToLocalStorage();
          return response;
        }
      } catch (error) {
        console.error("Registration error:", error);
        return;
      }
    },
    async changePassword(userId, newPassword) {
      const apiUrl = `${TSY_API}/user/${userId}`;
      const data = {
        Password: newPassword,
      };
      try {
        const response = await axios.put(apiUrl, data);

        if (response.status === 200) {
          this.password = response.data.Password;
          console.log("Password changed successfully");
          // this.saveUserToLocalStorage();
        } else {
          console.log("Password reset failed:", response.data);
        }
        return response;
      } catch (error) {
        console.error("An error occurred during the API request:", error);
      }
    },
    async resetPassword(emailAddress) {
      const apiUrl = `${TSY_API}/resetpassword`;
      const data = {
        EmailAddress: emailAddress,
      };
      try {
        const response = await axios.post(apiUrl, data);

        if (response.status === 200) {
          this.password = response.data.Password;
          console.log("Password reset successfully");
          return response;
        } else {
          console.log("Password reset failed:", response.data);
        }
        return response;
      } catch (error) {
        console.error("An error occurred during the API request:", error);
      }
    },
  },
});
