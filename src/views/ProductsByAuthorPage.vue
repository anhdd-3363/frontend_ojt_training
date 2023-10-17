<script setup>
import { getAuthorBySlugApi } from "@apis/author.js";
import { getBooksByAuthorApi } from "@apis/book.js";
import {
  PRICE_FILTER,
  LESS_THAN_100K_PRICE,
  FROM_100K_TO_200K_PRICE,
  FROM_200K_TO_300K_PRICE,
  MORE_THAN_300K_PRICE,
} from "@constants/filters.js";
import { reactive, onMounted, watch, computed } from "vue";
import CategorySearch from "@components/CategorySearch.vue";
import SelectSort from "@components/SelectSort.vue";
import FilterRadio from "@components/FilterRadio.vue";
import BookItem from "@components/BookItem.vue";
import PagiNation from "@components/PagiNation.vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import { productApiMessage } from "@locales/vi/messages";
import IconArrowDownVue from "@icons/IconArrowDown.vue";
import IconArrowUpVue from "@icons/IconArrowUp.vue";
import BaseBreadcrumb from "@components/BaseBreadcrumb.vue";
import { calculatePageSum } from "@utils/function.js";

const $toast = useToast();
const route = useRoute();
const router = useRouter();
const ITEMS_PER_PAGE = 4;

const style = reactive({
  bookList:
    "grid h-full w-full grid-cols-4 gap-4 max-xl:grid-cols-3   max-lg:grid-cols-2 max-sm:grid-cols-2 max-sm:",
  sidebar:
    "mb-4 h-fit overflow-hidden rounded-lg border-2 max-md:mt-4 max-md:min-w-[280px]",
  sidebarTitle: "bg-red-700 p-3 text-white",
});

const state = reactive({
  books: [],
  noPagiBooks: [],
  params: {}, // filter, search, sort
  noFilterParams: {}, // search, sort
  isSearch: false,
  authorId: null,
  author: {},
  pickedValue: null,
  pageSum: null,
  pageIndex: 1,
  resetCurrentId: true,
  isShow: false,
});

const breadcrumbItems = computed(() => {
  return [{ title: `${state.author.name}` }];
});

const isLoading = reactive({
  products: true,
  booksTotal: true,
});

// change params again when sort is enabled
const handleSort = (params) => {
  state.params = { ...state.params, ...params };
  state.noFilterParams = state.params;
};

// change params again when search is enabled
const handleSearch = (params) => {
  state.params = { ...state.params, ...params };
  state.noFilterParams = state.params;
  state.pageIndex = 1;
  state.resetCurrentId = !state.resetCurrentId;
  if (params.q) {
    state.isSearch = true;
  } else {
    state.isSearch = false;
    handleFilter(state.pickedValue);
  }
};

// Get books data when filter is activated.
const handleFilter = async (value) => {
  state.pickedValue = value;
  state.pageIndex = 1;
  state.noFilterParams = { ...state.params, id: null };
  state.resetCurrentId = !state.resetCurrentId;
  try {
    const { data: booksData } = await getBooksByAuthorApi(
      state.authorId,
      state.noFilterParams,
    );
    const filteredBooks = booksData.filter((item) => {
      switch (value) {
        case LESS_THAN_100K_PRICE:
          // price < 100000
          return item.price < 100000;
        case FROM_100K_TO_200K_PRICE:
          // 100000 <= price < 20000
          return item.price >= 100000 && item.price < 200000;
        case FROM_200K_TO_300K_PRICE:
          // 200000 <= price < 300000
          return item.price >= 200000 && item.price < 300000;
        case MORE_THAN_300K_PRICE:
          // price > 300000
          return item.price > 300000;
        default:
          // all
          return true;
      }
    });
    const bookIds = filteredBooks.map((item) => item.id);
    if (bookIds.length === 0) {
      state.params = {
        ...state.params,
        id: 10000000,
      };
    } else {
      state.params = {
        ...state.params,
        id: bookIds,
      };
    }
    isLoading.products = false;
  } catch (error) {
    isLoading.products = true;
    $toast.error(productApiMessage.error);
  }
};
const handleShow = () => {
  state.isShow = !state.isShow;
};
const handlePaginate = (pageIndex) => {
  state.pageIndex = pageIndex;

  try {
    fetchProductsByAuthor({
      ...state.params,
      _page: pageIndex,
      _limit: ITEMS_PER_PAGE,
    });
  } catch (error) {
    $toast.error(productApiMessage.error);
  }
};

// get author by slug
const fetchAuthorBySlug = async (slug) => {
  try {
    const { data: authorData } = await getAuthorBySlugApi(slug);
    if (!authorData.length) {
      router.push({ name: "404Page" });
    } else {
      state.authorId = authorData[0].id;
      state.author = authorData[0];
    }
  } catch (error) {
    $toast.error(productApiMessage.error);
  }
};

// get product by author
const fetchProductsByAuthor = async function (params) {
  try {
    if (state.authorId) {
      isLoading.products = true;
      const { data: booksData } = await getBooksByAuthorApi(
        state.authorId,
        params,
      );
      state.books = booksData;
      isLoading.products = false;
    }
  } catch (error) {
    isLoading.products = true;

    $toast.error(productApiMessage.error);
  }
};

