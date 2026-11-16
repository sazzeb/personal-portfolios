import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const referenceRoot = "https://inversweb.com/product/html/reeni/assets/images";
const imagePaths = [
  "logo/man.png",
  "banner/banner-background-one.jpg",
  "banner/banner-user-image-one.png",
  "custom-line/custom-line.png",
  "services/latest-services-user-image.png",
  "experiences/expert-img.jpg",
  "breadcrumb/breadcum-bg.png",
  ...Array.from(
    { length: 8 },
    (_, index) => `our-supported-company/company-logo-${index + 1}.svg`,
  ),
  ...Array.from(
    { length: 4 },
    (_, index) => `latest-portfolio/portfoli-img-${index + 1}.jpg`,
  ),
  "testimonial/testimonial-icon.svg",
  "testimonial/bg-image-1png.png",
  "testimonial/bg-image-2.png",
];

const fonts = [
  ["rajdhani-400.ttf", "rajdhani/v17/LDIxapCSOBg7S-QT7q4A.ttf"],
  ["rajdhani-500.ttf", "rajdhani/v17/LDI2apCSOBg7S-QT7pb0EMOs.ttf"],
  ["rajdhani-600.ttf", "rajdhani/v17/LDI2apCSOBg7S-QT7pbYF8Os.ttf"],
  ["rajdhani-700.ttf", "rajdhani/v17/LDI2apCSOBg7S-QT7pa8FsOs.ttf"],
  ["rubik-400.ttf", "rubik/v31/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-B4i1UA.ttf"],
  ["rubik-500.ttf", "rubik/v31/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-NYi1UA.ttf"],
  ["rubik-600.ttf", "rubik/v31/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-2Y-1UA.ttf"],
];

async function downloadAsset(url, destination) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  if (response.headers.get("content-type")?.includes("text/html")) {
    throw new Error(`Expected a media asset, received HTML: ${url}`);
  }
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

const images = imagePaths.map((path) => ({
  url: `${referenceRoot}/${path}`,
  destination: resolve("public/images/sammy", path),
}));
const fontAssets = fonts.map(([name, path]) => ({
  url: `https://fonts.gstatic.com/s/${path}`,
  destination: resolve("src/styles/fonts", name),
}));

// Keep concurrency bounded so the author's public server is not overloaded.
const assets = [...images, ...fontAssets];
for (let index = 0; index < assets.length; index += 4) {
  await Promise.all(
    assets
      .slice(index, index + 4)
      .map(({ url, destination }) => downloadAsset(url, destination)),
  );
}
console.log(`Downloaded ${assets.length} reference images and font files.`);
