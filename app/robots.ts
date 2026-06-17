import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [],
      },
    ],
    sitemap: "https://devutilshub.vercel.app/sitemap.xml",
    host: "https://devutilshub.vercel.app",
  };
}
