import dynamic from "next/dynamic";
import { BackgroundGradientAnimationSSR } from "./GradientSSR";

export const BackgroundGradientAnimation = dynamic(
  () => import("./GradientSSR"),
  { ssr: false }
);