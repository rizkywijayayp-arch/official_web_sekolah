import { DynamicHero }         from "./DynamicHero";
import { HeroDesignSwitcher }  from "./HeroDesignSwitcher";

// Default: uses HeroDesignSwitcher → auto-selects by schoolId
export const HeroComp = (props: any) => <HeroDesignSwitcher {...props} />;

export default HeroComp;
export { HeroDesignSwitcher };