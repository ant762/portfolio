export type ProjectCategory = 'programming' | 'environment';

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  /** Identificador estável usado na URL: /projects/[slug] */
  slug: string;
  category: ProjectCategory;
  /** Título curto (cards e listas) */
  title: string;
  /** Título completo (página do projeto) */
  headline: string;
  /** Uma linha de resumo */
  summary: string;
  /** Descrição completa */
  description: string;
  tags: string[];
  /** Imagem de capa (relativa a /public) */
  cover: string;
  /** Imagem de detalhe (relativa a /public) */
  detail: string;
  links: ProjectLink[];
}

export interface SocialLink {
  label: string;
  href: string;
  handle: string;
}
