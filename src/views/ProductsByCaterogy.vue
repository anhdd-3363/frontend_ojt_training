<script setup>
import { getCategoriesApi, getCategoryApi } from "@apis/category.js";
import { getBooksByCategoryApi } from "@apis/book.js";
import { onMounted, reactive, watchEffect } from "vue";

import SelectSort from "@components/SelectSort.vue";
import BookItem from "@components/BookItem.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const state = reactive({
  category: {},
  books: [],
  categories: [],
  paramsSort: {},
});

const handleSort = (params) => {
  state.paramsSort = params;
};

const fetchProductsByCategory = async function (id, params) {
  try {
    const { data: categoryData } = await getCategoryApi(id);
    const { data: booksData } = await getBooksByCategoryApi(id, params);
    const { data: categoriesData } = await getCategoriesApi();
    state.category = categoryData;
    state.books = booksData;
    state.categories = categoriesData;
  } catch (error) {
    // handle error
  }
};

onMounted(
  watchEffect(async () => {
    await fetchProductsByCategory(route.params.id, state.paramsSort);
  }),
  { immediate: true }
);
</script>

<template>
  <div class="flex mb-4">
    <div class="w-64 mr-4 h-fit border-2 border-b-0 h">
      <p class="bg-red-700 p-4 text-white">DANH MỤC SẢN PHẨM</p>
      <template v-for="item in state.categories" :key="item.id">
        <router-link
          :to="{ path: `/collections/${item.id}` }"
          class="p-4 block border-b-2"
          >{{ item.name }}</router-link
        >
      </template>
    </div>

    <div class="grid grid-cols-4 gap-4 w-full">
      <div class="col-span-full flex justify-between">
        <p class="text-2xl font-bold">{{ state.category.name }}</p>
        <SelectSort
          class="max-h-9"
          @handle-sort="(params) => handleSort(params)"
        />
      </div>
      <template v-for="book in state.books" :key="book.id">
        <BookItem :book="book" />
      </template>
    </div>
  </div>
</template>
