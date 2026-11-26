<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { ArrowRight, Check } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useRoute } from 'vue-router'
import ReferenceUploader from '@/components/custom/ReferenceUploader.vue'
import ReliefPreview from '@/components/custom/ReliefPreview.vue'
import { submitCustomOrder, uploadReferenceImage } from '@/api/custom'
import { products } from '@/data/products'

const SAMPLE_IMAGE = '/images/custom/reference-photo.jpg'

const route = useRoute()

const files = ref<File[]>([])
const previewSrc = ref(SAMPLE_IMAGE)
const uploaderRef = ref<InstanceType<typeof ReferenceUploader> | null>(null)
const hasUpload = computed(() => files.value.length > 0)

const product = computed(() => {
  const id = route.query.product
  if (typeof id !== 'string') return null
  return products.find((item) => item.id === id) ?? null
})

// 第一张参考图用于 3D 预览；没有上传时展示示例
watch(files, (next) => {
  if (previewSrc.value.startsWith('blob:')) URL.revokeObjectURL(previewSrc.value)
  previewSrc.value = next[0] ? URL.createObjectURL(next[0]) : SAMPLE_IMAGE
})

onBeforeUnmount(() => {
  if (previewSrc.value.startsWith('blob:')) URL.revokeObjectURL(previewSrc.value)
})

/* ---------------- 生成订单 ---------------- */

const dialogVisible = ref(false)
const submitting = ref(false)
const orderId = ref('')
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
  orderId.value = ''
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const result = await submitCustomOrder({
      productId: product.value?.id,
      note: form.note.trim() || undefined,
      files: files.value,
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      },
    })
    orderId.value = result.orderId
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
  formRef.value?.resetFields()
  uploaderRef.value?.reset()
}
</script>

<template>
  <div class="custom-page">
    <div class="page-section custom-page__head">
      <div>
        <span class="custom-page__eyebrow">定制 · 3D 浮雕</span>
        <h1>上传照片，生成你的 3D 预览</h1>
      </div>
      <p>参考图会即时转成可旋转的浮雕模型，满意后填写资料即可下单。</p>
    </div>

    <div class="page-section custom-layout">
      <section class="custom-card custom-card--upload">
        <header class="custom-card__head">
          <span>参考图</span>
          <small>{{ hasUpload ? `已选 ${files.length} 张` : '支持 JPG / PNG / WEBP' }}</small>
        </header>

        <ReferenceUploader ref="uploaderRef" v-model="files" :uploader="uploadReferenceImage" />

        <button
          class="btn btn--primary custom-card__cta"
          type="button"
          :disabled="!hasUpload"
          @click="openDialog"
        >
          生成定制方案
          <el-icon :size="14"><ArrowRight /></el-icon>
        </button>
      </section>

      <section class="custom-card custom-card--preview">
        <header class="custom-card__head">
          <span>3D 浮雕预览</span>
          <small>{{ hasUpload ? '你的参考图' : '示例' }}</small>
        </header>

        <div class="custom-preview">
          <ReliefPreview :src="previewSrc" />
          <span v-if="!hasUpload" class="custom-preview__badge">上传照片后替换为你的作品</span>
        </div>

        <p v-if="product" class="custom-preview__product">
          基于「{{ product.title }}」定制
        </p>
      </section>
    </div>

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
        <p class="order-done__id">订单号 {{ orderId }}</p>
        <p class="order-done__note">1 个工作日内联系你确认方案与报价。</p>
      </div>

      <div v-else class="order-form">
        <div class="order-summary">
          <img :src="previewSrc" alt="参考图预览" />
          <div class="order-summary__copy">
            <p>{{ product?.title || '自定义 3D 浮雕' }}</p>
            <span>参考图 {{ files.length }} 张</span>
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
  height: clamp(300px, 56vw, 420px);
  overflow: hidden;
  border: 1px solid var(--hairline);
}

.custom-preview__badge {
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

.custom-preview__product {
  margin-top: 10px;
  color: var(--text-dim);
  font-size: 10.5px;
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
