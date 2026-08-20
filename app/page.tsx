"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpIcon,
  ArrowUpRight,
  CheckIcon,
  CopyIcon,
  GlobeIcon,
} from "lucide-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareGithub,
  faSquareLinkedin,
} from "@fortawesome/free-brands-svg-icons";

import GsuLocationHover from "@/components/GsuLocationHover";
import HomeClock from "@/components/HomeClock";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Input } from "@/components/ui/input";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { cn } from "@/lib/utils";

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/aditauqir",
    icon: faSquareGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/aditauqir/",
    icon: faSquareLinkedin,
  },
];

const projectItems = [
  {
    value: "zirn",
    label: "zirn",
    description:
      "a local-first ai knowledge workspace for turning messy links, pdfs, screenshots, copied text, notes, and unfinished ideas into structured markdown knowledge. it focuses on durable context, editable vault files, source-aware organization, and ai-assisted compilation instead of temporary chatbot answers.",
    featured: true,
    siteHref: "https://www.zirn.app/",
  },
  {
    value: "fyp",
    label: "fyp",
    description:
      "an orion browser extension for iphone that loads desktop youtube and restyles it into a phone-friendly player with background playback and screen-off audio. ublock origin handles ads, so it gets closer to youtube premium without the subscription.",
    githubHref: "https://github.com/aditauqir/fyp",
  },
  {
    value: "awry",
    label: "awry",
    description:
      "a recession prediction system that uses macroeconomic data and an ensemble of machine learning models to estimate real-time and forward-looking economic risk. it combines multiple indicators from fred and outputs a calibrated probability rather than a binary signal.",
    githubHref: "https://github.com/aditauqir/AWRY",
  },
  {
    value: "resume-fx",
    label: "resume fx",
    description:
      "an ai-powered resume optimization tool that analyzes content, rewrites bullet points, and generates clean, production-ready latex resumes. it's designed to improve clarity, impact, and ats performance in a single pipeline.",
    githubHref: "https://github.com/aditauqir/resume-fx",
  },
  {
    value: "zaman",
    label: "zaman",
    description:
      "a system for tracking and trading time. using a virtual coins system a user can trade their time for doing tasks. uses SHA-256 encryption and auth for login. all cli, quick and easy.",
    githubHref: "https://github.com/aditauqir/Zaman",
  },
];

const zirnSiteHref = "https://www.zirn.app/";
const fypGithubHref = "https://github.com/aditauqir/fyp";

const howIBuildItems = [
  "start with the problem",
  "build the smallest version that proves something.",
  "measure what breaks.",
  "throw away bad assumptions.",
  "iterate fast.",
  "keep the parts that actually work.",
];

const stackItems = [
  "python",
  "c / c++ / c#",
  "typescript",
  "react / next.js",
  "openai + claude apis",
  "ollama / mistral / gemini",
  "rag + semantic retrieval",
  "ai agents + mcp",
  "langchain / langgraph",
  "pytorch / tensorflow",
  "fastapi",
  "supabase / postgres / mysql",
  "faiss vector search",
  "redis",
  "docker",
  "aws / s3 / ec2",
  "azure",
  "vercel",
  "linux",
  "cursor / claude code / codex / windsurf",
  "github actions",
];

