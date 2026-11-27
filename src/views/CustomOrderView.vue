<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { ArrowRight, Check, Picture } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useRoute } from 'vue-router'
import ReferenceUploader from '@/components/custom/ReferenceUploader.vue'
import ReliefPreview from '@/components/custom/ReliefPreview.vue'
import { submitCustomOrder, uploadReferenceImage } from '@/api/custom'
import { useModelingTask } from '@/composables/useModelingTask'
import { getProductById } from '@/services/catalog'
import type { ReferenceFile } from '@/types/upload'
import { readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage'

const ModelViewer = defineAsyncComponent(() => import('@/components/store/ModelViewer.vue'))

const GUIDE_PHOTO = '/images/custom/reference-photo.jpg'
const GUIDE_MODEL = '/images/custom/reference-model.jpg'

const route = useRoute()

/** 上传组件输出的参考图（含上传状态与后端文件 ID） */
const references = ref<ReferenceFile[]>([])
/** 首张参考图的本地预览（独立于上传组件，避免组件收回 ObjectURL 后预览失效） */
const previewSrc = ref('')
const uploaderRef = ref<InstanceType<typeof ReferenceUploader> | null>(null)

const hasUpload = computed(() => references.value.length > 0)
const readyReferences = computed(() =>
  references.value.filter((item) => item.status === 'done' && item.referenceId),
)
const uploadingCount = computed(
  () => references.value.filter((item) => item.status === 'uploading').length,
)
const failedCount = computed(
  () => references.value.filter((item) => item.status === 'error').length,
)
const canSubmit = computed(
  () =>
    readyReferences.value.length > 0 &&
    uploadingCount.value === 0 &&
    failedCount.value === 0,
)

const product = computed(() => {
  const id = route.query.product
  return getProductById(typeof id === 'string' ? id : null)
})

/* ---------------- 建模任务 ---------------- */

const modeling = useModelingTask({
  interval: 1100,
  onError: (message) => ElMessage.error(message),
})

// 解构出 ref：模板里才能自动解包（嵌套在对象里的 ref 不会自动解包）
const {
  phase: modelingPhase,
  progress: modelingProgress,
  isBusy: modelingBusy,
  modelUrl: modelingModelUrl,
  errorMessage: modelingErrorMessage,
  retry: retryModeling,
} = modeling

const firstReadyId = computed(() => readyReferences.value[0]?.referenceId ?? '')

// 首张参考图上传完成后自动创建建模任务；移除或上传失败时取消
watch(firstReadyId, (id) => {
  if (!id) {
    modeling.cancel()
    return
  }
  void modeling.start({
    productId: product.value?.id,
    referenceIds: [id],
  })
})

/* ---------------- 预览图 ---------------- */

watch(
  () => references.value[0]?.uid,
  () => {
    if (previewSrc.value.startsWith('blob:')) URL.revokeObjectURL(previewSrc.value)
    const first = references.value[0]
    previewSrc.value = first ? URL.createObjectURL(first.file) : ''
  },
)

onBeforeUnmount(() => {
  if (previewSrc.value.startsWith('blob:')) URL.revokeObjectURL(previewSrc.value)
})

/* ---------------- 上传提示 ---------------- */

const guideVisible = ref(!readStorage<boolean>(STORAGE_KEYS.guideSeen, false))

function markGuideSeen() {
  writeStorage(STORAGE_KEYS.guideSeen, true)
}

function dismissGuide() {
  markGuideSeen()
  guideVisible.value = false
}

function startUpload() {
  dismissGuide()
  void nextTick(() => uploaderRef.value?.openPicker())
}

function openGuide() {
  guideVisible.value = true
}

/* ---------------- 生成订单 ---------------- */

const dialogVisible = ref(false)
const submitting = ref(false)
const orderId = ref('')
const orderNo = ref('')
const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  phone: '',
  address: '',
  note: '',
})

