<script setup>
import { ref, reactive } from "vue";
import IconCheckCircle from "@components/icons/IconCheckCircle.vue";
import IconCloseCircle from "@components/icons/IconCloseCircle.vue";
import BaseButton from "@components/BaseButton.vue";
import { useRoute } from "vue-router";
import { CREATE_ORDER_SUCCESS, CREATE_ORDER_FAILED } from "@constants/order";

const route = useRoute();
const orderId = ref(route.params.id);
const result = ref(route.params.result);
const style = reactive({
  container: "flex h-[50vh] flex-col items-center justify-center text-center",
  successText: "mt-4 text-3xl font-bold text-green-500 max-sm:text-2xl",
  failedText: "mt-4 text-3xl font-bold text-red-500 max-sm:text-2xl",
  infoText: "mt-2 text-gray-500 text-xl max-sm:text-lg",
});
</script>

<template>
  <div :class="style.container">
    <template v-if="result === CREATE_ORDER_SUCCESS">
      <IconCheckCircle />
      <h1 :class="style.successText">Đơn hàng của bạn đã được tiếp nhận</h1>
      <p :class="style.infoText">Cảm ơn bạn đã mua hàng tại NXB Đức Duy</p>
      <p :class="style.infoText">
        Mã đơn hàng của bạn là
        <router-link
          :to="{ name: 'order-detail' }"
          class="font-bold hover:underline"
          >#{{ orderId }}</router-link
        >
      </p>
      <router-link to="/" class="mt-4">
        <BaseButton> Tiếp tục mua sắm </BaseButton>
      </router-link>
    </template>
    <template v-if="result === CREATE_ORDER_FAILED">
      <IconCloseCircle />
      <h1 :class="style.failedText">Đơn hàng của bạn chưa thành công</h1>
      <p :class="style.infoText">
        Đã lỗi xảy ra trong quá trình xử lý đơn hàng
      </p>
      <p :class="style.infoText">
        Vui lòng thử lại sau hoặc liên hệ với chúng tôi
      </p>
      <router-link to="/" class="mt-4">
        <BaseButton>Trang chủ</BaseButton>
      </router-link>
    </template>
  </div>
</template>
