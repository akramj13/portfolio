"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image"; // Import Image from Next.js
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
    target?: string;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(true);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for toggling dropdown

  // Handle navbar visibility based on scroll direction
  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }

      // Clear any existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Set a new timeout to make navbar reappear after pause
      const timeout = setTimeout(() => {
        setVisible(true);
      }, 300); // Adjust the delay time as needed
      setScrollTimeout(timeout);
    }
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  // Toggle mobile dropdown visibility
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit md:min-w-[70vw] lg:min-w-fit fixed z-[5000] top-10 inset-x-0 mx-auto px-10 py-4 rounded-full border border-black/.1 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] items-center justify-center space-x-4",
          className
        )}
        style={{
          backdropFilter: "blur(16px) saturate(180%)",
          backgroundColor: "rgba(17, 25, 40, 0.75)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.125)",
        }}
      >
        {/* Logo */}
        <div className="flex-shrink-0 mr-2">
          <Link href="/" passHref>
            <Image
              src="/logo.svg" 
              alt="Logo"
              width={20}
              height={20}
              className="cursor-pointer"
            />
          </Link>
        </div>

        {/* Hamburger icon for mobile */}
        <div className="block md:hidden">
          <button onClick={toggleDropdown}>
            <span className="block h-1 w-6 bg-white mb-1"></span>
            <span className="block h-1 w-6 bg-white mb-1"></span>
            <span className="block h-1 w-6 bg-white"></span>
          </button>
        </div>

        {/* Dropdown menu (for mobile) */}
        {isDropdownOpen && (
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black/75 rounded-md py-4 px-8 w-64 z-50 md:hidden">
            {navItems.map((navItem, idx) => (
              <Link
                key={`dropdown-link-${idx}`}
                href={navItem.link}
                target={navItem.target}
                className="block py-2 text-white hover:text-gray-300"
              >
                {navItem.name}
              </Link>
            ))}
          </div>
        )}

        {/* Navigation Items (desktop) */}
        <div className="hidden md:flex space-x-4">
          {navItems.map((navItem, idx) => (
            <Link
              key={`link=${idx}`}
              href={navItem.link}
              target={navItem.target}
              className={cn(
                "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="!cursor-pointer">{navItem.name}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
