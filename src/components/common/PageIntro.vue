<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow: string
    title: string
    note?: string
    meta?: string
    align?: 'left' | 'center'
    size?: 'page' | 'display'
  }>(),
  {
    note: '',
    meta: '',
    align: 'center',
    size: 'page',
  },
)
</script>

<template>
  <header class="page-intro" :class="[`is-${align}`, `is-${size}`]">
    <div class="page-intro__meta">
      <span>{{ eyebrow }}</span>
      <span v-if="meta">{{ meta }}</span>
    </div>

    <h1>{{ title }}</h1>
    <p v-if="note">{{ note }}</p>
  </header>
</template>

<style scoped>
.page-intro {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: clamp(34px, 5vw, 64px);
  padding-bottom: clamp(26px, 4vw, 48px);
}

.page-intro.is-center {
  align-items: center;
  text-align: center;
}

.page-intro__meta {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--hairline);
  color: var(--text-dim);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.page-intro h1 {
  color: var(--text-primary);
  font-size: clamp(38px, 5vw, 64px);
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 1;
}

.page-intro.is-display h1 {
  font-size: clamp(54px, 8vw, 100px);
  letter-spacing: -0.06em;
  line-height: 0.96;
}

.page-intro p {
  max-width: 46ch;
  color: var(--text-muted);
  font-size: 12.5px;
  line-height: 1.85;
}

.page-intro.is-center p {
  max-width: 40ch;
}

@media (max-width: 767px) {
  .page-intro__meta span:last-child {
    display: none;
  }
}
</style>
