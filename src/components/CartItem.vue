<script setup>
import { reactive, computed } from "vue";
import { formatPrice } from "@utils/function.js";
import IconPlus from "@components/icons/IconPlus.vue";
import IconMinus from "@components/icons/IconMinus.vue";
import IconDelete from "@components/icons/IconDelete.vue";
import { useCartStore } from "@stores/cart";
import { useToast } from "vue-toast-notification";
import { putCartItemApi, deleteCartItemApi } from "@apis/cart";

const $toast = useToast();
const props = defineProps(["item"]);
const book = computed(() => props.item.book);
const cartStore = useCartStore();
const style = reactive({
  container:
    "mb-6 flex select-none items-center justify-between rounded-lg border border-gray-200 p-5 shadow-md max-sm:p-3",
  image: "w-24 rounded object-contain object-center",
  name: "text-lg tracking-tight text-gray-900 duration-300 hover:text-red-600 max-md:line-clamp-2 max-sm:text-base max-sm:line-clamp-4",
  price: "text-xl font-bold text-red-700 max-md:text-lg max-sm:text-base",
  quantity: "m-10 max-md:m-4 text-xl font-bold max-md:text-lg max-sm:text-base",
  adjust: "flex items-center justify-center outline-none",
});

const handlePlus = async () => {
  try {
    const inCartItem = cartStore.cart.find((item) => item.id === props.item.id);
    cartStore.increment(inCartItem.id);
    await putCartItemApi(inCartItem.id, inCartItem);
  } catch ({ message: error }) {
    $toast.error(error);
  }
};

const handleMinus = async () => {
  try {
    const inCartItem = cartStore.cart.find((item) => item.id === props.item.id);
    cartStore.decrement(inCartItem.id);
    await putCartItemApi(inCartItem.id, inCartItem);
  } catch ({ message: error }) {
    $toast.error(error);
  }
};

const handleDelete = async () => {
  try {
    cartStore.removeItem(props.item.id);
    await deleteCartItemApi(props.item.id);
  } catch ({ message: error }) {
    $toast.error(error);
  }
};
</script>

<template>
  <div :class="style.container">
    <router-link :to="{ path: `/books/${book.slug}` }">
      <img :class="style.image" :src="book.image" alt="product image" />
    </router-link>
    <div class="max-md:1/4 w-1/2 max-lg:w-1/3 max-sm:w-1/6">
      <router-link :to="{ path: `/books/${book.slug}` }">
        <h5 :class="style.name">{{ book.name }}</h5>
      </router-link>
      <p class="text-xl max-md:text-lg max-sm:hidden">
        Đơn giá:
        <span :class="style.price">
          {{ formatPrice(book.price) }}
        </span>
      </p>
    </div>
    <p :class="style.price">
      {{ formatPrice(item.inCartQuantity * book.price) }}
    </p>
    <div :class="style.adjust">
      <IconPlus @click="handlePlus" class="max-sm:w-4" />
      <span :class="style.quantity">
        {{ item.inCartQuantity }}
      </span>
      <IconMinus @click="handleMinus" class="max-sm:w-4" />
    </div>
    <IconDelete class="mr-4 max-sm:w-4" @click="handleDelete" />
  </div>
</template>
