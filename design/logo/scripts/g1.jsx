// TRAIL Club logo (G1): AhaRobot climbing the trail, raising an orange object, + "TRAIL·club".
// Run with run.sh. LOGO_DIR and EXPORT_DIR are prepended by run.sh.
// Draws every brand artboard, saves trail-club-logo.ai and exports the web assets.

app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

// main = shapes and letters, accent = orange details. Holes are real knockouts, so no background color is needed.
var LIGHT = { main: "#3D5A2A", accent: "#D4602A" };
var DARK = { main: "#F2EFE2", accent: "#E9874F" };
var MONO = { main: "#3D5A2A", accent: "#3D5A2A" };
var PAPER = "#F2EFE2"; // background of the home-screen icon and the social image

// ---------------- wordmark: heavy caps TRAIL (cap height 100) ----------------
function wordA(G, x0, P) {
  var x = x0;
  // T
  rect(G, x, 0, 80, 24, P.main); rect(G, x + 28, 0, 24, 100, P.main); x += 80 + 6;
  // R
  rect(G, x, 0, 24, 100, P.main);
  var outer = new PB().M(x, 0).L(x + 48, 0).A(x + 48, 29, 29, -90, 90).L(x, 58).draw(G, true);
  var hole = new PB().M(x + 24, 22).L(x + 48, 22).A(x + 48, 29, 7, -90, 90).L(x + 24, 36).draw(G, true);
  withHoles(G, outer, [hole], P.main);
  poly(G, [[x + 30, 52], [x + 56, 52], [x + 84, 100], [x + 57, 100]], P.main);
  x += 84 + 2;
  // A: legs + a larger accent crossbar (a trail blaze)
  poly(G, [[x, 100], [x + 30, 0], [x + 58, 0], [x + 88, 100], [x + 63, 100], [x + 44, 36.7], [x + 25, 100]], P.main);
  poly(G, [[x + 38.2, 56], [x + 49.8, 56], [x + 58.2, 84], [x + 29.8, 84]], P.accent);
  x += 88 + 8;
  // I
  rect(G, x, 0, 24, 100, P.main); x += 24 + 12;
  // L
  rect(G, x, 0, 24, 100, P.main); rect(G, x, 76, 62, 24, P.main); x += 62;
  return x - x0;
}

// ---------------- lowercase club matched to the caps (x-height 62, stem 22) ----------------
function club(G, x0, P) {
  var x = x0, c = P.main;
  // c: filled shape with angled terminals (softer than radial butt ends)
  var cx = x + 32, cy = 69;
  var cShape = new PB().A(cx, cy, 32, 318, 42).A(cx, cy, 10, 62, 298).draw(G, true);
  fill(cShape, c);
  x += 60 + 12;
  rect(G, x, 0, 22, 100, c); x += 22 + 12;                                                     // l
  rect(G, x, 38, 22, 31, c); cap(arc(G, x + 32, 69, 21, 180, 0, c, 22), "butt"); rect(G, x + 42, 38, 22, 62, c); x += 64 + 12; // u
  rect(G, x, 0, 22, 100, c); cap(arc(G, x + 34, 69, 21, 0, 359.9, c, 22), "butt"); x += 66;   // b
  return x - x0;
}

// "TRAIL·club": caps, a lens-like dot in the accent color, then club
function wordF(G, x0, P) {
  var ww = wordA(G, x0, P);
  var x = x0 + ww + 16;
  circle(G, x + 12, 69, 12, P.accent);
  x += 24 + 16;
  return (x - x0) + club(G, x, P);
}

