# 全球排行榜后端部署（Cloudflare Workers + KV，免费）

## 一次性部署（约 5 分钟）

1. 注册/登录 https://dash.cloudflare.com （免费）
2. 安装 wrangler 并登录：
   ```
   npm install -g wrangler
   wrangler login
   ```
3. 创建 KV 存储（在本目录执行）：
   ```
   wrangler kv namespace create LB
   ```
   把输出里的 `id = "xxxx"` 填进 `wrangler.toml` 的 `id` 字段
4. 部署：
   ```
   wrangler deploy
   ```
   输出会给你一个地址，形如 `https://dark-survivor-lb.<你的子域>.workers.dev`
5. **把地址告诉老大/填进游戏**：index.html 顶部 `LB_CONFIG.endpoint = 'https://xxx.workers.dev'`

## 端点说明

- `GET /top` → `{ ok: true, top: [...] }` 前10名
- `POST /submit` body `{ name, t, kills, dmg, win, char, date }` → 服务端重算分数（不信客户端），进不了前10返回 `entered: false`

## 游戏侧行为（已实现）

- 平时完全离线可玩，成绩只存本机
- 一局结束时成绩若**超过全球榜第10名**（或榜单未满），弹窗问玩家是否上传（昵称+确认）
- 上传成功刷新全球榜；拒绝/离线/超时（3秒）→ 静默降级，不打扰
- 排行榜面板：🌐全球榜 + 💾本机榜双区展示

## 免费额度

10 万请求/天 + KV 1GB —— 就算游戏爆火也用不完。滥用防护：分数由服务端按 t/kills/win 重算，name 限 12 字，数值全做区间清洗。
