// 《暗黑幸存者》全球排行榜 Worker —— Cloudflare Workers + KV
// 端点：GET /top 返回前10名 | POST /submit 提交成绩（服务端重算分数、末位淘汰）
// 部署见同目录 README.md（免费额度 10 万请求/天，绰绰有余）

export default {
  async fetch(request, env) {
    // CORS：游戏跑在 GitHub Pages，必须放行跨域
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    const url = new URL(request.url);
    try {
      if (request.method === 'GET' && url.pathname === '/top') {
        return json(await getTop(env), cors);
      }
      if (request.method === 'POST' && url.pathname === '/submit') {
        return json(await submit(env, request), cors);
      }
      return json({ ok: false, error: 'not found' }, cors, 404);
    } catch (e) {
      return json({ ok: false, error: String(e) }, cors, 500);
    }
  }
};

function json(data, headers, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
  });
}

// 榜单存 KV：key=board，value=JSON 数组（最多10条，按 score 降序）
async function getTop(env) {
  const raw = await env.LB.get('board');
  return { ok: true, top: raw ? JSON.parse(raw) : [] };
}

// 提交成绩：只信数值字段，服务端重算 score；进不了前10直接礼貌拒绝
async function submit(env, request) {
  const body = await request.json();
  // 字段白名单 + 数值清洗（防注入/防超长）
  const name = String(body.name || '无名幸存者').slice(0, 12);
  const t = clampInt(body.t, 0, 7200);
  const kills = clampInt(body.kills, 0, 999999);
  const dmg = clampInt(body.dmg, 0, 999999999);
  const win = body.win ? 1 : 0;
  const char = String(body.char || 'hunter').slice(0, 12);
  const date = String(body.date || '').slice(0, 10);
  // 服务端重算分数：通关=100万+时长，否则=存活时长（与客户端一致，但不信客户端 score）
  const score = win ? 1000000 + t : t;

  const raw = await env.LB.get('board');
  let top = raw ? JSON.parse(raw) : [];
  top.push({ name, t, kills, dmg, win, char, date, score });
  top.sort((a, b) => b.score - a.score || b.kills - a.kills);
  const evicted = top.length > 10;
  top = top.slice(0, 10); // 只留前10，末位淘汰
  await env.LB.put('board', JSON.stringify(top));
  return { ok: true, top, entered: top.some(x => x.name === name && x.score === score), evicted };
}

function clampInt(v, min, max) {
  const n = Math.floor(Number(v) || 0);
  return Math.max(min, Math.min(max, n));
}