// ---------------- AhaRobot ----------------
// D435i-like head: long bar, lenses at asymmetric positions (knocked out), RGB lens in the accent color.
function d435(G, P, cx, cy, w, detail) {
  var h = w / 3.4, x = cx - w / 2, y = cy - h / 2, r = h * 0.42, lr = h * 0.2;
  var holes = [ellipsePath(G, x + w * 0.15, cy, lr), ellipsePath(G, x + w * 0.85, cy, lr), ellipsePath(G, x + w * 0.6, cy, lr * 1.15)];
  if (detail) holes.push(rrectPath(G, x + w * 0.335, cy - lr * 0.55, lr * 1.6, lr * 1.1, lr * 0.3));
  withHoles(G, rrectPath(G, x, y, w, h, r), holes, P.main);
  circle(G, x + w * 0.6, cy, lr * 0.62, P.accent);
  return h;
}
function capsule(G, P, x1, y1, x2, y2, w) { return line(G, [[x1, y1], [x2, y2]], P.main, w); }
function gripper(G, P, x, y, dir, hold) {
  var s = dir === "up" ? -1 : 1;
  line(G, [[x - 22, y], [x + 22, y]], P.main, 16);
  line(G, [[x - 20, y], [x - 20, y + s * 34]], P.main, 13);
  line(G, [[x + 20, y], [x + 20, y + s * 34]], P.main, 13);
  if (hold) circle(G, x, y + s * 28, 16, P.accent);
}
// Body on a 512 grid. Wheel centers (192, 448) and (320, 448), radius 32.
function body(G, P) {
  fill(rrectPath(G, 146, 390, 220, 46, 20), P.main);
  ring(G, 192, 448, 32, 12, P.main); ring(G, 320, 448, 32, 12, P.main);
  poly(G, [[204, 352], [308, 352], [322, 392], [190, 392]], P.main);
  rect(G, 236, 214, 40, 142, P.main);
  rect(G, 246, 160, 20, 60, P.main);
  d435(G, P, 256, 146, 204, false);
  fill(rrectPath(G, 222, 238, 68, 30, 12), P.main);
  // left arm: L pose, gripper down
  capsule(G, P, 210, 252, 142, 236, 38);
  capsule(G, P, 108, 252, 114, 316, 38);
  gripper(G, P, 114, 340, "down", false);
  // right arm: raised, holding the orange object
  capsule(G, P, 302, 252, 370, 236, 38);
  capsule(G, P, 404, 226, 410, 150, 38);
  gripper(G, P, 410, 126, "up", true);
}

// Mark (512 grid): the trail slope + the robot tilted to the slope so both wheels touch it.
var SLOPE = [[12, 500], [500, 430]];
function mark(G, P) {
  poly(G, [SLOPE[0], SLOPE[1], [500, 500]], P.main);
  var g = G.groupItems.add(), s = 0.84, ox = 40, oy = 40, front, R;
  at(ox, oy, s, function () { body(g, P); front = pt(320, 448); R = 32 * SC; });
  var ang = Math.atan((SLOPE[0][1] - SLOPE[1][1]) / (SLOPE[1][0] - SLOPE[0][0])) * 180 / Math.PI;
  var b = g.geometricBounds, cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2;
  g.rotate(ang, true, true, true, true, Transformation.CENTER);
  var a = ang * Math.PI / 180;
  function rot(p) { var dx = p[0] - cx, dy = p[1] - cy; return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)]; }
  var f = rot(front);
  // slope surface in document coordinates
  var s0 = pt(SLOPE[0][0], SLOPE[0][1]), s1 = pt(SLOPE[1][0], SLOPE[1][1]);
  var ys = s0[1] + (s1[1] - s0[1]) * (f[0] - s0[0]) / (s1[0] - s0[0]);
  g.translate(0, ys + R / Math.cos(a) - f[1]);
}

// Favicon / small icon: the head alone, on a short neck.
function icon(G, P) {
  d435(G, P, 256, 236, 480, false);
  rect(G, 226, 300, 60, 70, P.main);
  fill(rrectPath(G, 116, 362, 280, 70, 35), P.main);
}

// Horizontal lockup at (x, y) with mark height h. Returns width.
function lockup(G, P, x, y, h) {
  at(x, y, h / 512, function () { mark(G, P); });
  var wx = x + h * 1.08, wy = y + h * 0.36, ws = h * 0.5 / 100, ww = 0;
  at(wx, wy, ws, function () { ww = wordF(G, 0, P); });
  return h * 1.08 + ww * ws;
}

// ---------------- document ----------------
while (app.documents.length) app.documents[0].close(SaveOptions.DONOTSAVECHANGES);
var D = app.documents.add(DocumentColorSpace.RGB, 1200, 800);
D.rulerOrigin = [0, 0];
var BG = D.layers[0]; BG.name = "preview background (hidden on export)";
var ART = D.layers.add(); ART.name = "logo";

