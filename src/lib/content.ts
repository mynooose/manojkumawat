/**
 * Typed view over content.json.
 *
 * All copy and figures live in content.json — edit that, not a component.
 * The interfaces here are the contract; a mismatch is a build error rather
 * than something that shows up as `undefined` in the page.
 */
import raw from './content.json';

export interface Meta {
  readonly name: string;
  readonly role: string;
  readonly years: number;
  readonly email: string;
  readonly linkedin: string;
  readonly location: string;
}

export interface Hero {
  readonly pill: string;
  /** Two lines; the second renders de-emphasised. */
  readonly headline: readonly [string, string];
  readonly lede: string;
  readonly marquee: readonly string[];
}

export interface ProjectLayer {
  readonly t: string;
  readonly line: string;
}

export interface Project {
  readonly title: string;
  readonly tag: string;
  readonly role: string;
  readonly problem: string;
  readonly built: string;
  readonly outcome: string;
  readonly stack: readonly string[];
  readonly layers: readonly ProjectLayer[];
  readonly caseStudy?: readonly { readonly h: string; readonly p: string }[];
  /**
   * Flag, not a path: true means this project ships the architecture diagram
   * at DIAGRAM_SRC. Only project 01 has one.
   */
  readonly diagram?: boolean;
}

/** `[label, value]` pairs shown in the architecture detail panel. */
export type NodeMeta = readonly (readonly [string, string])[];

/** Columns of the diagram, matching the shipped SVG. */
export type ArchitectureZone =
  | 'client'
  | 'edge'
  | 'control'
  | 'app'
  | 'data'
  | 'plat'
  | 'build';

export interface ArchitectureNode {
  readonly k: string;
  readonly z: ArchitectureZone;
  readonly n: string;
  readonly sub: string;
  readonly zone: string;
  readonly meta: NodeMeta;
}

/** A connection recovered from the architecture diagram. */
export interface ArchitectureEdge {
  readonly from: string;
  readonly to: string;
  /** flow = request path, integration = managed service, release = build. */
  readonly kind: 'flow' | 'integration' | 'release';
}

export interface ProcessStage {
  readonly t: string;
  readonly d: string;
  readonly deliver: readonly string[];
}

export interface CareerEntry {
  readonly y: string;
  readonly t: string;
  readonly d: string;
}

export interface Technology {
  readonly name: string;
  readonly detail: string;
}

export interface SkillDomain {
  readonly title: string;
  readonly technologies: readonly Technology[];
}

export interface ConsoleTenant {
  readonly n: string;
  readonly plan: string;
  readonly region: string;
  readonly base: number;
  readonly empty: boolean;
}

export interface ConsoleRange {
  readonly n: string;
  readonly label: string;
  readonly mult: number;
}

export interface ConsoleIntent {
  readonly name: string;
  readonly weight: number;
}

export interface ConsoleContent {
  readonly tenants: readonly ConsoleTenant[];
  readonly ranges: readonly ConsoleRange[];
  readonly intents: readonly ConsoleIntent[];
  readonly disclaimer?: string;
}

export interface Contact {
  readonly eyebrow?: string;
  readonly headline: string;
  readonly paragraphs: readonly string[];
}

interface Content {
  readonly meta: Meta;
  readonly hero: Hero;
  readonly alsoDelivered: string;
  readonly contact: Contact;
  readonly footer: readonly string[];
  readonly projects: readonly Project[];
  readonly architectureNodes: readonly ArchitectureNode[];
  /** Node keys the ambient tour walks, in request order. */
  readonly architectureTour: readonly string[];
  readonly architectureEdges: readonly ArchitectureEdge[];
  readonly processStages: readonly ProcessStage[];
  readonly career: readonly CareerEntry[];
  readonly skills: readonly SkillDomain[];
  readonly console: ConsoleContent;
}

const content = raw as unknown as Content;

/** The one architecture diagram the site ships, served from /public. */
export const DIAGRAM_SRC = '/architecture.svg';

export const META = content.meta;
export const HERO = content.hero;
export const ALSO_DELIVERED = content.alsoDelivered;
export const CONTACT = content.contact;
export const FOOTER = content.footer;
export const PROJECTS = content.projects;
export const ARCHITECTURE_NODES = content.architectureNodes;
export const ARCHITECTURE_TOUR = content.architectureTour;
export const ARCHITECTURE_EDGES = content.architectureEdges;
export const PROCESS_STAGES = content.processStages;
export const CAREER = content.career;
export const SKILLS = content.skills;
export const CONSOLE = content.console;

export default content;
