<script setup>
import { formatPrice } from "@utils/function.js";
import { reactive } from "vue";
import { useProductStore } from "@stores/product";
import BaseButton from "@components/BaseButton.vue";
import IconAddToCart from "@components/icons/IconAddToCart.vue";
import { useCartStore } from "@stores/cart";
import { useToast } from "vue-toast-notification";
import { cartMessage } from "@locales/vi/messages";

const props = defineProps(["book"]);
const productStore = useProductStore();
const cartStore = useCartStore();
const $toast = useToast();

const style = reactive({
  name: "line-clamp-2 tracking-tight text-gray-900 h-12 hover:text-red-700 duration-300",
  price: "text-lg font-bold text-red-700 max-sm:text-sm",
  image:
    "max:lg:h-60 h-80 w-full rounded-t-lg object-cover max-xl:h-72 max-md:h-80 max-sm:h-60",
  container:
    "relative h-fit rounded-lg border border-gray-200  bg-white shadow-md transition-transform duration-300 hover:scale-105 hover:transform",
  badge:
    "absolute right-2 top-2 rounded bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800",
  oldPrice: "text-gray-500 line-through max-sm:text-sm",
  layer:
    "absolute left-0 top-0 z-10 h-full w-full rounded-lg bg-black/60 p-5 opacity-0 transition-opacity duration-300 hover:opacity-100 text-white",
  button: "absolute bottom-0 left-0 right-0 mx-auto flex items-center justify-center bg-red-700 hover:bg-red-800 p-3 max-sm:p-2 text-sm duration-300",
  description: "line-clamp-3 max-sm:line-clamp-2",
});

const handleAddSeenProduct = (product) => {
  productStore.addSeenProduct(product);
};

const handleAddToCart = () => {
  try {
    cartStore.addToCart(props.book);
    $toast.success(cartMessage.success);
  } catch ({ message: error }) {
    $toast.error(error);
  }
};

</script>

<template>
  <div :class="style.container">
    <div class="relative">
      <img :class="style.image" :src="book.image" alt="product image" />
      <span :class="style.badge">-10%</span>
      <div :class="style.layer">
        <p class="max-sm:line-clamp-2">{{ book.name }}</p>
        <p class="mb-4">Tác giả: {{ book.author.name }}</p>
        <p :class="style.description">Mô tả: {{ book.description }}</p>
        <BaseButton :style-prop="style.button" @click="handleAddToCart">
          <IconAddToCart />
          Thêm vào giỏ hàng
        </BaseButton>
      </div>
    </div>
    <div class="p-4">
      <router-link
      :to="{ path: `/books/${book.slug}` }"
      @click="handleAddSeenProduct(book)"
    >
    <h5 :class="style.name">{{ book.name }}</h5>
    </router-link>
      <div class="flex justify-between">
        <div :class="style.price">{{ formatPrice(book.price) }}</div>
        <div :class="style.oldPrice">{{ formatPrice(book.price * 1.1) }}</div>
      </div>
    </div>
  </div>
</template>