const rules: FormRules = {
  name: [{ required: true, message: '请填写联系人', trigger: 'blur' }],
  phone: [
    { required: true, message: '请填写手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  address: [{ required: true, message: '请填写收货地址', trigger: 'blur' }],
}

function openDialog() {
  if (!hasUpload.value) {
    ElMessage.warning('请先上传一张参考图')
    return
  }
  if (uploadingCount.value > 0) {
    ElMessage.warning('参考图还在上传，请稍候')
    return
  }
  if (failedCount.value > 0) {
    ElMessage.warning('有参考图上传失败，请重试或移除后再提交')
    return
  }
  orderId.value = ''
  orderNo.value = ''
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  if (!canSubmit.value) {
    ElMessage.warning('参考图尚未全部上传成功，请稍后再试')
    return
  }

  submitting.value = true
  try {
    const result = await submitCustomOrder({
      productId: product.value?.id,
      note: form.note.trim() || undefined,
      referenceIds: readyReferences.value.map((item) => item.referenceId!),
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      },
    })
    orderId.value = result.orderId
    orderNo.value = result.orderNo
    ElMessage.success('订单已生成')
  } catch {
    // 请求异常已由 axios 拦截器统一提示
  } finally {
    submitting.value = false
  }
}

function handleClosed() {
  if (!orderId.value) return
  orderId.value = ''
  orderNo.value = ''
  // 表单在订单成功时已被卸载，这里直接重置数据源
  form.name = ''
  form.phone = ''
  form.address = ''
  form.note = ''
  modeling.cancel()
  uploaderRef.value?.reset()
}
</script>

<template>
  <div class="custom-page">
    <div class="page-section custom-page__head">
      <div>
        <span class="custom-page__eyebrow">Bespoke — 定制</span>
        <h1>上传照片，生成你的 3D 模型</h1>
      </div>
      <p>上传参考图后自动建模，满意后填写资料即可下单。</p>
    </div>

    <div class="page-section custom-layout">
      <section class="custom-card custom-card--upload">
        <header class="custom-card__head">
          <span>参考图</span>
          <div class="custom-card__head-actions">
            <small>{{ hasUpload ? `已选 ${references.length} 张` : '支持 JPG / PNG / WEBP' }}</small>
            <button class="custom-card__guide" type="button" @click="openGuide">上传说明</button>
          </div>
        </header>

        <ReferenceUploader
          ref="uploaderRef"
          v-model="references"
          :uploader="uploadReferenceImage"
        />

        <button
          class="btn btn--primary custom-card__cta"
          type="button"
          :disabled="!canSubmit || modelingBusy"
          @click="openDialog"
        >
          {{ modelingBusy ? '建模中…' : uploadingCount > 0 ? '上传中…' : '生成定制方案' }}
          <el-icon :size="14"><ArrowRight /></el-icon>
        </button>
      </section>

      <section class="custom-card custom-card--preview">
        <header class="custom-card__head">
          <span>作品预览</span>
          <small>{{ hasUpload ? `参考图 ${references.length} 张` : '待上传' }}</small>
        </header>

        <div
          class="custom-preview"
          :class="{ 'has-model': !!previewSrc || !!modelingModelUrl }"
        >
          <template v-if="modelingPhase === 'failed'">
            <div class="custom-preview__state is-error">
              <p>{{ modelingErrorMessage || '建模失败，请稍后重试' }}</p>
              <button class="custom-preview__retry" type="button" @click="retryModeling">
                重试建模
              </button>
            </div>
          </template>

          <ModelViewer
            v-else-if="modelingModelUrl"
            :src="modelingModelUrl"
            :poster="previewSrc"
            :variant="product?.id"
          />

          <ReliefPreview v-else-if="previewSrc" :src="previewSrc" />

          <div v-else-if="!hasUpload" class="custom-preview__empty">
            <span class="custom-preview__empty-icon">
              <el-icon :size="22"><Picture /></el-icon>
            </span>
            <p>上传照片后替换为你的作品</p>
          </div>

          <span v-if="previewSrc || modelingModelUrl" class="custom-preview__tag">
            3D 模型 · 拖拽查看
          </span>
        </div>

        <p v-if="product" class="custom-preview__product">
          基于「{{ product.title }}」定制
        </p>
      </section>
    </div>

    <el-dialog
      v-model="guideVisible"
      width="min(560px, 92vw)"
      align-center
      class="custom-dialog guide-dialog"
      @closed="markGuideSeen"
    >
      <template #header>
        <div class="custom-dialog__head">
          <span class="custom-dialog__eyebrow">Bespoke — 提示</span>
          <h2>上传参考图片</h2>
        </div>
      </template>

      <div class="guide">
        <div class="guide__upload">
          <span class="guide__formats" aria-hidden="true">
            <i>PNG</i>
            <i>JPG</i>
            <i>WebP</i>
            <b>＋</b>
          </span>
          <p>拖拽图片或点击此处选择图片</p>
          <small>支持 JPG / PNG / WEBP，单张不超过 10MB</small>
        </div>

        <div class="guide__example">
          <div class="guide__pair">
            <figure>
              <img :src="GUIDE_PHOTO" alt="参考照片示例" />
              <figcaption>参考照片</figcaption>
            </figure>
            <span class="guide__arrow" aria-hidden="true">→</span>
            <figure>
              <img :src="GUIDE_MODEL" alt="生成模型示例" />
              <figcaption>生成模型</figcaption>
            </figure>
          </div>
          <p>需要上传你的特征参考图片，才可生成对应模型。</p>
        </div>
      </div>

      <template #footer>
        <div class="custom-dialog__footer">
          <button class="btn btn--ghost" type="button" @click="dismissGuide">
            知道了
          </button>
          <button class="btn btn--primary" type="button" @click="startUpload">
            去上传
            <el-icon :size="14"><ArrowRight /></el-icon>
          </button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="dialogVisible"
      width="min(480px, 92vw)"
      align-center
      class="custom-dialog"
      :close-on-click-modal="false"
      @closed="handleClosed"
    >
      <template #header>
        <div class="custom-dialog__head">
          <span class="custom-dialog__eyebrow">{{ orderId ? 'Progress — 订单' : 'Bespoke — 下单' }}</span>
          <h2>{{ orderId ? '我们已收到你的需求' : '填写收货资料' }}</h2>
        </div>
      </template>

      <div v-if="orderId" class="order-done">
        <span class="order-done__icon">
          <el-icon :size="20"><Check /></el-icon>
        </span>
        <p class="order-done__id">订单号 {{ orderNo || orderId }}</p>
        <p class="order-done__note">1 个工作日内联系你确认方案与报价。</p>
      </div>

      <div v-else class="order-form">
        <div class="order-summary">
          <img :src="previewSrc" alt="参考图预览" />
          <div class="order-summary__copy">
            <p>{{ product?.title || '自定义 3D 浮雕' }}</p>
            <span>参考图 {{ references.length }} 张</span>
          </div>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          @submit.prevent="handleSubmit"
        >
          <div class="order-form__row">
            <el-form-item label="联系人" prop="name">
              <el-input v-model="form.name" maxlength="20" placeholder="怎么称呼你" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" maxlength="11" placeholder="11 位手机号" />
            </el-form-item>
          </div>

          <el-form-item label="收货地址" prop="address">
            <el-input
              v-model="form.address"
              type="textarea"
              :rows="2"
              maxlength="120"
              placeholder="省 / 市 / 区 / 详细地址"
            />
          </el-form-item>

          <el-form-item label="备注（选填）" prop="note">
            <el-input
              v-model="form.note"
              type="textarea"
              :rows="2"
              maxlength="200"
              placeholder="尺寸、颜色或需要保留的细节"
            />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="custom-dialog__footer">
          <template v-if="orderId">
            <button class="btn btn--primary" type="button" @click="dialogVisible = false">
              完成
            </button>
          </template>
          <template v-else>
            <button class="btn btn--ghost" type="button" @click="dialogVisible = false">
              取消
            </button>
            <button
              class="btn btn--primary"
              type="button"
              :disabled="submitting"
              @click="handleSubmit"
            >
              {{ submitting ? '提交中…' : '提交订单' }}
            </button>
          </template>
        </div>
      </template>
    </el-dialog>

    <Transition name="modeling">
      <div
        v-if="modelingBusy"
        class="modeling"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div class="modeling__panel">
          <span class="modeling__spinner" aria-hidden="true"></span>
          <h2>正在生成 3D 模型</h2>
          <p>正在分析参考图并构建浮雕模型</p>
          <div class="modeling__bar">
            <i :style="{ width: `${modelingProgress}%` }"></i>
          </div>
          <span class="modeling__percent">{{ modelingProgress }}%</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.custom-page {
  display: flex;
  min-height: calc(100vh - var(--header-height));
  flex-direction: column;
  padding-top: clamp(16px, 2.2vw, 26px);
  padding-bottom: clamp(22px, 3vw, 36px);
}

.custom-page__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px 28px;
  margin-bottom: clamp(14px, 1.8vw, 20px);
  padding-bottom: clamp(12px, 1.6vw, 18px);
  border-bottom: 1px solid var(--hairline);
}

