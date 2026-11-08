// Drawing helpers for Illustrator (ExtendScript / ES3).
// Coordinates are y-down on a local grid; OX/OY (offset) and SC (scale) map them to the document.
var OX = 0, OY = 0, SC = 1;

function hex(h) {
  var c = new RGBColor();
  c.red = parseInt(h.substr(1, 2), 16);
  c.green = parseInt(h.substr(3, 2), 16);
  c.blue = parseInt(h.substr(5, 2), 16);
  return c;
}
function pt(x, y) { return [OX + x * SC, -(OY + y * SC)]; }
function fill(p, col) { p.filled = true; p.fillColor = hex(col); p.stroked = false; return p; }
function stroke(p, col, w) {
  p.filled = false; p.stroked = true; p.strokeColor = hex(col); p.strokeWidth = w * SC;
  p.strokeCap = StrokeCap.ROUNDENDCAP; p.strokeJoin = StrokeJoin.ROUNDENDJOIN; return p;
}
function cap(p, kind) { p.strokeCap = kind === "butt" ? StrokeCap.BUTTENDCAP : StrokeCap.ROUNDENDCAP; p.strokeJoin = StrokeJoin.ROUNDENDJOIN; return p; }
function poly(L, pts, col) {
  var p = L.pathItems.add(), a = [];
  for (var i = 0; i < pts.length; i++) a.push(pt(pts[i][0], pts[i][1]));
  p.setEntirePath(a); p.closed = true; return fill(p, col);
}
function line(L, pts, col, w) {
  var p = L.pathItems.add(), a = [];
  for (var i = 0; i < pts.length; i++) a.push(pt(pts[i][0], pts[i][1]));
  p.setEntirePath(a); p.closed = false; return stroke(p, col, w);
}
function rect(L, x, y, w, h, col) { return fill(L.pathItems.rectangle(-(OY + y * SC), OX + x * SC, w * SC, h * SC), col); }
function circle(L, cx, cy, r, col) { return fill(L.pathItems.ellipse(-(OY + (cy - r) * SC), OX + (cx - r) * SC, 2 * r * SC, 2 * r * SC), col); }

// Path builder: straight lines and circular arcs (degrees; 0 = right, 90 = down).
function PB() { this.p = []; }
PB.prototype.M = function (x, y) { this.p.push({ a: [x, y], l: [x, y], r: [x, y] }); return this; };
PB.prototype.L = PB.prototype.M;
PB.prototype.A = function (cx, cy, r, a0, a1) {
  var n = Math.max(1, Math.ceil(Math.abs(a1 - a0) / 90)), da = (a1 - a0) / n;
  var k = 4 / 3 * Math.tan(Math.abs(da) * Math.PI / 720) * r, s = da > 0 ? 1 : -1;
  for (var i = 0; i <= n; i++) {
    var a = (a0 + da * i) * Math.PI / 180, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    var tx = -Math.sin(a) * s * k, ty = Math.cos(a) * s * k;
    if (i === 0) {
      var last = this.p[this.p.length - 1];
      if (!last || Math.abs(last.a[0] - x) > 0.01 || Math.abs(last.a[1] - y) > 0.01) { this.M(x, y); last = this.p[this.p.length - 1]; }
      last.r = [x + tx, y + ty];
    } else {
      this.p.push({ a: [x, y], l: [x - tx, y - ty], r: [x, y] });
    }
  }
  return this;
};
PB.prototype.draw = function (L, closed) {
  var path = L.pathItems.add();
  for (var i = 0; i < this.p.length; i++) {
    var q = path.pathPoints.add(), d = this.p[i];
    q.anchor = pt(d.a[0], d.a[1]); q.leftDirection = pt(d.l[0], d.l[1]); q.rightDirection = pt(d.r[0], d.r[1]);
    q.pointType = PointType.CORNER;
  }
  path.closed = closed;
  return path;
};
function arc(L, cx, cy, r, a0, a1, col, w) { return stroke(new PB().A(cx, cy, r, a0, a1).draw(L, false), col, w); }
function ellipsePath(L, cx, cy, r) { return new PB().A(cx, cy, r, 0, 359.9).draw(L, true); }
function rrectPath(L, x, y, w, h, r) {
  return new PB().M(x + r, y).L(x + w - r, y).A(x + w - r, y + r, r, -90, 0).L(x + w, y + h - r).A(x + w - r, y + h - r, r, 0, 90)
    .L(x + r, y + h).A(x + r, y + h - r, r, 90, 180).L(x, y + r).A(x + r, y + r, r, 180, 270).draw(L, true);
}

// Shape with real holes (even-odd), so it works on any background.
function withHoles(L, outer, holes, col) {
  var cp = L.compoundPathItems.add();
  outer.move(cp, ElementPlacement.PLACEATEND);
  for (var i = 0; i < holes.length; i++) holes[i].move(cp, ElementPlacement.PLACEATEND);
  for (var j = 0; j < cp.pathItems.length; j++) { fill(cp.pathItems[j], col); cp.pathItems[j].evenodd = true; }
  return cp;
}
function ring(L, cx, cy, r, rin, col) { return withHoles(L, ellipsePath(L, cx, cy, r), [ellipsePath(L, cx, cy, rin)], col); }

// Run fn with a local offset/scale (fn draws on its own grid).
function at(x, y, s, fn) {
  var k = [OX, OY, SC];
  OX = k[0] + x * k[2]; OY = k[1] + y * k[2]; SC = k[2] * s;
  fn();
  OX = k[0]; OY = k[1]; SC = k[2];
}
