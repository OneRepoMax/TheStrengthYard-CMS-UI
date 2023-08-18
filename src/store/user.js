import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    emailAddress: null,
    firstName: null,
    lastName: null,
    password: null,
    verified: false,
  }),
  actions: {
    loadUserFromLocalStorage() {
      const storedUser = localStorage.getItem("userInfo");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        Object.assign(this, parsedUser);
      }
    },

    saveUserToLocalStorage() {
      const userToStore = {
        emailAddress: this.emailAddress,
        firstName: this.firstName,
        lastName: this.lastName,
        verified: this.verified,
      };
      localStorage.setItem("userInfo", JSON.stringify(userToStore));
    },

    async login() {
      try {
        const response = await axios.post("http://example-api/login/", {
          emailAddress: this.emailAddress,
          password: this.password,
        });

        // Handle the response data here
        if (response.status === 200) {
          // Update the state or do something else with the response data
          // For example, you might want to update the user's information or authentication status
          this.firstName = response.data.firstName;
          this.lastName = response.data.lastName;
          this.verified = response.data.verified;
          this.saveUserToLocalStorage()
        }
      } catch (error) {
        // Handle errors here
        console.error("Login error:", error);
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
