<script setup lang="ts">
import HeroShowcase from '@/components/home/HeroShowcase.vue'
import ProcessSection from '@/components/home/ProcessSection.vue'
import FeaturesSection from '@/components/home/FeaturesSection.vue'
import CommunitySection from '@/components/home/CommunitySection.vue'
import ProductSection from '@/components/home/ProductSection.vue'
</script>

<template>
  <div class="home-page">
    <HeroShowcase />

    <div class="home-flow">
      <ProcessSection />
      <FeaturesSection />
      <CommunitySection />
      <ProductSection />
    </div>
  </div>
</template>

<style scoped>
.home-flow {
  display: flex;
  flex-direction: column;
  gap: clamp(80px, 9vw, 132px);
  padding-bottom: clamp(44px, 6vw, 84px);
}
</style>
