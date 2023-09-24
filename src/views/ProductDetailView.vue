<script setup>
import ProductDetail from "@components/ProductDetail.vue";
import { useRoute } from "vue-router";
import { getDetailBookApi } from "@apis/book";
import { ref, onMounted } from "vue";

const route = useRoute();
const id = route.params.id;
const bookDetail = ref({});
const fetchBookDetailData = async () => {
  try {
    const { data } = await getDetailBookApi(id);
    bookDetail.value = data;
  } catch (error) {
    // handle error
  }
};
onMounted(fetchBookDetailData);
</script>

<template>
  <ProductDetail :product-detail="bookDetail" />
</template>
