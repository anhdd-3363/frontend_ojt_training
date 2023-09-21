import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@views/HomeView.vue";
import CartView from "@views/CartView.vue";
import LoginView from "@views/LoginView.vue";
import RegisterView from "@views/RegisterView.vue";
import ProductDetailView from "@views/ProductDetailView.vue";
import ProductsByCaterogy from "@views/ProductsByCaterogy.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/cart",
      name: "cart",
      component: CartView,
    },
    {
      path: "/books/:id",
      name: "books",
      component: ProductDetailView,
    },
    {
      path: "/collections/:id",
      name: "collections",
      component: ProductsByCaterogy,
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
