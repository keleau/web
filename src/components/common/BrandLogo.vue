<script setup lang="ts">
import { useId } from 'vue'

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })

const gradientId = `brand-gradient-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`
</script>

<template>
  <span class="brand-logo" :class="{ 'is-compact': compact }">
    <svg class="brand-logo__mark" viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient :id="gradientId" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#66d4ff" />
          <stop offset="0.55" stop-color="#029bfe" />
          <stop offset="1" stop-color="#0067f0" />
        </linearGradient>
      </defs>
      <path d="M3.5 9.5 16 3l12.5 6.5L16 16 3.5 9.5Z" :fill="`url(#${gradientId})`" />
      <path
        d="M3.5 16.2 16 22.7l12.5-6.5"
        fill="none"
        :stroke="`url(#${gradientId})`"
        stroke-width="2.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.72"
      />
      <path
        d="M3.5 22.8 16 29.3l12.5-6.5"
        fill="none"
        :stroke="`url(#${gradientId})`"
        stroke-width="2.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.42"
      />
    </svg>
    <span v-if="!compact" class="brand-logo__text">造物工坊</span>
  </span>
</template>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
  user-select: none;
}

.brand-logo__mark {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 10px rgba(2, 155, 254, 0.35));
}

.brand-logo__text {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.2px;
  white-space: nowrap;
}

.brand-logo.is-compact .brand-logo__mark {
  width: 26px;
  height: 26px;
}

@media (max-width: 480px) {
  .brand-logo__text {
    font-size: 15px;
  }

  .brand-logo__mark {
    width: 26px;
    height: 26px;
  }
}
</style>
