/**
 * HeroDesignSwitcher.tsx
 * Automatically selects hero component based on schoolId.
 * Falls back to DynamicHero if no custom design exists.
 * All data sourced from profile API — no hardcoded school names.
 */
import { getSchoolIdSync } from "@/features/_global/hooks/getSchoolId";
import { DynamicHero } from "./DynamicHero";
import { HeroComp13 }    from "./hero13";
import { HeroComp40 }    from "./hero40";
import { HeroComp78101 } from "./hero78101";
import { HeroComp101 }   from "./hero101";

interface HeroSwitcherProps {
  id?: string;
  titleProps?: string;
  subTitleProps?: string;
}

export const HeroDesignSwitcher = ({ id, titleProps, subTitleProps }: HeroSwitcherProps) => {
  const schoolId = getSchoolIdSync();

  switch (schoolId) {
    case "13":
      return <HeroComp13    id={id} titleProps={titleProps} subTitleProps={subTitleProps} />;
    case "40":
      return <HeroComp40    id={id} titleProps={titleProps} subTitleProps={subTitleProps} />;
    case "78":
    case "101":
      return <HeroComp78101 id={id} titleProps={titleProps} subTitleProps={subTitleProps} />;
    default:
      // Default = DynamicHero — pulls title, subtitle, image from API
      return <DynamicHero    id={id} titleProps={titleProps} subTitleProps={subTitleProps} />;
  }
};

export default HeroDesignSwitcher;