/*
 * Snake core: pure game logic, no DOM.
 *
 * Used in two places so they can never drift apart:
 *   1. game/index.html  (the playable page, loaded as window.SnakeCore)
 *   2. tools/build.mjs  (records an autopilot run and bakes it into the README replay SVG)
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SnakeCore = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // The snake eats a tech stack. Order here is only the ledger order; spawn order is shuffled.
  var TOKENS = [
    { code: "PY", name: "Python" },
    { code: "TS", name: "TypeScript" },
    { code: "SB", name: "Spring Boot" },
    { code: "RE", name: "React" },
    { code: "AO", name: "Azure OpenAI" },
    { code: "LG", name: "LangGraph" },
    { code: "RAG", name: "RAG" },
    { code: "DK", name: "Docker" },
    { code: "PG", name: "PostgreSQL" },
    { code: "C", name: "C" },
    { code: "ASM", name: "x86 ASM" },
    { code: "FA", name: "FastAPI" },
  ];

  var DIRS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };
  var OPPOSITE = { up: "down", down: "up", left: "right", right: "left" };
  var ORDER = ["right", "down", "up", "left"]; // BFS expansion order; gives clean L-shaped paths

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffled(n, rand) {
    var a = [];
    for (var i = 0; i < n; i++) a.push(i);
    for (var j = n - 1; j > 0; j--) {
      var k = Math.floor(rand() * (j + 1));
      var t = a[j];
      a[j] = a[k];
      a[k] = t;
    }
    return a;
  }

  function createGame(opts) {
    opts = opts || {};
    var cols = opts.cols || 24;
    var rows = opts.rows || 16;
    var tokens = opts.tokens || TOKENS;
    var rand = mulberry32(opts.seed == null ? Date.now() : opts.seed);
    var len = opts.startLength || 3;
    var hy = Math.floor(rows / 2);
    var hx = Math.floor(cols / 4) + len - 1;
    var snake = [];
    for (var i = 0; i < len; i++) snake.push({ x: hx - i, y: hy });

    var s = {
      cols: cols,
      rows: rows,
      tokens: tokens,
      rand: rand,
      snake: snake,
      dir: "right",
      queue: [],
      bag: [],
      food: null,
      collected: tokens.map(function () { return false; }),
      eaten: 0,
      ticks: 0,
      status: "playing", // "playing" | "over"
    };
    spawnFood(s);
    return s;
  }

  function spawnFood(s) {
    var occupied = new Uint8Array(s.cols * s.rows);
    for (var i = 0; i < s.snake.length; i++) occupied[s.snake[i].y * s.cols + s.snake[i].x] = 1;
    var free = [];
    for (var c = 0; c < occupied.length; c++) if (!occupied[c]) free.push(c);
    if (!free.length) {
      s.food = null;
      return;
    }
    if (!s.bag.length) s.bag = shuffled(s.tokens.length, s.rand);
    var cell = free[Math.floor(s.rand() * free.length)];
    s.food = { x: cell % s.cols, y: Math.floor(cell / s.cols), index: s.bag.shift() };
  }

  // Queue a turn. Reversals (relative to the last queued direction) are ignored.
  function turn(s, name) {
    if (!DIRS[name] || s.status !== "playing") return false;
    var last = s.queue.length ? s.queue[s.queue.length - 1] : s.dir;
    if (name === last || name === OPPOSITE[last]) return false;
    if (s.queue.length >= 2) return false;
    s.queue.push(name);
    return true;
  }

  // Advance one tick. Returns { type: "move" | "eat" | "dead", ... }.
  function tick(s) {
    if (s.status !== "playing") return { type: "dead" };
    if (s.queue.length) s.dir = s.queue.shift();
    var d = DIRS[s.dir];
    var head = s.snake[0];
    var nx = head.x + d.x;
    var ny = head.y + d.y;
    s.ticks++;

    if (nx < 0 || ny < 0 || nx >= s.cols || ny >= s.rows) {
      s.status = "over";
      return { type: "dead", reason: "wall" };
    }
    var eating = !!s.food && s.food.x === nx && s.food.y === ny;
    // The tail cell is vacated this tick unless we grow into it.
    var limit = eating ? s.snake.length : s.snake.length - 1;
    for (var i = 0; i < limit; i++) {
      if (s.snake[i].x === nx && s.snake[i].y === ny) {
        s.status = "over";
        return { type: "dead", reason: "self" };
      }
    }
    s.snake.unshift({ x: nx, y: ny });
    if (!eating) {
      s.snake.pop();
      return { type: "move" };
    }
    var token = s.tokens[s.food.index];
    var index = s.food.index;
    s.collected[index] = true;
    s.eaten++;
    spawnFood(s);
    return { type: "eat", token: token, index: index, x: nx, y: ny };
  }

  /* ---------- autopilot ---------- */

  function bfs(cols, rows, blocked, from, to, firstPrefer) {
    var total = cols * rows;
    var prev = new Int32Array(total).fill(-2);
    var start = from.y * cols + from.x;
    var goal = to.y * cols + to.x;
    var queue = [start];
    prev[start] = -1;
    var first = ORDER;
    if (firstPrefer) first = [firstPrefer].concat(ORDER.filter(function (n) { return n !== firstPrefer; }));
    for (var qi = 0; qi < queue.length; qi++) {
      var cur = queue[qi];
      if (cur === goal) break;
      var cx = cur % cols;
      var cy = (cur - cx) / cols;
      for (var k = 0; k < 4; k++) {
        var dd = DIRS[cur === start ? first[k] : ORDER[k]];
        var x = cx + dd.x;
        var y = cy + dd.y;
        if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
        var nxt = y * cols + x;
        if (prev[nxt] !== -2 || blocked[nxt]) continue;
        prev[nxt] = cur;
        queue.push(nxt);
      }
    }
    if (prev[goal] === -2) return null;
    var cells = [];
    for (var c = goal; c !== start; c = prev[c]) cells.push(c);
    cells.reverse();
    var path = [];
    var p = start;
    for (var m = 0; m < cells.length; m++) {
      var q = cells[m];
      var dx = (q % cols) - (p % cols);
      var dy = Math.floor(q / cols) - Math.floor(p / cols);
      path.push(dx === 1 ? "right" : dx === -1 ? "left" : dy === 1 ? "down" : "up");
      p = q;
    }
    return path;
  }

  function blockedFor(cols, rows, snake) {
    var b = new Uint8Array(cols * rows);
    for (var i = 0; i < snake.length - 1; i++) b[snake[i].y * cols + snake[i].x] = 1; // tail moves away
    return b;
  }

  function floodSize(cols, rows, blocked, from) {
    var seen = new Uint8Array(cols * rows);
    var stack = [from.y * cols + from.x];
    seen[stack[0]] = 1;
    var n = 0;
    while (stack.length) {
      var cur = stack.pop();
      n++;
      var cx = cur % cols;
      var cy = (cur - cx) / cols;
      for (var k = 0; k < 4; k++) {
        var d = DIRS[ORDER[k]];
        var x = cx + d.x;
        var y = cy + d.y;
        if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
        var nx = y * cols + x;
        if (seen[nx] || blocked[nx]) continue;
        seen[nx] = 1;
        stack.push(nx);
      }
    }
    return n;
  }

  function advance(snake, dirName, grow) {
    var d = DIRS[dirName];
    var next = snake.slice();
    next.unshift({ x: snake[0].x + d.x, y: snake[0].y + d.y });
    if (!grow) next.pop();
    return next;
  }

  // Picks a direction. Goes for the food only when the snake can still reach its own tail afterwards.
  function autopilot(s) {
    var cols = s.cols;
    var rows = s.rows;
    var snake = s.snake;
    var head = snake[0];
    var blocked = blockedFor(cols, rows, snake);

    if (s.food) {
      var path = bfs(cols, rows, blocked, head, s.food, s.dir);
      if (path) {
        var sim = snake;
        for (var i = 0; i < path.length; i++) sim = advance(sim, path[i], i === path.length - 1);
        var simBlocked = blockedFor(cols, rows, sim);
        var simTail = sim[sim.length - 1];
        if (bfs(cols, rows, simBlocked, sim[0], simTail)) return path[0];
      }
    }

    // Otherwise stall safely: pick the legal move that keeps the tail reachable and stays farthest from it.
    var best = null;
    var bestScore = -1;
    for (var k = 0; k < 4; k++) {
      var name = ORDER[k];
      if (name === OPPOSITE[s.dir] && snake.length > 1) continue;
      var d = DIRS[name];
      var x = head.x + d.x;
      var y = head.y + d.y;
      if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
      if (blocked[y * cols + x]) continue;
      var next = advance(snake, name, false);
      var nb = blockedFor(cols, rows, next);
      var toTail = bfs(cols, rows, nb, next[0], next[next.length - 1]);
      var score = toTail ? 1000 + toTail.length : floodSize(cols, rows, nb, next[0]);
      if (name === s.dir) score += 0.5; // prefer going straight on ties
      if (score > bestScore) {
        bestScore = score;
        best = name;
      }
    }
    return best || s.dir;
  }

  // Runs autopilot from a seed and records every frame. Used to bake the README replay.
  function record(opts) {
    var s = createGame(opts);
    var cap = (opts && opts.maxTicks) || 900;
    var frames = [snapshot(s, null)];
    var total = s.tokens.length;
    while (s.status === "playing" && s.eaten < total && s.ticks < cap) {
      turn(s, autopilot(s));
      var ev = tick(s);
      frames.push(snapshot(s, ev));
    }
    return { frames: frames, complete: s.eaten === total, status: s.status, cols: s.cols, rows: s.rows, tokens: s.tokens };
  }

  function snapshot(s, ev) {
    return {
      snake: s.snake.map(function (c) { return { x: c.x, y: c.y }; }),
      food: s.food ? { x: s.food.x, y: s.food.y, index: s.food.index } : null,
      eaten: s.eaten,
      ate: ev && ev.type === "eat" ? ev.index : null,
    };
  }

  return {
    TOKENS: TOKENS,
    DIRS: DIRS,
    OPPOSITE: OPPOSITE,
    createGame: createGame,
    turn: turn,
    tick: tick,
    autopilot: autopilot,
    record: record,
    mulberry32: mulberry32,
  };
});
