<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <p>
        客服热线：13380042016 | 接听时间：法定工作日 08：00-12：00；14：00-18：00 | DREAM MAKING ··
        |
        <a href="#" @click.prevent>·隐私政策</a>
        ·
        <a href="#" @click.prevent>服务条款</a>
      </p>
      <p>
        Copyright © 2026 广州趣闯网络科技有限公司 |
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
          粤ICP备2022108110号-1
        </a>
        | 粤公网安备44010502002530号
      </p>
      <p>
        <a href="#" @click.prevent>网信算备440105311485401240061号</a>
        |
        <a href="#" @click.prevent>网信算备440105311485401240053号</a>
      </p>
      <p>趣丸万相大模型：Guangdong-QuWanWanXiang-202507140065</p>
      <p>平台技术支持方：趣丸Deep-Mesh，Vast，混元等</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: 40px;
  padding: 0 20px 32px;
}

.site-footer__inner {
  display: flex;
  max-width: var(--page-max);
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 0 auto;
  color: #737373;
  font-size: 12px;
  line-height: 1.7;
  text-align: center;
}

.site-footer__inner p {
  margin: 0;
}

.site-footer a {
  color: #737373;
  transition: color 0.2s ease;
}

.site-footer a:hover {
  color: var(--brand);
}
</style>
