import React from "react";
import { useEffect, useState } from "react";
import { API_CONFIG } from "@/config/api";
import { getSchoolIdSync } from "@/features/_global/hooks/getSchoolId";
import { setFavicon } from "./favicon";

interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  logoUrl?: string;
  schoolName?: string;
}

const DEFAULT_METADATA: SEOMetadata = {
  title: "Web Profile Sekolah",
  description: "Website resmi sekolah untuk informasi dan layanan pendidikan",
  keywords: "sekolah, pendidikan, profile sekolah",
};

export const useSEOMetadata = () => {
  const [metadata, setMetadata] = useState<SEOMetadata>(DEFAULT_METADATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const schoolId = getSchoolIdSync();
        const response = await fetch(`${API_CONFIG.BASE_URL}/profileSekolah?schoolId=${schoolId}`);
        const result = await response.json();

        if (result.success && result.data) {
          const profile = result.data;
          setMetadata({
            title: profile.seoTitle || profile.schoolName || DEFAULT_METADATA.title,
            description: profile.seoDescription || profile.headmasterWelcome?.substring(0, 160) || DEFAULT_METADATA.description,
            keywords: profile.seoKeywords || `sekolah, ${profile.schoolName}, pendidikan`,
            ogImage: profile.heroImageUrl || profile.ogImage || null,
            ogTitle: profile.ogTitle || profile.schoolName || DEFAULT_METADATA.title,
            ogDescription: profile.ogDescription || profile.headmasterWelcome?.substring(0, 160) || DEFAULT_METADATA.description,
            logoUrl: profile.logoUrl || null,
            schoolName: profile.schoolName || "",
          });
        }
      } catch (err) {
        console.error("Gagal fetch SEO metadata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return { metadata, loading };
};

interface SEOMetaTagsProps {
  customTitle?: string;
  customDescription?: string;
  customImage?: string;
}

export const SEOMetaTags = ({ customTitle, customDescription, customImage }: SEOMetaTagsProps) => {
  const { metadata } = useSEOMetadata();

  const title = customTitle || metadata.title || DEFAULT_METADATA.title;
  const description = customDescription || metadata.description || DEFAULT_METADATA.description;
  const image = customImage || metadata.ogImage || "/og-default.png";

  return (
    <>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={metadata.keywords || DEFAULT_METADATA.keywords} />
      <meta name="author" content="Xpresensi" />
      <meta name="robots" content="index, follow" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={title} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : ""} />
    </>
  );
};

// Component untuk inject meta tags ke head
export const MetaTagsInjector = () => {
  const { metadata } = useSEOMetadata();

  useEffect(() => {
    // Update document title
    document.title = metadata.title || DEFAULT_METADATA.title;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && metadata.description) {
      metaDesc.setAttribute("content", metadata.description);
    }

    // Update OG tags
    const updateMetaProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    if (metadata.ogTitle) updateMetaProperty("og:title", metadata.ogTitle);
    if (metadata.ogDescription) updateMetaProperty("og:description", metadata.ogDescription);
    if (metadata.ogImage) updateMetaProperty("og:image", metadata.ogImage);

    // Update favicon dari API
    if (metadata.logoUrl || metadata.schoolName) {
      setFavicon(metadata.logoUrl || null, metadata.schoolName);
    }
  }, [metadata]);

  return null;
};