export default function HomePage() {
  const [copiedProject, setCopiedProject] = useState<string | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  const copyText = async (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      if (document.execCommand("copy")) {
        return true;
      }
    } catch {
    } finally {
      document.body.removeChild(textarea);
    }

    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  const handleCopyGitCommand = async (
    projectValue: string,
    githubHref?: string,
  ) => {
    if (!githubHref) {
      return;
    }

    const didCopy = await copyText(`git clone ${githubHref}`);

    if (!didCopy) {
      return;
    }

    if (copyTimeoutRef.current) {
      window.clearTimeout(copyTimeoutRef.current);
    }

    setCopiedProject(projectValue);
    copyTimeoutRef.current = window.setTimeout(() => {
      setCopiedProject(null);
      copyTimeoutRef.current = null;
    }, 1800);
  };

  return (
    <>
      <main className="flex min-h-screen flex-col bg-background text-foreground">
        <div className="flex min-h-screen flex-1 flex-col transition-all duration-200">
          <section className="flex-1 px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-[7rem] xl:px-16">
            <div className="mx-auto flex w-full max-w-[34rem] flex-col gap-6 lg:gap-8">
              <div className="flex items-start justify-between gap-8">
                <div className="space-y-5">
                  <h1 className="text-[clamp(2rem,5.8vw,3.6rem)] leading-[0.92] font-normal tracking-[-0.08em]">
                    <span>hi, i&apos;m </span>
                    <PointerHighlight
                      rectangleClassName="border-black"
                      pointerClassName="text-black"
                      containerClassName="inline-flex align-baseline"
                    >
                      <span className="relative z-10 inline-block px-1">
                        Adi
                      </span>
                    </PointerHighlight>
                    <sup className="ml-1 align-super text-[0.38em] font-normal tracking-[-0.04em] text-[rgb(153,151,151)]">
                      aka. &quot;Noor&quot;
                    </sup>
                  </h1>
                  <HomeClock />
                </div>

                <div className="flex shrink-0 items-center gap-4 pt-1">
                  {socialLinks.map((socialLink) => (
                    <Link
                      key={socialLink.label}
                      href={socialLink.href}
                      aria-label={socialLink.label}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-[1.2rem] w-[1.2rem] items-center justify-center rounded-sm border border-border-subtle bg-white text-black transition-colors duration-200 hover:text-[rgb(90,90,90)]"
                    >
                      <FontAwesomeIcon
                        icon={socialLink.icon}
                        className="text-[1.95rem]"
                      />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="w-full space-y-8 text-[0.86rem] leading-[1.6] tracking-[-0.05em] lg:text-[0.81rem]">
                <Button
                  asChild
                  className="h-auto w-fit rounded-full bg-black px-3 py-1.5 text-[0.86rem] font-medium tracking-[-0.05em] !text-white hover:bg-[rgb(35,35,35)] hover:!text-white lg:text-[0.81rem]"
                >
                  <a href="/resume.pdf" download>
                    resume
                  </a>
                </Button>
                <div className="flex w-full items-start justify-between gap-6 py-2">
                  <div className="w-fit space-y-4">
                    <p className="text-[0.76rem] leading-[1.4] tracking-[-0.05em] text-muted-foreground">
                      A startup im working on
                    </p>
                    <HoverBorderGradient
                      as="a"
                      href={zirnSiteHref}
                      target="_blank"
                      rel="noreferrer"
                      duration={0.8}
                      containerClassName="rounded-full border-0 bg-transparent shadow-none"
                      className="flex items-center border border-black bg-background px-3 py-1.5 text-[0.86rem] font-medium tracking-[-0.05em] !text-black shadow-none lg:text-[0.81rem]"
                    >
                      zirn.app
                    </HoverBorderGradient>
                  </div>
                  <div className="w-fit space-y-4 text-right">
                    <p className="text-[0.76rem] leading-[1.4] tracking-[-0.05em] text-muted-foreground">
                      A passion project im working on:
                    </p>
                    <div className="flex justify-end">
                      <HoverBorderGradient
                        as="a"
                        href={fypGithubHref}
                        target="_blank"
                        rel="noreferrer"
                        duration={0.8}
                        containerClassName="rounded-full border-0 bg-transparent shadow-none"
                        className="flex items-center border border-black bg-background px-3 py-1.5 text-[0.86rem] font-medium tracking-[-0.05em] !text-black shadow-none lg:text-[0.81rem]"
                      >
                        FYP
                      </HoverBorderGradient>
                    </div>
                  </div>
                </div>

                <p className="relative z-[100]">
                  i&apos;m a computer science student pursuing B.S./M.S. at{" "}
                  <GsuLocationHover />
                </p>
                <p>
                  i like building things that feel useful, sharp, and a little
                  unfair.
                </p>

                <div className="space-y-3">
                  <p>right now i&apos;m interested in:</p>
                  <ul className="space-y-1 pl-5">
                    <li>local-first tools for keeping context around</li>
                    <li>turning messy information into something reusable</li>
                    <li>macroeconomic forecasting</li>
                    <li>ai systems that are useful</li>
                    <li>software that actually does something</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold tracking-[-0.08em]">
                    A FEW THINGS:
                  </p>
                  <ul className="space-y-1 pl-5">
                    <li>
                      built awry, a recession prediction system using
                      macroeconomic data
                    </li>
                    <li>
                      building zirn, a local-first ai workspace for compiling
                      messy information into reusable markdown knowledge
                    </li>
                    <li>trained an ensemble model with 99%+ auroc</li>
                    <li>
                      building full-stack + ai systems with python, c/c++, and
                      typescript
                    </li>
                    <li>shipping projects fast, iterating faster</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold tracking-[-0.08em]">
                    SOME THINGS I&apos;M WORKING ON:
                  </p>
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue="zirn"
                    className="w-full"
                  >
                    {projectItems.map((projectItem) => (
                      <AccordionItem
                        key={projectItem.value}
                        value={projectItem.value}
                        className={cn(
                          "border-border-subtle",
                          projectItem.featured && "border-black",
                        )}
                      >
                        <AccordionTrigger
                          className={cn(
                            "py-3 text-[0.86rem] tracking-[-0.06em] lg:text-[0.81rem]",
                            projectItem.featured && "font-semibold text-black",
                          )}
                        >
                          {projectItem.label}
                        </AccordionTrigger>
                        <AccordionContent
                          className={cn(
                            "space-y-3 text-[0.8rem] leading-[1.55] tracking-[-0.05em] text-muted-foreground lg:text-[0.76rem]",
                            projectItem.featured && "text-[rgb(55,55,55)]",
                          )}
                        >
                          <p>{projectItem.description}</p>
                          {projectItem.siteHref ? (
                            <a
                              href={projectItem.siteHref}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-black underline decoration-black underline-offset-2"
                            >
                              zirn.app
                              <ArrowUpRight
                                aria-hidden
                                className="size-3.5"
                                strokeWidth={1.75}
                              />
                            </a>
                          ) : null}
                          {projectItem.githubHref ? (
                            <div className="flex max-w-full items-center overflow-hidden rounded-lg border border-[rgb(185,190,188)] bg-[#f2f5f4] px-2">
                              <Input
                                readOnly
                                value={`git clone ${projectItem.githubHref}`}
                                aria-label={`${projectItem.label} git command`}
                                className="h-8 min-w-0 flex-1 border-0 bg-transparent px-0 text-[0.76rem] tracking-[-0.05em] text-[rgb(45,45,45)] shadow-none selection:bg-black/10 selection:text-black focus-visible:ring-0 lg:text-[0.72rem]"
                              />
                              <Button
                                type="button"
                                onClick={() =>
                                  handleCopyGitCommand(
                                    projectItem.value,
                                    projectItem.githubHref,
                                  )
                                }
                                aria-label={`Copy ${projectItem.label} git command`}
                                className="size-7 shrink-0 rounded-md bg-transparent p-0 text-[rgb(85,85,85)] shadow-none hover:bg-[rgb(220,225,223)] hover:text-black"
                              >
                                {copiedProject === projectItem.value ? (
                                  <CheckIcon className="size-3.5" />
                                ) : (
                                  <CopyIcon className="size-3.5" />
                                )}
                              </Button>
                              <Link
                                href={projectItem.githubHref}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`Open ${projectItem.label} GitHub`}
                                className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-transparent p-0 text-[rgb(85,85,85)] no-underline shadow-none transition-all hover:bg-[rgb(220,225,223)] hover:text-black"
                              >
                                <GlobeIcon className="size-3.5" />
                              </Link>
                            </div>
                          ) : null}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold tracking-[-0.08em]">
                    HOW I BUILD:
                  </p>
                  <ul className="space-y-1 pl-5">
                    {howIBuildItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p>
                    i&apos;m not particularly interested in building demos that
                    look intelligent.
                  </p>
                  <p>
                    i want to build software that remembers, predicts,
                    automates, or gives someone leverage they didn&apos;t have
                    before.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold tracking-[-0.08em]">STACK:</p>
                  <ul className="space-y-1 pl-5">
                    {stackItems.map((stackItem) => (
                      <li key={stackItem}>{stackItem}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <footer className="border-t border-[rgb(130,130,130)] px-6 py-4 text-[1rem] tracking-[-0.08em] sm:px-8 lg:px-12 lg:py-6 lg:text-[0.8rem] xl:px-16">
            <div className="mx-auto flex w-full max-w-[34rem] items-center justify-between">
              <p>@noor</p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Back to top"
                className="size-auto rounded-full border-0 p-0 text-[1rem] shadow-none hover:bg-transparent hover:text-[rgb(90,90,90)] lg:text-[0.8rem]"
              >
                <ArrowUpIcon className="size-[1rem] lg:size-[0.8rem]" />
              </Button>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
