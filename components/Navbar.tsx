"use client"; // required for interactive elements like buttons

import React from "react";
import Link from "next/link";


function Navbar() {
  return (
      <div className="center flex justify-center space-x-6 inset-x-0 z-10 top-13 pt-30 absolute">
        <Link
  href="/socials"
  className="text-cream-white transition-all ease-in-out duration-300 hover:text-4xl text-shadow-lg/50 hover:text-highlight-this hover:text-shadow-lg/70"

>
  Socials
</Link>

        <Link href="/projects" className="text-cream-white transition-all ease-in-out duration-300 hover:text-4xl hover:text-highlight-this">
          Projects
        </Link>
      </div>
  );
}

export default Navbar;
