import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

// 源图片（黑暗之环）
const SRC = "C:/Users/sy479/Desktop/其他/黑魂1黑暗之环.webp";
const FAVICON_DIR = "public/favicon";
const LOGO_DIR = "src/assets/images/logo";

// 浅色版本（用于深色主题）的填充颜色：亮橙色，保留火焰感
const LIGHT_FILL = { r: 255, g: 158, b: 77, alpha: 1 };

// 深色版本：直接使用原图，缩放到目标尺寸（contain 居中，透明背景）
function makeDark(size) {
	return sharp(SRC)
		.resize(size, size, {
			fit: "contain",
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		})
		.png()
		.toBuffer();
}

// 浅色版本：用原图的 alpha 通道作为遮罩，填充亮橙色
async function makeLight(size) {
	const alpha = await sharp(SRC)
		.resize(size, size, {
			fit: "contain",
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		})
		.ensureAlpha()
		.extractChannel("alpha")
		.toBuffer();

	return sharp({
		create: {
			width: size,
			height: size,
			channels: 4,
			background: LIGHT_FILL,
		},
	})
		.composite([{ input: alpha, blend: "dest-in" }])
		.png()
		.toBuffer();
}

await mkdir(FAVICON_DIR, { recursive: true });
await mkdir(LOGO_DIR, { recursive: true });

const targets = [];

// favicon：通用 firefly-*（深色）、favicon-light-*（深色）、favicon-dark-*（浅色）
for (const s of [32, 128, 180, 192]) {
	targets.push({
		file: `${FAVICON_DIR}/firefly-${s}.png`,
		make: () => makeDark(s),
	});
	targets.push({
		file: `${FAVICON_DIR}/favicon-light-${s}.png`,
		make: () => makeDark(s),
	});
	targets.push({
		file: `${FAVICON_DIR}/favicon-dark-${s}.png`,
		make: () => makeLight(s),
	});
}

// 导航栏 logo：firefly-light（深色）、firefly-dark（浅色）
targets.push({
	file: `${LOGO_DIR}/firefly-light.png`,
	make: () => makeDark(192),
});
targets.push({
	file: `${LOGO_DIR}/firefly-dark.png`,
	make: () => makeLight(192),
});

for (const t of targets) {
	const buf = await t.make();
	await writeFile(t.file, buf);
	console.log("wrote", t.file);
}

console.log("done, total", targets.length, "files");
