import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/features/_root/app";
import { getSchoolIdSync } from "@/features/_global/hooks/getSchoolId";
import { loadAndApplyTheme } from "@/core/utils/themeConfig";
import { MetaTagsInjector } from "@/core/utils/seo";

// Import styles...
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "../node_modules/leaflet/dist/leaflet.css";
import "./core/styles/index.css";

// Load theme and SEO metadata early
loadAndApplyTheme(getSchoolIdSync());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <MetaTagsInjector />
  </StrictMode>,
);