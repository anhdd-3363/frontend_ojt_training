<script setup>
import SearchItem from "@components/SearchItem.vue";
import IconLogout from "@icons/IconLogout.vue";
import IconCart from "@icons/IconCart.vue";
import IconLogin from "@icons/IconLogin.vue";
import IconRegister from "@icons/IconRegister.vue";
import IconProfile from "@icons/IconProfile.vue";
import IconMenu from "@icons/IconMenu.vue";
import IconHeart from "@icons/IconHeart.vue";
import { useAuthStore } from "@stores/auth";
import { useCartStore } from "@stores/cart";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useProductStore } from "@stores/product";
import { useToast } from "vue-toast-notification";
import { cartMessage } from "@locales/vi/messages";

const $toast = useToast();
const productStore = useProductStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();
const user = computed(() => authStore.userInfo);
const isHidden = ref(true);

const style = reactive({
  nav: "flex h-20  min-w-[375px] flex-wrap items-center justify-between py-4",
  logo: "mr-3 inline-block h-12",
  title: "self-center text-2xl max-sm:hidden",
  iconWrap: "flex h-10 w-10 pr-2 xl:p-0 items-center justify-center",
  link: "flex cursor-pointer items-center rounded px-3 py-2 text-gray-900 hover:bg-gray-100 xl:border-0 xl:p-0 xl:hover:bg-transparent",
  ul: "float-right mt-2 flex min-w-[150px] flex-col rounded-lg border border-gray-100 bg-gray-50 p-3 font-medium shadow-2xl xl:mt-0 xl:flex-row xl:space-x-8 xl:border-0 xl:bg-inherit xl:p-0 xl:shadow-none",
  button:
    "inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 xl:hidden",
  badge:
    "absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white",
});

const handleLogout = () => {
  cartStore.clearCart();
  authStore.logout();
};

const handleClick = (path) => {
  isHidden.value = true;
  router.push(path);
};

const handleClickCart = () => {
  isHidden.value = true;
  if (!authStore.userInfo) {
    $toast.error(cartMessage.loginRequired);
    router.push({ name: "login" });
  } else {
    router.push({ name: "cart" });
  }
};
</script>

<template>
  <nav>
    <div :class="style.nav">
      <router-link to="/" class="flex items-center">
        <img src="@images/bookshop.png" :class="style.logo" alt="logo" />
        <span :class="style.title">Bookshop</span>
      </router-link>
      <SearchItem />
      <button :class="style.button" @click="isHidden = !isHidden">
        <IconMenu />
      </button>
      <div class="w-full xl:block xl:w-auto" :class="{ hidden: isHidden }">
        <ul :class="style.ul">
          <template v-if="user">
            <li @click="handleClick('/profile')" :class="style.link">
              <div :class="style.iconWrap">
                <IconProfile />
              </div>
              <span>
                {{ user.name }}
              </span>
            </li>
            <li @click="handleClick('/pages/favorite')" :class="style.link">
              <div :class="style.iconWrap">
                <div class="relative mr-3">
                  <IconHeart />
                  <div :class="style.badge">
                    {{ productStore.favoriteProducts.length }}
                  </div>
                </div>
              </div>
              <span> Yêu thích </span>
            </li>
            <li @click="handleClick('/cart')" :class="style.link">
              <div :class="style.iconWrap">
                <IconCart />
              </div>
              <span> Giỏ hàng </span>
            </li>
            <li @click="handleLogout" :class="style.link">
              <div :class="style.iconWrap">
                <IconLogout />
              </div>
              <span>Đăng xuất</span>
            </li>
          </template>
          <template v-else>
            <li @click="handleClick('/login')" :class="style.link">
              <div :class="style.iconWrap">
                <IconLogin />
              </div>
              <span> Đăng nhập </span>
            </li>
            <li @click="handleClick('/register')" :class="style.link">
              <div :class="style.iconWrap">
                <IconRegister />
              </div>
              <span> Đăng ký </span>
            </li>
            <li @click="handleClick('/pages/favorite')" :class="style.link">
              <div :class="style.iconWrap">
                <div class="relative mr-3">
                  <IconHeart />
                  <div :class="style.badge">
                    {{ productStore.favoriteProducts.length }}
                  </div>
                </div>
              </div>
              <span> Yêu thích </span>
            </li>
            <li @click="handleClickCart()" :class="style.link">
              <div :class="style.iconWrap">
                <IconCart />
              </div>
              <span> Giỏ hàng</span>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>
