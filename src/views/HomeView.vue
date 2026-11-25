<script setup lang="ts">
import HeroShowcase from '@/components/home/HeroShowcase.vue'
import CommunitySection from '@/components/home/CommunitySection.vue'
import ProductSection from '@/components/home/ProductSection.vue'
</script>

<template>
  <div class="home-page">
    <HeroShowcase />
    <CommunitySection />
    <ProductSection />
  </div>
</template>

<style scoped>
.home-page {
  padding-bottom: 24px;
}
</style>
