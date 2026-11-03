import type { MetadataRoute } from "next";

const baseUrl = "https://www.avrai.org";
const routes = ["", "/access"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route ? "weekly" : "daily",
    priority: route ? 0.7 : 1,
  }));
}
