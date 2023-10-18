<script setup>
import BaseButton from "@components/BaseButton.vue";
import { formatPrice } from "@utils/function";
import { useToast } from "vue-toast-notification";
import { cartMessage } from "@locales/vi/messages";
import IconAddToCart from "@components/icons/IconAddToCart.vue";
import { useCartStore } from "@stores/cart";
import ProductComment from "@components/ProductComment.vue";
import { computed, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { useProductStore } from "@stores/product";
import { useAuthStore } from "@stores/auth";
import BookList from "@components/BookList.vue";
import IconHeart from "@icons/IconHeart.vue";
import IconHeartFill from "@icons/IconHeartFill.vue";
import { getBooksByCategoryApi, getBooksByAuthorApi } from "@apis/book";
import { putCartItemApi, postCartItemApi } from "@apis/cart";
import { productApiMessage } from "@locales/vi/messages";
import BaseBreadcrumb from "@components/BaseBreadcrumb.vue";

const productStore = useProductStore();
const authStore = useAuthStore();
const router = useRouter();
const cartStore = useCartStore();
const props = defineProps(["productDetail"]);
const $toast = useToast();
const LIMIT_NUM = 5;

const seenProducts = computed(() => {
  const startIndex = 0;
  const endIndex = LIMIT_NUM;
  return productStore.seenProducts.slice(startIndex, endIndex);
});

const booksBycategory = computed(() => {
  const startIndex = 0;
  const endIndex = LIMIT_NUM;
  return state.booksByCategory.slice(startIndex, endIndex);
});

const booksByAuthor = computed(() => {
  const startIndex = 0;
  const endIndex = LIMIT_NUM;
  return state.booksByAuthor.slice(startIndex, endIndex);
});

const breadcrumbItems = computed(() => {
  return [
    {
      path: `/collections/${props.productDetail.category.slug}`,
      title: `${props.productDetail.category.name}`,
    },
    {
      title: `${props.productDetail.name}`,
    },
  ];
});

const isLiked = computed(() => {
  const isFavorited = productStore.favoriteProducts.find(
    (item) => item.id === props.productDetail.id,
  );
  return !!isFavorited;
});

const state = reactive({
  activeIndex: 1,
  booksByCategory: [],
  booksByAuthor: [],
});

if (!props.productDetail) {
  router.push({ name: "404Page" });
}

watch(
  () => props.productDetail,
  () => (state.activeIndex = 1),
);

const style = reactive({
  active:
    "mr-2 inline-block rounded-t-lg border-b-2 border-blue-600 p-4 text-blue-600",
  tabTitle:
    "mr-2 inline-block cursor-pointer rounded-t-lg border-b-2 p-4 text-lg",
  image: "w-[25%] max-lg:w-[40%] max-sm:w-full max-sm:mb-2",
  contentContainer: "pl-8 w-[75%] max-sm:p-0 max-sm:w-full",
  contentTitle: "leading-8",
  descriptionTitle: "mb-8 border-2 rounded-lg overflow-hidden",
  button:
    "flex items-center justify-center bg-red-700 hover:bg-red-800 py-2 mt-4 rounded-lg px-3 text-sm duration-300",
  listBookTitle:
    "absolute left-1/2 -translate-x-1/2 bg-white px-3 text-xl font-medium text-gray-900 text-center",
});

const handleAddToCart = async () => {
  if (!authStore.userInfo) {
    $toast.error(cartMessage.loginRequired);
    return;
  }
  try {
    const inCartItem = cartStore.cart.find(
      (item) => props.productDetail.id === item.book.id,
    );
    if (inCartItem) {
      if (inCartItem.inCartQuantity < props.productDetail.quantity) {
        cartStore.increment(inCartItem.id);
        await putCartItemApi(inCartItem.id, inCartItem);
        $toast.success(cartMessage.success);
      } else throw new Error(cartMessage.outOfStock);
    } else {
      const newCartItem = {
        book: props.productDetail,
        userId: authStore.userInfo.id,
        inCartQuantity: 1,
      };
      const { data } = await postCartItemApi(newCartItem);
      newCartItem.id = data.id;
      cartStore.addItem(newCartItem);
      $toast.success(cartMessage.success);
    }
  } catch ({ message: error }) {
    $toast.error(error);
  }
};

const handleNavigationSeenPage = () => {
  router.push({ name: "seen-products" });
};

const handleNavigationCategoryPage = () => {
  router.push({
    name: "collections",
    params: { slug: props.productDetail.category.slug },
  });
};

const handleNavigationAuthorPage = () => {
  router.push({
    name: "authors",
    params: { slug: props.productDetail.author.slug },
  });
};

const isActive = (index) => {
  return state.activeIndex === index;
};

const handleActive = (index) => {
  state.activeIndex = index;
};

const handleFavorite = (product) => {
  productStore.addFavoriteProduct(product);
};

watch(
  () => props.productDetail,
  () => {
    try {
      Promise.all([
        getBooksByCategoryApi(props.productDetail.category.id),
        getBooksByAuthorApi(props.productDetail.author.id),
      ]).then(([{ data: booksBycategory }, { data: booksByAuthor }]) => {
        state.booksByAuthor = booksByAuthor;
        state.booksByCategory = booksBycategory;
      });
    } catch (error) {
      $toast.error(productApiMessage.error);
    }
  },
  { immediate: true },
);
</script>

<template>
  <template v-if="productDetail">
    <div class="min-w-[320px]">
      <div class="mb-4">
        <BaseBreadcrumb :items="breadcrumbItems" />
      </div>
      <div class="mb-8 flex max-sm:flex-col">
        <div :class="style.image">
          <img :src="productDetail.image" class="rounded-lg" />
        </div>
        <div :class="style.contentContainer">
          <div
            class="name flex items-center justify-start pb-4 text-xl font-bold max-lg:pb-2 max-lg:text-lg max-sm:text-base"
          >
            {{ productDetail.name }}
            <div class="ml-6 cursor-pointer">
              <IconHeart
                @click="handleFavorite(productDetail)"
                v-if="!isLiked"
              />
              <IconHeartFill
                @click="handleFavorite(productDetail)"
                v-if="isLiked"
              />
            </div>
          </div>

          <div class="price text-3xl font-bold text-red-700 max-lg:text-2xl">
            {{ formatPrice(productDetail.price) }}
          </div>
          <div>
            <ul>
              <li :class="style.contentTitle">
                Tác giả:
                <router-link
                  class="text-red-600 duration-300 hover:text-red-800"
                  :to="{ path: `/authors/${productDetail.author.slug}` }"
                  >{{ productDetail.author.name }}</router-link
                >
              </li>
              <li :class="style.contentTitle">
                Đối tượng:
                <span>{{ productDetail.audience }}</span>
              </li>
              <li :class="style.contentTitle">
                Khuôn khổ: <span>{{ productDetail.size }}</span>
              </li>
              <li :class="style.contentTitle">
                Số trang: <span>{{ productDetail.page }}</span>
              </li>
              <li :class="style.contentTitle">
                Định dạng: <span>{{ productDetail.cover }}</span>
              </li>
              <li :class="style.contentTitle">
                Trọng lượng: <span>{{ productDetail.weight }}</span>
              </li>
              <li :class="style.contentTitle">
                Số lượng sản phẩm còn:
                <span :class="style.contentTitle">{{
                  productDetail.quantity
                }}</span>
              </li>
            </ul>

            <BaseButton :style-prop="style.button" @click="handleAddToCart">
              <IconAddToCart />
              THÊM VÀO GIỎ HÀNG
            </BaseButton>
          </div>
        </div>
      </div>
      <div
        class="mb-8 border-b border-gray-200 text-center text-sm font-medium text-gray-500"
      >
        <ul class="-mb-px flex flex-wrap">
          <li
            @click="handleActive(1)"
            :class="[
              isActive(1)
                ? style.active
                : ' hover:border-gray-300 hover:text-gray-600 ',
              ,
              style.tabTitle,
            ]"
          >
            Mô tả
          </li>
          <li
            @click="handleActive(2)"
            :class="[
              isActive(2)
                ? style.active
                : 'hover:border-gray-300 hover:text-gray-600',
              ,
              style.tabTitle,
            ]"
          >
            Bình luận
          </li>
        </ul>
      </div>

      <div :class="style.descriptionTitle" v-if="isActive(1)">
        <p class="p-4 text-base">
          {{ productDetail.description }}
        </p>
      </div>
      <div :class="style.descriptionTitle" v-if="isActive(2)">
        <p class="p-4 text-base">
          <ProductComment :product-detail="productDetail" />
        </p>
      </div>
      <div>
        <div class="inline-flex w-full items-center justify-center">
          <hr class="my-8 h-px w-full border-0 bg-gray-200" />
          <span :class="style.listBookTitle"> SẢN PHẨM CÙNG TÁC GIẢ </span>
        </div>

        <BookList :list="booksByAuthor" class="my-4" />
        <div
          class="flex cursor-pointer justify-end text-red-600 duration-300 hover:text-red-800"
          @click="handleNavigationAuthorPage"
        >
          Xem thêm >>
        </div>
        <div class="inline-flex w-full items-center justify-center">
          <hr class="my-8 h-px w-full border-0 bg-gray-200" />
          <span :class="style.listBookTitle"> SẢN PHẨM CÙNG THỂ LOẠI </span>
        </div>

        <BookList :list="booksBycategory" class="my-4" />
        <div
          class="flex cursor-pointer justify-end text-red-600 duration-300 hover:text-red-800"
          @click="handleNavigationCategoryPage"
        >
          Xem thêm >>
        </div>
        <div class="inline-flex w-full items-center justify-center">
          <hr class="my-8 h-px w-full border-0 bg-gray-200" />
          <span :class="style.listBookTitle"> SẢN PHẨM ĐÃ XEM </span>
        </div>

        <BookList :list="seenProducts" class="my-4" />
        <div
          class="flex cursor-pointer justify-end text-red-600 duration-300 hover:text-red-800"
          @click="handleNavigationSeenPage"
        >
          Xem thêm >>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <BaseLoading class="h-[64vh]" />
  </template>
</template>
