<script setup>
import { getBooksByKeywordApi } from "@apis/book";
import BookList from "@components/BookList.vue";
import SelectSort from "@components/SelectSort.vue";
import { productApiMessage } from "@locales/vi/messages";
import { useToast } from "vue-toast-notification";
import { onMounted, reactive, watchEffect } from "vue";
import BaseBreadcrumb from "@components/BaseBreadcrumb.vue";
import PagiNation from "@components/PagiNation.vue";
import { calculatePageSum } from "@utils/function";

const $toast = useToast();
const props = defineProps(["keyword"]);
const breadcrumbItems = [{ title: `Tìm kiếm` }];
const ITEMS_PER_PAGE = 5;

const state = reactive({
  books: [],
  noPagiBooks: [],
  params: {}, // sort
  pageSum: null,
});

const isLoading = reactive({
  books: true,
  booksTotal: true,
});

// get books by keyword has pagination
const fetchBooksByKeyword = async function (params, keyword) {
  if (keyword) {
    isLoading.books = true;
    try {
      const { data } = await getBooksByKeywordApi(keyword, {
        ...params,
        _limit: ITEMS_PER_PAGE,
      });
      state.books = data;
      isLoading.books = false;
    } catch (error) {
      isLoading.books = true;
      $toast.error(productApiMessage.error);
    }
  } else {
    state.books = [];
    isLoading.books = false;
  }
};

// get books by keyword no pagination
const fetchBooksTotal = async function (keyword) {
  if (keyword) {
    try {
      const { data } = await getBooksByKeywordApi(keyword);
      state.noPagiBooks = data;
      state.pageSum = calculatePageSum(data.length, ITEMS_PER_PAGE);
      isLoading.booksTotal = false;
    } catch (error) {
      isLoading.booksTotal = true;
      $toast.error(productApiMessage.error);
    }
  }
};

// handle query change
const handleQueryChange = async (props) => {
  let keyword = props?.keyword
  if (keyword) {
    try {
      fetchBooksByKeyword(state.params, keyword);
      fetchBooksTotal(keyword);
    } catch (error) {
      $toast.error(productApiMessage.error);
    }
  }
};

const handlePaginate = (pageIndex) => {
  try {
    fetchBooksByKeyword({
      ...state.params,
      _page: pageIndex,
      _limit: ITEMS_PER_PAGE,
    },  props.keyword);
  } catch (error) {
    $toast.error(productApiMessage.error);
  }
};

const fetchBooksBySortParams = async (params) => {
  state.params = { ...state.params, ...params };
  try {
    const { data } = await getBooksByKeywordApi(props.keyword, {
      ...state.params,
      _page: 1,
      _limit: ITEMS_PER_PAGE,
    });
    state.books = data;
    isLoading.value = false;
  } catch (error) {
    isLoading.value = true;
    $toast.error(productApiMessage.error);
  }
};

watchEffect(() => handleQueryChange(props));
onMounted(handleQueryChange);
</script>
<template>
  <BaseBreadcrumb :items="breadcrumbItems" />
  <div class="my-4">
    <div v-if="keyword" class="flex items-center justify-between max-md:flex-col">
      <p class="text-xl font-semibold">
        Kết quả: Có {{ state.noPagiBooks.length }} sản phẩm chứa từ khóa "{{
          keyword
        }}"
      </p>
      <div class="max-md:mt-4">
        <SelectSort @handle-sort="(params) => fetchBooksBySortParams(params)" />
      </div>
    </div>
    <p v-else class="text-xl font-semibold">Hãy nhập từ khóa để tìm kiếm</p>
    <BookList :list="state.books" />
  </div>
  <div class="flex justify-center">
    <PagiNation
      v-if="state.books.length > 0"
      :page-sum="state.pageSum"
      @handle-paginate="(pageIndex) => handlePaginate(pageIndex)"
      class="mt-4"
    />
  </div>
</template>
