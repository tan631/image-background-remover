# Image Background Remover

基于 Remove.bg API 的图片背景去除工具，部署在 Cloudflare Pages。

## 功能

- 拖拽或点击上传图片
- 输入暗语验证
- 调用 Remove.bg API 去除背景
- 原图 / 结果对比展示
- 一键下载去背景图片

## 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的 Remove.bg API Key

# 启动开发服务器
npm run dev
```

## 部署到 Cloudflare Pages

1. 将代码推送到 GitHub
2. 在 Cloudflare Pages 创建新项目，连接 GitHub 仓库
3. 构建配置：
   - Framework preset: `Next.js`
   - Build command: `npx @cloudflare/next-on-pages`
   - Output directory: `.vercel/output/static`
4. 在 Cloudflare Pages 环境变量中添加 `REMOVE_BG_API_KEY`

## 环境变量

| 变量名 | 说明 |
|--------|------|
| `REMOVE_BG_API_KEY` | Remove.bg API Key，从 [remove.bg](https://www.remove.bg/api) 获取 |
