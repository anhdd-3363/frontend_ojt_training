<script setup>
import { ref, onMounted, computed } from "vue";
import { getOrderDetailApi } from "@apis/order";
import { useRoute } from "vue-router";
import { formatDate, formatPrice } from "@utils/function";
import OrderItem from "@components/OrderItem.vue";
import { useToast } from "vue-toast-notification";
import { orderApiMessage } from "@locales/vi/messages";
import { useAuthStore } from "@stores/auth";
import BaseLoading from "@components/BaseLoading.vue";
import BaseBreadcrumb from "@components/BaseBreadcrumb.vue";

const $toast = useToast();
const route = useRoute();
const authStore = useAuthStore();
const orderDetail = ref([]);
const isLoading = ref(true);

const breadcrumbItems = [{ title: `Chi tiết đơn hàng` }];

const fetchOrder = async () => {
  try {
    const { data } = await getOrderDetailApi(route.params.id);
    orderDetail.value = data;
    isLoading.value = false;
  } catch (error) {
    isLoading.value = true;
    $toast.error(orderApiMessage.error);
  }
};

onMounted(() => {
  fetchOrder();
});

const order = computed(() => orderDetail.value[0]?.order);
</script>

<template>
  <BaseBreadcrumb :items="breadcrumbItems" />
  <template v-if="!isLoading">
    <div v-if="order" class="mt-12">
      <template v-if="order.userId === authStore.userInfo?.id">
        <div
          class="mb-6 flex w-full items-center justify-between max-lg:flex-col"
        >
          <div class="flex items-center justify-center">
            <p class="mr-4 text-2xl max-sm:text-xl">
              Chi tiết đơn hàng #{{ order.id }}
            </p>
            <span
              class="mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-sm text-blue-800"
            >
              {{ order.status }}</span
            >
          </div>
          <p class="text-xl text-gray-500 max-lg:text-lg max-sm:text-sm">
            Ngày đặt hàng: {{ formatDate(order.createdAt) }}
          </p>
        </div>
        <div>
          <template v-for="item in orderDetail" :key="item.id">
            <OrderItem :order="item" />
          </template>
          <div class="mb-10 flex w-full items-center justify-end">
            <p class="text-2xl max-sm:text-xl">
              Thành tiền:
              <span class="ml-2 font-bold text-red-700">{{
                formatPrice(order.total)
              }}</span>
            </p>
          </div>
        </div>
      </template>
      <template v-else>
        <p class="text-center text-xl font-bold">
          Bạn không có quyền xem đơn hàng này
        </p>
      </template>
    </div>
    <div v-else class="mt-12">
      <p class="text-center text-xl font-bold">Đơn hàng không tồn tại</p>
    </div>
  </template>
  <template v-else>
    <BaseLoading class="h-[64vh]" />
  </template>
</template>
