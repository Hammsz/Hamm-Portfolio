import BrandMark from "@/components/brand/BrandMark";
import HeroBrandMotion from "./HeroBrandMotion";

type HeroBrandVisualProps = {
  className?: string;
  markClassName?: string;
};

export default function HeroBrandVisual({
  className,
  markClassName,
}: HeroBrandVisualProps) {
  return (
    <HeroBrandMotion className={className}>
      <BrandMark className={markClassName} decorative priority />
    </HeroBrandMotion>
  );
}
