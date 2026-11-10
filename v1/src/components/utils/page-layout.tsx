import React from "react";
import { twMerge } from "tailwind-merge";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  variant?: "default" | "wide" | "narrow";
}

function PageLayout({
  children,
  className,
  maxWidth = "2xl",
  variant = "default",
}: PageLayoutProps) {
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-md";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-xl";
      case "2xl":
        return "max-w-2xl";
      case "full":
        return "max-w-full";
      default:
        return "max-w-2xl";
    }
  };

  const getPaddingClass = () => {
    switch (variant) {
      case "wide":
        return "px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20";
      case "narrow":
        return "px-6 sm:px-8 md:px-10 lg:px-12";
      case "default":
      default:
        return "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16";
    }
  };

  return (
    <div
      className={twMerge(
        "w-full min-h-screen",
        "pt-22", // Space for navbar
        "pb-8", // Bottom padding
        getPaddingClass(),
        className
      )}
    >
      <div className={twMerge("mx-auto", getMaxWidthClass(), "w-full")}>
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
