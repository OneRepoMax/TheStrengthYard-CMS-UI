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
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
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
          import(/* webpackChunkName: "home" */ "@/views/client/account/Login.vue"),
      },
      {
        path: "registration",
        name: "Register",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/client/account/Registration.vue"),
      },
      {
        path: "reset-password",
        name: "Reset Password",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/client/account/ResetPassword.vue"),
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
          import(/* webpackChunkName: "home" */ "@/views/client/profile/EditProfile.vue"),
      },
      {
        path: "change-password",
        name: "Change Password",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/client/profile/ChangePassword.vue"),
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
          import(/* webpackChunkName: "home" */ "@/views/client/classes/Book.vue"),
      },
    ],
  },
  {
    path: "/membership/",
    component: () => import("@/layouts/default/LoginDefault.vue"),
    children: [
      {
        path: "",
        name: "Book",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/client/membership/ManageMembership.vue"),
      },
    ],
  },
  {
    path: "/membership/payment/:id",
    component: () => import("@/layouts/default/LoginDefault.vue"),
    children: [
      {
        path: "",
        name: "Book",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/client/membership/MakePayment.vue"),
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
          import(/* webpackChunkName: "home" */ "@/views/client/classes/Schedule.vue"),
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
          import(/* webpackChunkName: "home" */ "@/views/staff/StaffHome.vue"),
      },
      {
        path: "account",
        name: "View Client Accounts",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/staff/account/ViewAccounts.vue"),
      },
      {
        path: "account/:id",
        name: "Manage Client Account",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/staff/account/ManageAccount.vue"),
      },
      {
        path: "membership",
        name: "Manage Memberships",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/staff/membership/ViewMembership.vue"),
      },
      {
        path: "membership/:id",
        name: "Edit Memberships",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/staff/membership/EditMembership.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;