<script setup>
defineProps(["title", "id"]);
</script>

<template>
  <div class="text-center my-4">
    <router-link
      :to="{ name: 'collections', params: { id } }"
      class="text-2xl font-bold text-gray hover:text-red-600 transition-colors duration-150 underline"
    >
      {{ title }}
    </router-link>
  </div>
  <hr class="h-px my-4 bg-gray-200 border-0" />
</template>
