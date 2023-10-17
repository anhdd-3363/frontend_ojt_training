import { createRouter, createWebHistory } from "vue-router";
import OrderHistoryView from "@views/OrderHistoryView.vue";
import OrderDetailView from "@views/OrderDetailView.vue";
import { TOKEN_KEY } from "@constants/storage";
import Cookies from "js-cookie";
import { ROLES } from "@constants/roles";
import { useAuthStore } from "@stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@views/HomePage.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@views/LoginPage.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@views/RegisterPage.vue"),
    },
    {
      path: "/cart",
      name: "cart",
      component: () => import("@views/CartPage.vue"),
    },
    {
      path: "/books/:slug",
      name: "books",
      component: () => import("@views/ProductDetailPage.vue"),
    },
    {
      path: "/collections/:slug",
      name: "collections",
      component: () => import("@views/ProductsByCaterogyPage.vue"),
    },
    {
      path: "/authors/:slug",
      name: "authors",
      component: () => import("@views/ProductsByAuthorPage.vue"),
    },
    {
      path: "/search",
      name: "search",
      component: () => import("@views/SearchPage.vue"),
      props: (route) => ({ keyword: route.query.q }),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("@views/ProfilePage.vue"),
      meta: {
        roles: [ROLES.USER, ROLES.ADMIN],
      },
    },
    {
      path: "/pages/san-pham-da-xem",
      name: "seen-products",
      component: () => import("@views/SeenProductsPage.vue"),
    },
    {
      path: "/pages/favorite",
      name: "favorite",
      component: () => import("@views/FavoriteProductsPage.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("@views/DashboardPage.vue"),
      meta: {
        roles: [ROLES.ADMIN],
      },
    },
    {
      name: "403Page",
      path: "/403",
      component: () => import("@views/403Page.vue"),
    },
    {
      name: "404Page",
      path: "/404",
      component: () => import("@views/404Page.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/404",
    },
    {
      path: "/order-history",
      name: "order-history",
      component: OrderHistoryView,
    },
    {
      path: "/order-detail/:id",
      name: "order-detail",
      component: OrderDetailView,
    },
    {
      path: "/order/:result/:id",
      name: "order-result",
      component: () => import("@views/OrderResultPage.vue"),
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, _from, next) => {
  const token = Cookies.get(TOKEN_KEY);
  const authStore = useAuthStore();
  const authPath = ["/login", "/register"];
  if (token) {
    if (authPath.includes(to.path)) {
      next("/");
      return;
    }
  }
  if (to.meta.roles) {
    if (!token) {
      next("/login");
      return;
    }
    if (authStore.userInfo && to.meta.roles.includes(authStore.userInfo.role)) {
      next();
      return;
    }
    next("/403");
    return;
  }
  next();
});

export default router;
