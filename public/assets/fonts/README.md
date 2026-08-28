# 字体放置说明

本目录用于存放本地字体文件（`local` provider）。

## 像素风字体（方舟像素字体 Ark Pixel Font）

为了启用像素风格，请手动下载方舟像素字体并放入本目录：

1. 访问 https://github.com/TakWolf/ark-pixel-font/releases
2. 下载最新版本中 **12px proportional** 变体的 `woff2` 文件
   （推荐「ark-pixel-12px-proportional」）
3. 将下载的 `woff2` 文件重命名为：
   `ark-pixel-12px-proportional.woff2`
4. 放入本目录（即 `public/assets/fonts/`）
5. 打开 `src/config/fontConfig.ts`，把：
   ```ts
   selected: ["system"],
   ```
   改为：
   ```ts
   selected: ["--font-ark-pixel"],
   ```
6. 重启开发服务器（`pnpm dev`）即可生效。

> 注意：像素字体需在 12px 的整数倍字号（12px / 24px）下使用才清晰。

## 现有字体

- `GreatVibes-Regular-2.otf` —— 手写体（用于签名等场景）
