"use client";

import { navItems } from "@/data";

import Hero from "@/components/Hero";
import Grid from "@/components/Grid";
import Footer from "@/components/Footer";
import Experience from "@/components/Experience";
import RecentProjects from "@/components/RecentProjects";
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import Technologies from "@/components/Technologies";
import dynamic from "next/dynamic";

const GridnoSSR = dynamic(() => import("@/components/Grid"), { ssr: false });

const Home = () => {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-clip mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <Hero />
        <GridnoSSR />
        <Technologies />
        <RecentProjects />
        {/* <Clients /> */}
        <Experience />
        {/* <Approach /> */}
        <Footer />
      </div>
    </main>
  );
};

export default Home;
