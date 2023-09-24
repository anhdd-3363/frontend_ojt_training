<script setup>
import BaseInput from "@components/BaseInput.vue";
import BaseButton from "@components/BaseButton.vue";
import BaseLabel from "@components/BaseLabel.vue";
import ErrorMessageText from "@components/ErrorMessageText.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { registerApi } from "@apis/auth";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import { useAuthStore } from "@stores/auth";
import { registerMessage } from "@locales/vi/messages";
import { phoneRegex } from "@constants/regex";

const router = useRouter();
const $toast = useToast();
const authStore = useAuthStore();
const DEFAULT_AVATAR_URL =
  "https://i0.wp.com/www.msahq.org/wp-content/uploads/2016/12/default-avatar.png?fit=1024%2C1024&ssl=1&w=640";

const schema = yup.object({
  name: yup.string().required(registerMessage.required),
  phone: yup.string().matches(phoneRegex, registerMessage.phone),
  address: yup.string().required(registerMessage.required),
  email: yup
    .string()
    .required(registerMessage.required)
    .email(registerMessage.email),
  password: yup
    .string()
    .min(6, registerMessage.min)
    .required(registerMessage.required),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], registerMessage.oneOf),
});

const { defineInputBinds, errors, handleSubmit } = useForm({
  validationSchema: schema,
});

const email = defineInputBinds("email");
const name = defineInputBinds("name");
const password = defineInputBinds("password");
const confirmPassword = defineInputBinds("confirmPassword");
const phone = defineInputBinds("phone");
const address = defineInputBinds("address");

async function onSuccess(values) {
  try {
    delete values.confirmPassword;
    const { data } = await registerApi({
      ...values,
      avatar: DEFAULT_AVATAR_URL,
    });
    $toast.success(registerMessage.success);
    const { accessToken } = data;
    authStore.loginUser(accessToken);
    router.push("/");
  } catch (error) {
    $toast.error(registerMessage.error);
  }
}

const onSubmit = handleSubmit(onSuccess);
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16">
    <div class="p-10 border-2 rounded-lg">
      <p class="text-2xl">Đăng ký tài khoản</p>
      <form class="my-6 w-96" @submit="onSubmit">
        <div class="mb-6">
          <BaseLabel for="name">Họ và tên</BaseLabel>
          <BaseInput type="text" id="name" v-bind="name" />
          <ErrorMessageText>{{ errors.name }}</ErrorMessageText>
        </div>
        <div class="mb-6">
          <BaseLabel for="phone">Số điện thoại</BaseLabel>
          <BaseInput type="tel" id="phone" v-bind="phone" />
          <ErrorMessageText>{{ errors.phone }}</ErrorMessageText>
        </div>
        <div class="mb-6">
          <BaseLabel for="address">Địa chỉ</BaseLabel>
          <BaseInput type="text" id="address" v-bind="address" />
          <ErrorMessageText>{{ errors.address }}</ErrorMessageText>
        </div>
        <div class="mb-6">
          <BaseLabel for="email">Email</BaseLabel>
          <BaseInput type="text" id="email" v-bind="email" />
          <ErrorMessageText>{{ errors.email }}</ErrorMessageText>
        </div>
        <div class="mb-6">
          <BaseLabel for="password">Mật khẩu</BaseLabel>
          <BaseInput type="password" id="password" v-bind="password" />
          <ErrorMessageText>{{ errors.password }}</ErrorMessageText>
        </div>
        <div class="mb-6">
          <BaseLabel for="confirmPassword">Nhập lại mật khẩu</BaseLabel>
          <BaseInput
            type="password"
            id="confirmPassword"
            v-bind="confirmPassword"
          />
          <ErrorMessageText>{{ errors.confirmPassword }}</ErrorMessageText>
        </div>

        <BaseButton>Đăng ký</BaseButton>
      </form>
      <p class="text-lg">
        Bạn đã có tài khoản? Đăng nhập tại
        <span>
          <router-link to="/login" class="text-blue-500">đây</router-link>
        </span>
      </p>
    </div>
  </div>
</template>
