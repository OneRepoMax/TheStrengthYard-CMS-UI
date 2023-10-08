// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/LoginDefault.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/client/Home.vue"),
      },
    ],
  },
  {
    path: "/account/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "login",
        name: "Login",
        component: () =>
          import(/* webpackChunkName: "Login" */ "@/views/client/account/Login.vue"),
      },
      {
        path: "registration",
        name: "Register",
        component: () =>
          import(/* webpackChunkName: "Registration" */ "@/views/client/account/Registration.vue"),
      },
      {
        path: "reset-password",
        name: "Reset Password",
        component: () =>
          import(/* webpackChunkName: "ResetPassword" */ "@/views/client/account/ResetPassword.vue"),
      },
      
    ],
  },
  {
    path: "/profile/",
    component: () => import("@/layouts/default/LoginDefault.vue"),
    children: [
      {
        path: "edit",
        name: "Manage Profile",
        component: () =>
          import(/* webpackChunkName: "EditProfile" */ "@/views/client/profile/EditProfile.vue"),
      },
      {
        path: "change-password",
        name: "Change Password",
        component: () =>
          import(/* webpackChunkName: "ChangePassword" */ "@/views/client/profile/ChangePassword.vue"),
      },
    ],
  },
  {
    path: "/book/",
    component: () => import("@/layouts/default/LoginDefault.vue"),
    children: [
      {
        path: "",
        name: "Book",
        component: () =>
          import(/* webpackChunkName: "Book" */ "@/views/client/classes/Book.vue"),
      },
    ],
  },
  {
    path: "/membership/",
    component: () => import("@/layouts/default/LoginDefault.vue"),
    children: [
      {
        path: "purchase-membership",
        name: "Purchase Membership",
        component: () =>
          import(/* webpackChunkName: "PurchaseMembership" */ "@/views/client/membership/PurchaseMembership.vue"),
      },
      {
        path: "checkout",
        name: "Checkout Membership",
        props: true,
        component: () =>
          import(/* webpackChunkName: "Checkout" */ "@/views/client/payment/Checkout.vue"),
      },
    ],
  },
  {
    path: "/payment-history/",
    component: () => import("@/layouts/default/LoginDefault.vue"),
    children: [
      {
        path: "",
        name: "Payment History",
        component: () =>
          import(/* webpackChunkName: "Book" */ "@/views/client/payment/PaymentHistory.vue"),
      },
    ],
  },
  {
    path: "/schedule/",
    component: () => import("@/layouts/default/LoginDefault.vue"),
    children: [
      {
        path: "",
        name: "Schedule",
        component: () =>
          import(/* webpackChunkName: "Schedule" */ "@/views/client/classes/Schedule.vue"),
      },
    ],
  },
  {
    path: "/admin/",
    component: () => import("@/layouts/default/LoginDefault.vue"),
    children: [
      {
        path: "home",
        name: "Admin Home",
        component: () =>
          import(/* webpackChunkName: "StaffHome" */ "@/views/staff/StaffHome.vue"),
      },
      {
        path: "account",
        name: "View Client Accounts",
        component: () =>
          import(/* webpackChunkName: "ViewAccounts" */ "@/views/staff/account/ViewAccounts.vue"),
      },
      {
        path: "account/:id",
        name: "Manage Client Account",
        props: true,
        component: () =>
          import(/* webpackChunkName: "EditProfile" */ "@/views/client/profile/EditProfile.vue"),
      },
      {
        path: "membership",
        name: "Manage Memberships",
        component: () =>
          import(/* webpackChunkName: "ViewMembership" */ "@/views/staff/membership/ViewMembership.vue"),
      },
      {
        path: "membership/:id",
        name: "Edit Memberships",
        props: true,
        component: () =>
          import(/* webpackChunkName: "EditMembership" */ "@/views/staff/membership/EditMembership.vue"),
      },
      {
        path: "class",
        name: "Manage Class",
        component: () =>
          import(/* webpackChunkName: "ViewMembership" */ "@/views/staff/class/ViewClass.vue"),
      },
      {
        path: "class/:id",
        name: "Edit Class",
        props: true,
        component: () =>
          import(/* webpackChunkName: "EditMembership" */ "@/views/staff/membership/EditClass.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;