var boardCount = 0;
function board(name, x, y, w, h, bg) {
  var r = [x, -y, x + w, -(y + h)];
  var ab = boardCount === 0 ? D.artboards[0] : D.artboards.add(r);  // reuse the document's first artboard
  boardCount++;
  ab.artboardRect = r; ab.name = name;
  if (bg) { OX = 0; OY = 0; SC = 1; rect(BG, x, y, w, h, bg); }
  return ab;
}
function grp(name) { var g = ART.groupItems.add(); g.name = name; return g; }

// Lockups (height 140), with 10 units of padding
var H = 140, PAD = 10, LW = 0;
OX = 0; OY = 0; SC = 1;
LW = lockup(grp("logo"), LIGHT, PAD, PAD, H);
board("logo", 0, 0, LW + 2 * PAD, H + 2 * PAD, "#FAF8F1");
lockup(grp("logo-dark"), DARK, PAD, 300 + PAD, H);
board("logo-dark", 0, 300, LW + 2 * PAD, H + 2 * PAD, "#1E2A17");
lockup(grp("logo-mono"), MONO, PAD, 600 + PAD, H);
board("logo-mono", 0, 600, LW + 2 * PAD, H + 2 * PAD, "#FFFFFF");

// Square mark and favicon (512)
var g;
g = grp("mark"); at(1000, 0, 1, function () { mark(g, LIGHT); });
board("mark", 1000, 0, 512, 512, "#FAF8F1");
g = grp("favicon"); at(1600, 0, 1, function () { icon(g, LIGHT); });
board("favicon", 1600, 0, 512, 512, "#FFFFFF");

// Home-screen icon: mark on the paper color, with margins (exported at 180 x 180)
g = grp("apple-touch-icon");
OX = 0; OY = 0; SC = 1; rect(g, 2200, 0, 512, 512, PAPER);
at(2200 + 56, 40, 0.78, function () { mark(g, LIGHT); });
board("apple-touch-icon", 2200, 0, 512, 512, null);

// Social image 1200 x 630: lockup centered on the paper color
g = grp("og");
OX = 0; OY = 0; SC = 1; rect(g, 1000, 700, 1200, 630, PAPER);
var oh = 230, ow = lockup(g, LIGHT, 0, 0, oh);  // measure
g.remove(); g = grp("og");
OX = 0; OY = 0; SC = 1; rect(g, 1000, 700, 1200, 630, PAPER);
lockup(g, LIGHT, 1000 + (1200 - ow) / 2, 700 + (630 - oh) / 2 - 10, oh);
board("og", 1000, 700, 1200, 630, null);

D.saveAs(new File(LOGO_DIR + "/trail-club-logo.ai"));

// ---------------- export (preview backgrounds hidden) ----------------
BG.visible = false;
function idx(name) { for (var i = 0; i < D.artboards.length; i++) if (D.artboards[i].name === name) return i + 1; return 0; }
function exportBoards(names, type, opts) {
  var list = []; for (var i = 0; i < names.length; i++) list.push(idx(names[i]));
  var item = new ExportForScreensItemToExport(); item.artboards = list.join(","); item.document = false;
  D.exportForScreens(new Folder(EXPORT_DIR), type, opts, item);
}
var svg = new ExportForScreensOptionsWebOptimizedSVG(); svg.svgResponsive = true;
exportBoards(["logo", "logo-dark", "logo-mono", "mark", "favicon"], ExportForScreensType.SE_SVG, svg);
var png180 = new ExportForScreensOptionsPNG24(); png180.scaleType = ExportForScreensScaleType.SCALEBYWIDTH; png180.scaleTypeValue = 180;
exportBoards(["apple-touch-icon"], ExportForScreensType.SE_PNG24, png180);
var png1 = new ExportForScreensOptionsPNG24(); png1.scaleType = ExportForScreensScaleType.SCALEBYFACTOR; png1.scaleTypeValue = 1;
exportBoards(["og"], ExportForScreensType.SE_PNG24, png1);
BG.visible = true;
D.save();
app.executeMenuCommand("fitall");
"ok " + D.artboards.length;
