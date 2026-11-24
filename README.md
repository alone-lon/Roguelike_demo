# 暗黑幸存者 · Roguelike割草Demo

一款类《吸血鬼幸存者》（Vampire Survivors-like）的俯视角割草生存肉鸽游戏。纯 HTML5 + Canvas 2D + 原生 JavaScript 实现，单文件即可运行，零构建依赖。

当前版本：**v0.52**（三期 9/9 全勤收官）

## 在线试玩

直接用浏览器打开 [`index.html`](./index.html) 即可开始游戏，支持电脑端（键鼠）与移动端（触屏）自适应。

## 特色玩法

- **核心循环**：走位躲怪 → 自动攻击割草 → 吸经验升级（5 选 1）→ Build 成型 / 进化超武 → 怪潮压迫 → Boss 收尾 → 结算 → 局外强化 → 再来一局
- **单摇杆操作**：电脑端 WASD / 方向键，移动端左侧虚拟摇杆，攻击全自动，操控越少越爽
- **Build 系统**：8 武器 + 8 被动 + 8 进化线（暗黑系 + 圣骑系），武器满级 + 配对被动 → 进化成超武
- **角色系统**：多角色可选，专属武器加成与外观
- **难度与挑战**：难度阶梯（地狱难度）、每日挑战（固定种子 + 职业限定规则）、成就系统
- **局外成长**：金币商店、永久属性强化、localStorage 本地存档
- **结算与分享**：结算数据卡（称号 / 四维 / 伤害构成条形图）、竖版战绩分享图（可保存/分享）
- **全球排行榜**：离线优先，仅在成绩够格时询问是否上传，基于 Cloudflare Workers + KV 的轻量后端
- **PWA 支持**：可添加到主屏幕，离线缓存可玩
- **动态 BGM**：场景 / 血月事件 / 低血心跳 / 地图主题四层音乐联动，Web Audio API 程序合成音效，零音频资源文件

## 技术方案

- 纯 HTML5 + Canvas 2D + 原生 JavaScript，零第三方库，无需构建工具
- Canvas 代码绘制 Q 版角色/怪物/特效，预留素材替换槽位
- Web Audio API 程序合成音效与音乐
- localStorage 本地存档
- 对象池 + 视口裁剪，双端稳定 60fps，同屏 100-200 怪物

## 项目结构

```
index.html              游戏主文件（单文件运行）
sw.js                    PWA Service Worker（离线缓存）
manifest.webmanifest     PWA 应用清单
leaderboard-worker/      全球排行榜后端（Cloudflare Workers + KV，部署说明见该目录 README）
更新记录.md               每次改动的版本记录
开发路线图.md             功能规划与决策记录
运行日志.md               开发过程日志
项目需求文档.md           项目需求定稿文档
```

## 全球排行榜部署（可选）

游戏默认离线可玩，成绩存本地。如需开启全球排行榜后端，参见 [`leaderboard-worker/README.md`](./leaderboard-worker/README.md)，基于 Cloudflare Workers 免费额度一次性部署。

## 开发文档

- [项目需求文档](./项目需求文档.md) — 玩法设计与需求定稿
- [开发路线图](./开发路线图.md) — 功能规划、决策与进度
- [更新记录](./更新记录.md) — 逐版本变更日志

## License

字体授权见 [`FONT-LICENSE.txt`](./FONT-LICENSE.txt)。