.custom-page__eyebrow {
  display: block;
  margin-bottom: 6px;
  color: var(--sand);
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.custom-page__head h1 {
  color: var(--text-primary);
  font-size: clamp(22px, 2.6vw, 34px);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.1;
}

.custom-page__head p {
  max-width: 42ch;
  color: var(--text-muted);
  font-size: 11.5px;
  line-height: 1.7;
}

.custom-layout {
  display: grid;
  gap: clamp(12px, 1.8vw, 20px);
}

.custom-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: clamp(14px, 1.8vw, 20px);
  border: 1px solid var(--hairline);
  background: rgba(255, 255, 255, 0.015);
}

.custom-card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
}

.custom-card__head small {
  color: var(--text-dim);
  font-size: 10px;
  font-weight: 400;
}

.custom-card__head-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.custom-card__guide {
  flex-shrink: 0;
  color: var(--text-muted);
  font-size: 10px;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s ease;
}

.custom-card__guide:hover {
  color: var(--sand);
}

.custom-preview__state.is-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  color: #ff9f7a;
  font-size: 11.5px;
  line-height: 1.7;
  text-align: center;
}

.custom-preview__retry {
  height: 32px;
  padding: 0 14px;
  border: 1px solid var(--hairline-strong);
  border-radius: var(--radius-pill);
  color: var(--text-secondary);
  font-size: 11px;
  transition:
    border-color 0.2s ease,
    color 0.2s ease;
}

