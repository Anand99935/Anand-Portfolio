import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

const SITE_URL = SITE.url;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
