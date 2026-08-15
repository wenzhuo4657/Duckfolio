# Deploy To Cloudflare

Duckfolio 的 `/admin` 发布机制已经不依赖第三方 CMS。后台会通过服务端 API 读取环境变量，然后使用 GitHub Contents API 把文章写入目标仓库分支的 `posts/*.md`，把站点配置写入 `public/platform-config.json`。

## 必要条件

生产环境必须支持：

- Next.js Route Handlers，也就是 `/api/admin/*` 这些服务端接口。
- 服务端环境变量或密钥。
- 服务器端出站请求到 `api.github.com`。
- 部署平台监听 `GITHUB_BRANCH` 对应分支的提交并重新构建站点。

需要配置的环境变量：

```bash
GITHUB_TOKEN=your_github_token
GITHUB_REPO=owner/repo
GITHUB_BRANCH=deploy
ADMIN_PASSWORD=your_admin_password
```

可选 AI 配置：

```bash
AI_GATEWAY_API_KEY=your_ai_api_key
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
```

`GITHUB_TOKEN` 建议使用 Fine-grained token，只给目标仓库 `Contents: Read and write` 权限。不要把这些值写进仓库，也不要放到 `NEXT_PUBLIC_*`。

## 配置步骤

Cloudflare Workers 可以部署 Next.js，但需要使用 Cloudflare OpenNext adapter 或 Wrangler 自动识别 Next.js 后生成 Workers 配置。不要使用纯静态导出模式，否则 `/api/admin/*` 不会运行，后台发布接口不可用。

1. 使用 `@opennextjs/cloudflare` 或 `wrangler deploy` 的 Next.js 自动配置。
2. 确认生成的 Workers 配置启用了 `nodejs_compat`。
3. 在 Workers & Pages 的 Variables and Secrets 中配置 `ADMIN_PASSWORD`、`GITHUB_TOKEN` 等敏感值为 Secret。
4. 使用 `pnpm run preview` 在 Workers runtime 里预览后再部署。

## 注意点

- 当前后台生产写入走 GitHub API，不依赖 Workers 文件系统持久化。
- Cloudflare Workers 运行在 `workerd`，不是 Node.js 服务器。涉及 Node API 的能力要以 OpenNext/Workers preview 结果为准。
- 如果你希望文章发布后自动重新构建 Workers，需要让 Cloudflare Builds 或你的 CI 监听 `GITHUB_BRANCH`。

## 参考

- https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- https://developers.cloudflare.com/workers/configuration/environment-variables/
