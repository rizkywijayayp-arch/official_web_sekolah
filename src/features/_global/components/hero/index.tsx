import { DynamicHero } from "./DynamicHero";

interface HeroProps {
  id?: string;
  titleProps?: string;
  subTitleProps?: string;
}

export const HeroComp = ({ id, titleProps, subTitleProps }: HeroProps) => {
  return (
    <DynamicHero
      id={id}
      titleProps={titleProps}
      subTitleProps={subTitleProps}
    />
  );
};