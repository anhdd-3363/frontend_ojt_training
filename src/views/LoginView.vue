<script setup>
import BaseInput from "@components/BaseInput.vue";
import BaseButton from "@components/BaseButton.vue";
import BaseLabel from "@components/BaseLabel.vue";

import { useForm } from "vee-validate";
import * as yup from "yup";
import { useRouter } from "vue-router";
import { loginApi } from "@apis/auth.js";
import { useAuthStore } from "@stores/auth";
import { useToast } from "vue-toast-notification";
import { loginMessage } from "@locales/vi/messages";

const $toast = useToast();
const router = useRouter();
const authStore = useAuthStore();

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
    const { accessToken } = data;
    await authStore.loginUser(accessToken);
    router.push("/");
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
    <div class="p-10 border-2 rounded-lg">
      <p class="text-2xl">Đăng nhập</p>
      <form class="my-6 w-96" @submit="onSubmit">
        <div class="mb-6">
          <BaseLabel for="email">Email</BaseLabel>
          <BaseInput type="text" id="email" v-bind="email" />
          <div class="text-red-600">{{ errors.email }}</div>
        </div>
        <div class="mb-6">
          <BaseLabel for="password">Mật khẩu</BaseLabel>
          <BaseInput type="password" id="password" v-bind="password" />
        </div>

        <BaseButton>Đăng nhập</BaseButton>
      </form>
      <p class="text-lg">
        Bạn đã chưa có tài khoản? Đăng ký tại
        <span>
          <router-link to="/register" class="text-blue-500">đây</router-link>
        </span>
      </p>
    </div>
  </div>
</template>
