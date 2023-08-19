import { defineStore } from "pinia";
import axios from "axios";

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
    userName: null,
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
        userName: this.Username,
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
          this.emailAddress = response.data.EmailAddress;
          this.firstName = response.data.FirstName;
          this.lastName = response.data.LastName;
          this.contactNo = response.data.ContactNo;
          this.gender = response.data.Gender;
          this.homeAddress = response.data.HomeAddress;
          this.postalCode = response.data.PostalCode;
          this.userType = response.data.UserType;
          this.userName = response.data.Username;
          this.saveUserToLocalStorage();
        }

        return response;

      } catch (error) {
        // Handle errors here
        console.error("Login error:", error);
        return;
      }
    },

    // Add the register action here in a similar manner
    async register() {
      try {
        const response = await axios.post("http://example-api/register/", {
          emailAddress: this.emailAddress,
          firstName: this.firstName,
          lastName: this.lastName,
          password: this.password,
        });

        // Handle the response data here
        if (response.status === 201) {
          // Update the state or take necessary actions
          // For example, you might want to update the user's information or authentication status
          this.verified = false; // Assuming newly registered users are not automatically verified
        }
      } catch (error) {
        // Handle errors here
        console.error("Registration error:", error);
      }
    },
  },
});
