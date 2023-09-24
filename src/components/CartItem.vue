<script setup>
import { formatPrice } from "@utils/function.js";
import IconPlus from "@components/icons/IconPlus.vue";
import IconMinus from "@components/icons/IconMinus.vue";
import IconDelete from "@components/icons/IconDelete.vue";
import { useCartStore } from "@stores/cart";
import { useToast } from "vue-toast-notification";

const $toast = useToast();
const props = defineProps(["book"]);
const cartStore = useCartStore();

const handlePlus = () => {
  try {
    cartStore.increment(props.book.id);
  } catch ({ message: error }) {
    $toast.error(error);
  }
};

const handleMinus = () => {
  cartStore.decrement(props.book.id);
};

const handleDelete = () => {
  cartStore.removeItem(props.book.id);
};
</script>

<template>
  <div
    class="border border-gray-200 rounded-lg hover:shadow-lg transition-shadow flex justify-between items-center mb-6 p-5 select-none"
  >
    <router-link :to="{ path: `/books/${book.id}` }">
      <div>
        <img
          class="object-contain object-center w-24 rounded"
          :src="book.image"
          alt="product image"
        />
      </div>
    </router-link>
    <div class="w-1/2">
      <router-link :to="{ path: `/books/${book.id}` }">
        <h5
          class="text-xl tracking-tight text-gray-900 hover:text-red-600 transtion-colors duration-150"
        >
          {{ book.name }}
        </h5>
      </router-link>
      <p class="text-xl">
        Đơn giá:
        <span class="font-medium text-red-700 ml-2">
          {{ formatPrice(book.price) }}
        </span>
      </p>
    </div>
    <p class="text-xl font-bold text-red-700">
      {{ formatPrice(book.inCartQuantity * book.price) }}
    </p>
    <div class="flex items-center justify-center outline-none">
      <IconPlus @click="handlePlus" />
      <span class="text-xl font-bold m-10">
        {{ book.inCartQuantity }}
      </span>
      <IconMinus @click="handleMinus" />
    </div>
    <IconDelete class="mr-4" @click="handleDelete" />
  </div>
</template>
