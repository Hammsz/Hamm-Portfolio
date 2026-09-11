import Signature from "@/components/brand/Signature";
import type { BrandTone } from "@/components/brand/BrandMark";
import HeaderInteractions from "@/components/header/HeaderInteractions";
import { portfolioData } from "@/data/portfolio";

type HeaderProps = {
  tone?: BrandTone;
};

export default function Header({ tone = "dark" }: HeaderProps) {
  return (
    <HeaderInteractions
      brandName={portfolioData.brandName}
      menuWords={portfolioData.menuWords}
      navigation={portfolioData.navigation}
      tone={tone}
      signature={
        <Signature
          className="header-signature"
          decorative
          priority
          tone={tone}
        />
      }
    />
  );
}
