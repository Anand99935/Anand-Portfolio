import { PROJECTS, BUILDING } from "@/lib/data";

import { SITE } from "@/lib/site";

const SITE_URL = SITE.url;

// First sentence of a description field, used as a tight one-line gist.
function firstSentence(text: string): string {
  const match = text.match(/^.+?[.!?](?=\s|$)/);
  return (match ? match[0] : text).trim();
}

// Loose normalization for "is this sentence basically just the subtitle
// again?" comparisons — ignores case, punctuation, and "&" vs "and".
function normalizeForComparison(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

type ProjectLink = { label: string; href: string; demo?: boolean };

function buildProjectsSection(): string {
  return PROJECTS.map((project) => {
    const links: readonly ProjectLink[] = "links" in project ? project.links : [];
    const primaryHref = links.find((link) => !link.demo)?.href ?? `${SITE_URL}/#projects`;
    const demoLink = links.find((link) => link.demo === true);

    // If a description opens by restating its subtitle, fall back to the
    // second sentence for a non-redundant gist.
    const sentences = project.description.split(/(?<=[.!?])\s+/).filter(Boolean);
    const leadSentence = firstSentence(project.description);
    const restatesSubtitle =
      normalizeForComparison(leadSentence) === normalizeForComparison(project.subtitle);
    const gist =
      sentences.length > 1 && restatesSubtitle
        ? firstSentence(sentences.slice(1).join(" "))
        : leadSentence;

    let line = `- [${project.title}](${primaryHref}): ${project.subtitle} — ${project.metric}. ${gist}`;
    if (demoLink) {
      line += ` Demo: ${demoLink.href.startsWith("/") ? SITE_URL + demoLink.href : demoLink.href}`;
    }
    return line;
  }).join("\n");
}

function buildBuildingSection(): string {
  return BUILDING.map(
    (item) => `- [${item.status}] ${item.title}: ${firstSentence(item.description)}`
  ).join("\n");
}

function buildBody(): string {
  return `# ${SITE.name}

> ${SITE.role} at Keyutech building a MERN-stack fintech web app and its companion Flutter mobile app (Socket.IO real-time chat, Nginx/SSL production deploys); open to full-stack and product engineering roles.

## Projects
${buildProjectsSection()}

## Currently building
${buildBuildingSection()}

## Links
- Site: ${SITE_URL}
- Email: ${SITE.email}
${SITE.github ? `- GitHub: ${SITE.github}\n` : ""}${SITE.linkedin ? `- LinkedIn: ${SITE.linkedin}\n` : ""}- Resume: ${SITE_URL}${SITE.resume}
`;
}

export const dynamic = "force-static";

export function GET() {
  return new Response(buildBody(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