.custom-preview__retry:hover {
  border-color: var(--brand-border);
  color: var(--brand-strong);
}

.custom-card__cta {
  width: 100%;
  margin-top: 14px;
}

.custom-card__cta:disabled {
  background: rgba(255, 255, 255, 0.07);
  box-shadow: none;
  color: var(--text-dim);
  cursor: not-allowed;
  transform: none;
}

.custom-preview {
  position: relative;
  display: flex;
  height: clamp(300px, 56vw, 420px);
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: clamp(14px, 2vw, 26px);
  border: 1px solid var(--hairline);
  background:
    radial-gradient(90% 80% at 50% 0%, rgba(255, 255, 255, 0.03), transparent 72%),
    rgba(255, 255, 255, 0.012);
}

.custom-preview.has-model {
  display: block;
  padding: 0;
}

.custom-preview__tag {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 3px 9px;
  border-radius: var(--radius-pill);
  background: rgba(9, 9, 11, 0.68);
  color: rgba(255, 255, 255, 0.62);
  font-size: 9.5px;
  letter-spacing: 0.04em;
  pointer-events: none;
  backdrop-filter: blur(6px);
}

.custom-preview__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-dim);
  font-size: 12px;
  text-align: center;
}

.custom-preview__empty-icon {
  display: inline-flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--hairline-strong);
  border-radius: 50%;
  color: var(--text-muted);
}

.custom-preview__product {
  margin-top: 10px;
  color: var(--text-dim);
  font-size: 10.5px;
}

/* ---------- 上传提示弹窗 ---------- */

.guide {
  display: grid;
  gap: 12px;
}

.guide__upload {
  display: flex;
  min-height: 180px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 16px;
  border: 1px dashed var(--hairline-strong);
  text-align: center;
}

.guide__formats {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  transform: rotate(-4deg);
}

.guide__formats i {
  position: relative;
  display: inline-flex;
  width: 30px;
  height: 37px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: linear-gradient(150deg, #3b3b42, #26262c);
  color: rgba(255, 255, 255, 0.7);
  font-size: 8px;
  font-style: normal;
  font-weight: 700;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.28);
}

.guide__formats i:nth-child(1) {
  transform: rotate(-8deg) translateY(2px);
}

.guide__formats i:nth-child(2) {
  transform: translateY(-3px);
}

.guide__formats i:nth-child(3) {
  transform: rotate(8deg) translateY(2px);
}

.guide__formats b {
  display: inline-flex;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  margin-left: 2px;
  border: 1px solid var(--hairline-strong);
  border-radius: 50%;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 400;
}

.guide__upload p {
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
}

.guide__upload small {
  color: var(--text-dim);
  font-size: 10px;
  line-height: 1.6;
}

.guide__example {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--hairline);
  background: var(--surface-1);
}

.guide__pair {
  display: flex;
  align-items: center;
  gap: 8px;
}

.guide__pair figure {
  position: relative;
  flex: 1;
  overflow: hidden;
  min-width: 0;
  aspect-ratio: 1 / 1;
  border: 1px solid var(--hairline);
  border-radius: 6px;
  background: #ece7dc;
}

