<script setup lang="ts">
import SmartImage from '@/components/common/SmartImage.vue'
import type { PromoTile } from '@/types/catalog'

const props = defineProps<{
  promo: PromoTile
}>()

const emit = defineEmits<{
  (e: 'action', promo: PromoTile): void
}>()
</script>

<template>
  <article class="promo-tile" :class="`is-${props.promo.tone}`">
    <button
      class="promo-tile__media"
      type="button"
      :aria-label="`${props.promo.title}，${props.promo.cta}`"
      @click="emit('action', props.promo)"
    >
      <span class="promo-tile__brand">{{ props.promo.brand }}</span>
      <strong class="promo-tile__title">{{ props.promo.title }}</strong>
      <span class="promo-tile__note">{{ props.promo.note }}</span>

      <span class="promo-tile__image" aria-hidden="true">
        <SmartImage :src="props.promo.image" alt="" />
      </span>

      <span class="promo-tile__cta">
        {{ props.promo.cta }}
        <span aria-hidden="true">→</span>
      </span>
    </button>

    <div class="promo-tile__caption">
      <h3>{{ props.promo.caption }}</h3>
      <span>{{ props.promo.captionNote }}</span>
    </div>
  </article>
</template>

<style scoped>
.promo-tile {
  display: flex;
  min-width: 0;
  flex-direction: column;
  height: 100%;
}

.promo-tile__media {
  position: relative;
  display: flex;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  flex-direction: column;
  align-items: flex-start;
  padding: 18px;
  border: 1px solid transparent;
  color: #181410;
  text-align: left;
  transition:
    transform 0.5s var(--ease-out),
    filter 0.4s ease;
}

.promo-tile__media:hover {
  transform: translateY(-2px);
  filter: brightness(1.03);
}

.promo-tile.is-sand .promo-tile__media {
  background: linear-gradient(158deg, #f0d0a7 0%, #e2b783 58%, #d3a26c 100%);
}

.promo-tile.is-paper .promo-tile__media {
  background: linear-gradient(158deg, #f3efe5 0%, #e8e1d2 100%);
}

.promo-tile.is-ink .promo-tile__media {
  background: linear-gradient(158deg, #1c3040 0%, #101a24 60%, #0b1117 100%);
  color: #eef4f8;
}

.promo-tile__brand {
  position: relative;
  z-index: 2;
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.18em;
  opacity: 0.68;
}

.promo-tile__title {
  position: relative;
  z-index: 2;
  max-width: 15ch;
  margin-top: 14px;
  font-size: clamp(17px, 1.4vw, 21px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.22;
  white-space: pre-line;
}

.promo-tile__note {
  position: relative;
  z-index: 2;
  margin-top: 10px;
  font-size: 10px;
  letter-spacing: 0.02em;
  line-height: 1.6;
  opacity: 0.68;
}

.promo-tile__image {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 52%;
  opacity: 0.96;
  mask-image: linear-gradient(to top, #000 66%, transparent 100%);
  -webkit-mask-image: linear-gradient(to top, #000 66%, transparent 100%);
}

.promo-tile__image :deep(.smart-image) {
  position: absolute;
  inset: 0;
}

.promo-tile__cta {
  position: relative;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding: 7px 13px;
  border-radius: var(--radius-pill);
  background: rgba(9, 9, 11, 0.78);
  color: #fff;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  backdrop-filter: blur(8px);
  transition:
    background-color 0.25s ease,
    color 0.25s ease;
}

.promo-tile.is-ink .promo-tile__cta {
  background: rgba(255, 255, 255, 0.12);
}

.promo-tile__media:hover .promo-tile__cta {
  background: var(--brand);
  color: #001018;
}

.promo-tile__caption {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-top: 11px;
  padding-top: 7px;
}

.promo-tile__caption h3 {
  color: var(--text-secondary);
  font-size: 12.5px;
  font-weight: 400;
  letter-spacing: 0;
}

.promo-tile__caption span {
  color: var(--text-dim);
  font-size: 10px;
  white-space: nowrap;
}
</style>