// get total book by author without pagination
const fetchBooksTotal = async function (params) {
  try {
    if (state.authorId) {
      const { data: booksData } = await getBooksByAuthorApi(
        state.authorId,
        params,
      );
      state.noPagiBooks = booksData;
      state.pageSum = calculatePageSum(booksData.length, ITEMS_PER_PAGE);
      isLoading.booksTotal = false;
    }
  } catch (error) {
    isLoading.booksTotal = true;
    $toast.error(productApiMessage.error);
  }
};

// Recalculate the total number of pages when filtering
watch(
  () => state.pickedValue,
  () => {
    state.pageSum = calculatePageSum(state.noPagiBooks.length, ITEMS_PER_PAGE);
  },
);

watch(
  () => [state.params, state.authorId],
  async () => {
    Promise.all([
      fetchProductsByAuthor({
        ...state.params,
        _limit: ITEMS_PER_PAGE,
        _page: state.pageIndex,
      }),
      fetchBooksTotal(state.params),
    ])
      .then(() => {
        isLoading.products = false;
      })
      .catch(() => {
        isLoading.products = true;

        $toast.error(productApiMessage.error);
      });
  },
  { immediate: true },
);

onMounted(async () => {
  try {
    await fetchAuthorBySlug(route.params.slug);
  } catch (error) {
    $toast.error(productApiMessage.error);
  }
});
</script>

<template>
  <BaseBreadcrumb :items="breadcrumbItems" />
  <div class="my-4 flex max-md:flex-wrap-reverse">
    <div
      class="mr-4 flex min-w-[240px] flex-col max-md:mr-0 max-md:w-full max-md:flex-row max-md:justify-between max-sm:flex-col"
    >
      <div :class="style.sidebar">
        <p :class="style.sidebarTitle">KHOẢNG GIÁ</p>

        <FilterRadio
          :options-value="PRICE_FILTER"
          class="m-4"
          @update-radio="(pickedValue) => handleFilter(pickedValue)"
        />
      </div>
    </div>
    <div class="flex w-full flex-col">
      <div class="mb-8 flex max-lg:flex-col">
        <div class="mr-4 max-lg:mb-4">
          <img
            class="max-h-[300px] min-w-[250px] max-w-[300px] rounded-lg object-contain"
            :src="state.author.image"
          />
        </div>
        <div class="w-full">
          <p
            class="max-[w-56] mr-4 truncate border-b pb-4 text-2xl font-bold max-xl:text-xl max-lg:mb-2 max-lg:text-lg"
          >
            {{ state.author.name }}
          </p>
          <div class="relative" v-if="state.author.description">
            <div
              class="mb-4 rounded-lg py-4"
              :class="[state.isShow ? 'h-fit' : 'max-h-32 overflow-hidden']"
            >
              <p class="text-justify">
                {{ state.author.description }}
              </p>
              <div class="absolute -bottom-2 w-full">
                <div
                  class="flex h-12"
                  :class="[
                    !state.isShow &&
                      'bg-gradient-to-b from-transparent to-white',
                  ]"
                ></div>
                <div
                  class="flex cursor-pointer items-center justify-center text-red-600 duration-300 hover:text-red-800"
                  @click="handleShow"
                >
                  <div
                    v-if="!state.isShow"
                    class="flex w-full items-center justify-center bg-white pt-2"
                  >
                    <p class="text-center">Xem thêm</p>
                    <IconArrowDownVue />
                  </div>

                  <div class="flex items-center justify-center" v-else>
                    <p class="text-center">Thu gọn</p>
                    <IconArrowUpVue />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="mb-4 flex items-center justify-between max-lg:flex-col max-lg:items-start"
      >
        <p
          class="max-[w-56] mr-4 truncate text-2xl max-xl:text-xl max-lg:mb-2 max-lg:text-lg"
        >
          Tác phẩm của {{ state.author.name }}
        </p>

        <div class="flex">
          <CategorySearch
            class="mr-4 h-9 w-48"
            @search="(textSearch) => handleSearch(textSearch)"
          />
          <SelectSort
            class="max-h-9"
            @handle-sort="(params) => handleSort(params)"
          />
        </div>
      </div>

      <div v-if="state.isSearch" class="mb-4 text-lg">
        <p>
          Kết quả: Có
          {{ state.noPagiBooks.length }} sản phẩm với từ khóa "{{
            state.params.q
          }}"
        </p>
      </div>

      <div
        v-if="
          state.books.length === 0 &&
          !state.isSearch &&
          Object.keys(state.params).length !== 0
        "
        class="mb-4 text-lg"
      >
        <p>Không có kết quả phù hợp với yêu cầu</p>
      </div>

      <div :class="style.bookList">
        <template v-for="book in state.books" :key="book.id">
          <BookItem :book="book" />
        </template>
      </div>

      <PagiNation
        v-if="state.books.length > 0"
        :page-sum="state.pageSum"
        :reset-current-id="state.resetCurrentId"
        @handle-paginate="(pageIndex) => handlePaginate(pageIndex)"
        class="mt-4 self-center"
      />
    </div>
  </div>
</template>
