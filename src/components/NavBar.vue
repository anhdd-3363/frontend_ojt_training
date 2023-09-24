<script setup>
import SearchItem from "@components/SearchItem.vue";
import IconLogout from "@icons/IconLogout.vue";
import IconCart from "@icons/IconCart.vue";
import IconLogin from "@icons/IconLogin.vue";
import IconRegister from "@icons/IconRegister.vue";
import IconProfile from "@icons/IconProfile.vue";
import { useAuthStore } from "@stores/auth";

const authStore = useAuthStore();
const handleLogout = () => {
  authStore.logout();
};
</script>

<template>
  <nav class="max-w-screen-xl mx-auto">
    <div
      class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-4 h-20"
    >
      <router-link to="/" class="flex items-center">
        <img
          src="@images/BookWithBookmarks.svg"
          class="h-8 mr-3 inline-block"
          alt="Flowbite Logo"
        />

        <span class="self-center text-2xl font-semibold whitespace-nowrap"
          >Bookshop</span
        >
      </router-link>
      <SearchItem />
      <ul class="font-medium flex flex-row">
        <template v-if="authStore.identity">
          <li>
            <router-link
              to="/profile"
              class="py-2 pl-4 text-black flex items-center"
              aria-current="page"
            >
              <IconProfile />
              <span>
                {{ authStore.identity.email }}
              </span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/cart"
              class="py-2 pl-4 text-black flex items-center"
              aria-current="page"
            >
              <IconCart />
              <span> Giỏ hàng </span>
            </router-link>
          </li>
          <li
            @click="handleLogout"
            class="cursor-pointer py-2 pl-4 text-black flex items-center"
          >
            <IconLogout />
            <span>Đăng xuất</span>
          </li>
        </template>
        <template v-else>
          <li>
            <router-link
              to="/login"
              class="py-2 pl-4 text-black flex items-center"
              aria-current="page"
            >
              <IconLogin />
              <span> Đăng nhập </span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/register"
              class="py-2 pl-4 text-black flex items-center"
              aria-current="page"
            >
              <IconRegister />
              <span> Đăng ký </span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/cart"
              class="py-2 pl-4 text-black flex items-center"
              aria-current="page"
            >
              <IconCart />
              <span> Giỏ hàng</span>
            </router-link>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>
