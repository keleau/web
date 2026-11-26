<script setup lang="ts">
import CommunityPreview from '@/components/home/CommunityPreview.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import ProcessSection from '@/components/home/ProcessSection.vue'
import StorePreview from '@/components/home/StorePreview.vue'
import ToolsSection from '@/components/home/ToolsSection.vue'
</script>

<template>
  <div class="home-page">
    <HeroSection />

    <div class="home-flow">
      <ProcessSection />
      <ToolsSection />
      <CommunityPreview />
      <StorePreview />
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
