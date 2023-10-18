<script setup>
import BaseInput from "@components/BaseInput.vue";
import BaseButton from "@components/BaseButton.vue";
import BaseLabel from "@components/BaseLabel.vue";

import { useForm } from "vee-validate";
import * as yup from "yup";
import { useRouter } from "vue-router";
import { loginApi } from "@apis/auth.js";
import { getCartByUserApi } from "@apis/cart";
import { useAuthStore } from "@stores/auth";
import { useCartStore } from "@stores/cart";
import { useToast } from "vue-toast-notification";
import { loginMessage } from "@locales/vi/messages";
import { TOKEN_KEY } from "@constants/storage";
import Cookies from "js-cookie";

const $toast = useToast();
const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const schema = yup.object({
  email: yup.string().required(loginMessage.required).email(loginMessage.email),
  password: yup.string().required(loginMessage.required),
});
const { handleSubmit, errors, defineInputBinds } = useForm({
  validationSchema: schema,
});

async function handleLogin(values) {
  try {
    const { data } = await loginApi(values);
    const { accessToken, user } = data;
    Cookies.set(TOKEN_KEY, accessToken);
    await authStore.setUserInfo(user);
    $toast.success(loginMessage.success);
    const { id: userId } = user;
    const { data: cartData } = await getCartByUserApi(userId);
    cartStore.setCart(cartData);
    router.back();
  } catch (error) {
    // handle error
    $toast.error(loginMessage.error);
  }
}

const email = defineInputBinds("email");
const password = defineInputBinds("password");
const onSubmit = handleSubmit(handleLogin);
</script>

<template>
  <div class="flex flex-col items-center justify-center pt-16">
    <div class="min-w-96 rounded-lg border-2 p-10">
      <p class="text-2xl max-sm:text-xl">Đăng nhập</p>
      <form class="my-6" @submit="onSubmit" @keyup.enter="onSubmit">
        <div class="mb-6">
          <BaseLabel for="email">Email</BaseLabel>
          <BaseInput
            form="novalidateform"
            type="text"
            id="email"
            v-bind="email"
          />
          <div class="text-red-600">{{ errors.email }}</div>
        </div>
        <div class="mb-6">
          <BaseLabel for="password">Mật khẩu</BaseLabel>
          <BaseInput
            form="novalidateform"
            type="password"
            id="password"
            v-bind="password"
            autocomplete
          />
        </div>
        <BaseButton>Đăng nhập</BaseButton>
      </form>
      <p class="text-lg max-sm:text-sm">
        Bạn đã chưa có tài khoản? Đăng ký tại
        <span>
          <router-link to="/register" class="text-blue-500">đây</router-link>
        </span>
      </p>
    </div>
  </div>
</template>