.guide__pair img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.guide__pair figcaption {
  position: absolute;
  top: 5px;
  left: 5px;
  padding: 2px 6px;
  border-radius: var(--radius-pill);
  background: rgba(9, 9, 11, 0.72);
  color: rgba(255, 255, 255, 0.82);
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  backdrop-filter: blur(6px);
}

.guide__arrow {
  flex-shrink: 0;
  color: var(--text-dim);
  font-size: 14px;
}

.guide__example p {
  color: var(--text-muted);
  font-size: 10.5px;
  line-height: 1.65;
}

@media (min-width: 560px) {
  .guide {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  }
}

/* ---------- 下单弹窗 ---------- */

:global(.custom-dialog) {
  --el-dialog-bg-color: #121215;
  --el-dialog-padding-primary: 22px;
  border: 1px solid var(--hairline);
  border-radius: 14px;
}

:global(.custom-dialog .el-dialog__header) {
  margin-right: 0;
}

:global(.custom-dialog .el-dialog__headerbtn) {
  top: 12px;
  right: 12px;
}

:global(.custom-dialog .btn:disabled) {
  box-shadow: none;
  cursor: not-allowed;
  opacity: 0.45;
  transform: none;
}

.custom-dialog__head h2 {
  margin-top: 4px;
  color: var(--text-primary);
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.custom-dialog__eyebrow {
  color: var(--sand);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.order-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding: 10px;
  border: 1px solid var(--hairline);
  background: rgba(255, 255, 255, 0.02);
}

.order-summary img {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border: 1px solid var(--hairline);
  object-fit: cover;
}

.order-summary__copy {
  min-width: 0;
}

.order-summary__copy p {
  overflow: hidden;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-summary__copy span {
  color: var(--text-dim);
  font-size: 10.5px;
}

.order-form__row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.order-form :deep(.el-form-item) {
  margin-bottom: 14px;
}

.order-form :deep(.el-form-item__label) {
  padding-bottom: 4px;
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.4;
}

.order-form :deep(.el-input__wrapper),
.order-form :deep(.el-textarea__inner) {
  background: var(--surface-1);
  box-shadow: 0 0 0 1px var(--hairline) inset;
}

.order-form :deep(.el-input__wrapper.is-focus),
.order-form :deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px var(--brand-border) inset;
}

.custom-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.custom-dialog__footer .btn {
  height: 40px;
  padding: 0 20px;
  font-size: 12.5px;
}

.order-done {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 6px 0 14px;
  text-align: center;
}

.order-done__icon {
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--brand-border);
  border-radius: 50%;
  background: var(--brand-soft);
  color: var(--brand-strong);
}

.order-done__id {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.order-done__note {
  color: var(--text-muted);
  font-size: 11px;
}

/* ---------- 建模等待遮罩 ---------- */

.modeling {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(5, 5, 8, 0.8);
  backdrop-filter: blur(10px);
}

.modeling__panel {
  display: flex;
  width: min(360px, 88vw);
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 30px 28px;
  border: 1px solid var(--hairline);
  border-radius: 16px;
  background: #101013;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
  text-align: center;
}

.modeling__spinner {
  width: 36px;
  height: 36px;
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-top-color: var(--brand);
  border-radius: 50%;
  animation: modeling-spin 0.8s linear infinite;
}

@keyframes modeling-spin {
  to {
    transform: rotate(360deg);
  }
}

.modeling__panel h2 {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.modeling__panel p {
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.6;
}

.modeling__bar {
  width: 100%;
  height: 3px;
  margin-top: 8px;
  overflow: hidden;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
}

.modeling__bar i {
  display: block;
  height: 100%;
  background: var(--brand);
  transition: width 0.2s ease;
}

.modeling__percent {
  color: var(--text-dim);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.08em;
}

.modeling-enter-active,
.modeling-leave-active {
  transition: opacity 0.25s ease;
}

.modeling-enter-from,
.modeling-leave-to {
  opacity: 0;
}

@media (min-width: 900px) {
  .custom-layout {
    flex: 1;
    align-items: stretch;
    grid-template-columns: minmax(300px, 0.62fr) minmax(0, 1.38fr);
  }

  .custom-card {
    max-height: 720px;
  }

  .custom-preview {
    height: auto;
    min-height: 300px;
    flex: 1;
  }
}

@media (max-width: 520px) {
  .order-form__row {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
}
</style>
