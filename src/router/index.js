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
          import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
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
          import(/* webpackChunkName: "home" */ "@/views/Login.vue"),
      },
      {
        path: "registration",
        name: "Register",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/Registration.vue"),
      },
      {
        path: "reset-password",
        name: "Reset Password",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/ResetPassword.vue"),
      },
      
    ],
  },
  {
    path: "/profile/",
    component: () => import("@/layouts/default/LoginDefault.vue"),
    children: [
      {
        path: "view",
        name: "Profile",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/Profile.vue"),
      },
      {
        path: "edit",
        name: "Edit Profile",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/EditProfile.vue"),
      },
      {
        path: "change-password",
        name: "Change Password",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/ChangePassword.vue"),
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
          import(/* webpackChunkName: "home" */ "@/views/Book.vue"),
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
          import(/* webpackChunkName: "home" */ "@/views/Schedule.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;