/**
 * Element Plus 按需注册
 *
 * 项目里只用到这些组件；不再 app.use(ElementPlus) 全量引入，
 * 让 Rolldown 能把未使用的组件 tree-shake 掉。
 * 新增 el-xxx 时记得在这里补注册。
 */
import type { App } from 'vue'
import {
  ElBadge,
  ElConfigProvider,
  ElDialog,
  ElDrawer,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElPopover,
} from 'element-plus'

const components = [
  ElBadge,
  ElConfigProvider,
  ElDialog,
  ElDrawer,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElPopover,
]

export function setupElementPlus(app: App) {
  components.forEach((component) => {
    if (component.name) app.component(component.name, component)
  })
}
