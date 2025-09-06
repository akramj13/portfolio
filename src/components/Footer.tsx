import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { navdata } from "@/config";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {Object.entries(navdata.contact.social).map(([name, social]) => (
              <Link
                key={name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-2 rounded-full hover:bg-accent"
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </Link>
            ))}
          </div>

          <Separator className="w-full max-w-xs" />

          {/* Copyright and Credits */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Akram Jamil.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
