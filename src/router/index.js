// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
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
        path: "register",
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
      {
        path: "edit-profile",
        name: "Edit Profile",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/EditProfile.vue"),
      },
    ],
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
