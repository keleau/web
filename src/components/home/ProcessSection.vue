<script setup lang="ts">
import SectionHead from '@/components/common/SectionHead.vue'
import { getProcessSteps } from '@/services/content'

const processSteps = getProcessSteps()
</script>

<template>
  <section id="process" class="page-section process" aria-label="制作流程">
    <SectionHead
      kicker="02 — workflow"
      title="一件作品，四个阶段"
      note="从上传到交付都在同一条产线上完成，不外包、不拆单。每一步的进度都能在订单里看到。"
    />

    <ol class="process__rail">
      <li
        v-for="(step, index) in processSteps"
        :key="step.no"
        class="process-step reveal"
        :style="{ transitionDelay: `${index * 70}ms` }"
      >
        <span class="process-step__tick" aria-hidden="true"></span>
        <div class="process-step__head">
          <span class="process-step__no">{{ step.no }}</span>
          <span class="process-step__meta">{{ step.meta }}</span>
        </div>
        <h3>{{ step.title }}</h3>
        <p>{{ step.desc }}</p>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.process {
  padding-bottom: 0;
}

.process__rail {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  list-style: none;
}

.process-step {
  position: relative;
  padding: 22px 0 26px;
  border-top: 1px solid var(--hairline);
  transition: border-color 0.3s ease;
}

.process-step:hover {
  border-color: var(--sand-border);
}

.process-step__tick {
  position: absolute;
  top: -1px;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--sand);
  opacity: 0;
  transform: translateY(-50%) scale(0.6);
  transition:
    opacity 0.3s ease,
    transform 0.3s var(--ease-out);
}

.process-step:hover .process-step__tick {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}

.process-step__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.process-step__no {
  color: var(--sand);
  font-size: 26px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  line-height: 1;
}

.process-step__meta {
  color: var(--text-dim);
  font-size: 10px;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.process-step h3 {
  margin-top: 18px;
  color: var(--text-primary);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.process-step p {
  max-width: 30ch;
  margin-top: 8px;
  color: var(--text-muted);
  font-size: 12.5px;
  line-height: 1.75;
}

@media (min-width: 640px) {
  .process__rail {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: clamp(24px, 3vw, 44px);
  }
}

@media (min-width: 1024px) {
  .process__rail {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    column-gap: clamp(24px, 3vw, 48px);
  }

  .process-step {
    padding: 26px 0 8px;
  }
}
</style>
