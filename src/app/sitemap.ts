import type { MetadataRoute } from "next";

const baseUrl = "https://avrai.org";

const routes = [
  "",
  "/about",
  "/business",
  "/contact",
  "/llms.txt",
  "/agents.txt",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route ? "weekly" : "daily",
    priority: route ? 0.7 : 1,
  }));
}
