<script setup>
import { useAuthStore } from "@stores/auth";
import BaseButton from "@components/BaseButton.vue";
const authStore = useAuthStore();
</script>

<template>
  <div class="mt-12">
    <p class="text-3xl mb-6">Thông tin tài khoản</p>
    <div class="flex">
      <div>
        <div class="flex">
          <div class="w-96">
            <img
              class="rounded-3xl"
              src="https://i0.wp.com/www.msahq.org/wp-content/uploads/2016/12/default-avatar.png?fit=1024%2C1024&ssl=1&w=640"
            />
          </div>
          <div class="ml-8 text-2xl flex flex-col justify-between">
            <div class="">
              <p class="text-2xl font-normal text-gray-400 mb-4">Email</p>
              <p>{{ authStore.identity.email }}</p>
            </div>
            <div class="">
              <p class="text-2xl font-normal text-gray-400 mb-4">
                Số điện thoại
              </p>
              <p>09123456789</p>
            </div>
            <div class="">
              <p class="text-2xl font-normal text-gray-400 mb-4">Địa chỉ</p>
              <p>Hà Nội</p>
            </div>
            <BaseButton class="text-xl">Lịch sử mua hàng</BaseButton>
          </div>
        </div>
        <p class="text-2xl font-normal mt-4 text-gray-400">Họ và tên</p>
        <p class="text-3xl font-normal mt-2">Đỗ Duy Anh</p>
      </div>
    </div>
  </div>
</template>
