import React from 'react';
import localFont from 'next/font/local';
import GlassSurface from '@/components/GlassSurface';

const standerdRegular = localFont({
  src: '../app/fonts/StanderdfreeRegular-X3KK2.otf'
});

export default function HomeHero() {
  return (
    <div className={`${standerdRegular.className} grid justify-items-center mt-[1em] gap-[1em] text-center`}>
      <GlassSurface
        displace={15}
        distortionScale={-150}
        redOffset={5}
        greenOffset={15}
        blueOffset={25}
        brightness={60}
        opacity={0.8}
        mixBlendMode="screen"
        height={210}
        width={520}
        className="max-w-[90vw]"
        style={{ height: 'auto' }}
      >
        <p className="text-cream-white p-4">
          I’m Adi Tauqir, a Computer Science student at Georgia State University with a strong focus on software engineering, AI systems, and cybersecurity. I
          enjoy building fast, scalable, and intelligent tools that blend backend engineering with modern AI workflows.
        </p>
      </GlassSurface>

      <a href="/resume.pdf" download className="inline-block">
        <GlassSurface
          displace={20}
          distortionScale={-150}
          redOffset={5}
          greenOffset={15}
          blueOffset={25}
          brightness={10}
          opacity={1}
          mixBlendMode="color"
          borderRadius={999}
          height={58}
          width={230}
        >
          <span className="text-xl text-cream-white transition-all ease-in-out duration-300 hover:text-highlight-this">
            Download Resume
          </span>
        </GlassSurface>
      </a>
    </div>
  );
}

