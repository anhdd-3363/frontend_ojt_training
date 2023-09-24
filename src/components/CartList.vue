<script setup>
defineProps(["list"]);
import CartItem from "@components/CartItem.vue";
import BaseButton from "@components/BaseButton.vue";
import { formatPrice } from "@utils/function";
import { useToast } from "vue-toast-notification";
import { orderMessage } from "@locales/vi/messages";
import { useCartStore } from "@stores/cart";

const cartStore = useCartStore();
const $toast = useToast();

const handleOrder = () => {
  // call api send order to server
  $toast.success(orderMessage.success);
  cartStore.removeAllItem();
};
</script>

<template>
  <div class="my-6">
    <template v-for="book in list" :key="book.id">
      <CartItem :book="book" />
    </template>
  </div>
  <div v-if="list.length" class="flex w-full justify-end items-center mb-6">
    <p class="text-2xl mr-8">
      Thành tiền:
      <span class="text-red-700 font-bold ml-2">{{
        formatPrice(cartStore.getTotalPrice)
      }}</span>
    </p>
    <BaseButton @click="handleOrder">Đặt hàng</BaseButton>
  </div>
</template>
