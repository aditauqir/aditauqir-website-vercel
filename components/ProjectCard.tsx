'use client';

import React from 'react';
import Link from 'next/link';
import GlassSurface from '@/components/GlassSurface';
import type { ProjectItem } from '@/lib/constants';

type Props = {
  project: ProjectItem;
};

export default function ProjectCard({ project }: Props) {
  return (
    <div className="w-full max-w-[520px] px-4">
      <GlassSurface
        displace={15}
        distortionScale={-150}
        redOffset={5}
        greenOffset={15}
        blueOffset={25}
        brightness={40}
        opacity={0.9}
        mixBlendMode="screen"
        borderRadius={32}
        width="100%"
        height={220}
        className="max-w-full"
        style={{ height: 'auto' }}
      >
        <div className="w-full text-left space-y-3 p-5">
          <h2 className="text-2xl text-cream-white">{project.title}</h2>
          <Link
            href={project.github_url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 text-sm text-cream-white/80 underline underline-offset-2 break-all"
          >
            {project.github_url}
          </Link>
          <p className="mt-1 text-sm text-cream-white/80 leading-relaxed">{project.description}</p>
        </div>
      </GlassSurface>
    </div>
  );
}

