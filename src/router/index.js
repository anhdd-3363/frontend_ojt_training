import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@views/HomeView.vue";
import CartView from "@views/CartView.vue";
import LoginView from "@views/LoginView.vue";
import RegisterView from "@views/RegisterView.vue";
import ProductDetailView from "@views/ProductDetailView.vue";
import ProductsByCaterogy from "@views/ProductsByCaterogy.vue";
import SearchView from "@views/SearchView.vue";
import ProfileView from "@views/ProfileView.vue";
import { useAuthStore } from "@stores/auth";
import { TOKEN_KEY } from "@constants/storage";
import Cookies from "js-cookie";

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
    {
      path: "/search",
      name: "search",
      component: SearchView,
      props: (route) => ({ query: route.query.q }),
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
    },
    {
      path: "/404",
      name: "404",
      component: () => import("@views/404Page.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/404",
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, _from, next) => {
  const token = Cookies.get(TOKEN_KEY);
  const authStore = useAuthStore();

  if (token) {
    if (to.path === "/login") {
      next("/");
      return;
    }
    authStore.getIdentity();
  }

  next();
});

export default router;
