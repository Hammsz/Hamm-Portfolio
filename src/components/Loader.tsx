import Signature from "@/components/brand/Signature";
import LoaderSequence from "@/components/loader/LoaderSequence";

export default function Loader() {
  return (
    <LoaderSequence
      signature={<Signature tone="dark" decorative priority />}
    />
  );
}
