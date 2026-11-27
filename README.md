# 造物工坊 · Web

一个“照片 → 3D 浮雕 → 实物”的展示型电商前端。包含首页、产品商城、作品详情、定制服务、社区画廊五个页面，定制流程支持参考图上传、异步建模任务进度与订单提交。

## 技术栈

- Vue 3 `<script setup>` + TypeScript
- Vite 8
- Pinia（购物车）
- Vue Router（路由级懒加载）
- Element Plus（按需注册）
- three.js（`ThreeStage` / `ModelViewer` / `ReliefPreview`）

## 快速开始

```bash
npm install
npm run dev
npm run build
npm run preview
```

默认开发端口以 Vite 输出为准。

## 目录结构

```
src/
├─ api/            # 接口模块（商品、社区、上传、建模、订单）
├─ services/       # 数据入口；组件只依赖这一层
├─ data/           # 本地 mock 数据
├─ types/          # 领域类型
├─ composables/    # useProductCatalog / useModelingTask / useReveal
├─ stores/         # 购物车
├─ components/     # common / cart / custom / home / store / community / layout
├─ views/          # 5 个页面
├─ plugins/        # Element Plus 按需注册
└─ utils/          # 格式化、localStorage 封装
```

依赖方向：`views → components → composables/stores/services → api/data`。组件不直接 import `@/data`。

## 环境变量

`.env.development`：

```dotenv
VITE_API_BASE_URL=/api
# 默认走前端 mock；接后端时改为 false
VITE_USE_MOCK=true
```

- 商品、社区目前仍读本地 mock（通过 `services` 层）；
- 定制上传 / 建模 / 下单默认走 mock，`VITE_USE_MOCK=false` 后调用真实接口；
- 真实接口契约见下方文档。

## 文档

- [前端优化与缺陷修复记录](docs/01-前端优化与缺陷修复.md)
- [前端组件规范与维护手册](docs/02-前端组件规范.md)
- [后端接口与功能文档](docs/03-后端接口与功能文档.md)

## 构建产物（2026-11-27）

| 文件 | 大小 | gzip |
| --- | --- | --- |
| `index.js`（主包） | 239.00 KB | 84.99 KB |
| `ThreeStage.js`（3D） | 628.21 KB | 156.87 KB |
| `index.css` | 381.60 KB | 52.48 KB |

主包已从全量 Element Plus 的约 1MB 降到 239KB。3D 包按路由分包，仅详情/定制页加载。

## 已知限制

1. 商品/社区 service 仍是同步 mock，接后端需要一次异步化改造（页面加 loading 态）。
2. 购物车“去结算”是演示提示，支付/商品订单接口未接。
3. 定制下单页还没有“照片授权”勾选，上线前需补隐私合规文案。
4. 暂无自动化测试，当前依赖 `vue-tsc` + 手工回归清单。
