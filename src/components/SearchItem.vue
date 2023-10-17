<script setup>
import IconSearch from "@icons/IconSearch.vue";
import BaseInput from "@components/BaseInput.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const textSearch = ref("");
const timeoutID = ref(null);
const DELAY = 1000;

const handleSearch = function () {
  clearTimeout(timeoutID.value);
  timeoutID.value = setTimeout(() => {
    router.push({
      name: "search",
      query: { q: textSearch.value },
    });
  }, DELAY);
};
</script>

<template>
  <div class="relative w-96 max-xl:w-80 max-lg:w-72 max-md:w-64 max-sm:w-56">
    <div
      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
    >
      <IconSearch />
    </div>
    <BaseInput
      type="text"
      placeholder="Tìm kiếm"
      class="pl-10 pr-24 max-sm:pr-4"
      v-model="textSearch"
      @input="handleSearch"
    />
  </div>
</template>
