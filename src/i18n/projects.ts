import type { Project } from '@/types';
import type { Locale } from './config';
import { dictionaries } from './dictionaries';

export interface ProjectCopy {
  headline: string;
  summary: string;
  description: string;
}

/** Traduções por slug. O inglês continua em `src/data/projects.ts` (fonte). */
export const projectCopy: Record<Exclude<Locale, 'en'>, Record<string, ProjectCopy>> = {
  es: {
    'personal-portfolio': {
      headline: 'Este Sitio',
      summary: 'Un banco de pruebas vivo del desarrollo web moderno.',
      description:
        'Este sitio es el proyecto. Fue creado para probar los límites del desarrollo web moderno: un shader WebGL en todo el sitio, scroll con inercia, animaciones GSAP guiadas por el scroll, transiciones de ruta, audio procedural, tres idiomas y una capa de contenido tipada. Abajo puedes leer cómo funciona cada parte y jugar con pequeños experimentos interactivos.',
    },
  },
  pt: {
    'personal-portfolio': {
      headline: 'Este Site',
      summary: 'Uma bancada viva de testes do desenvolvimento web moderno.',
      description:
        'Este site é o projeto. Foi criado para testar os limites do desenvolvimento web moderno: um shader WebGL em todo o site, rolagem com inércia, animações GSAP guiadas pelo scroll, transições de rota, áudio procedural, três idiomas e uma camada de conteúdo tipada. Abaixo você lê como cada parte funciona e brinca com pequenos experimentos interativos.',
    },
  },
};

/** Devolve o projeto com textos e rótulos de link no idioma pedido (inglês = original). */
export function localizeProject(project: Project, locale: Locale): Project {
  if (locale === 'en') return project;
  const t = dictionaries[locale].project;
  const copy = projectCopy[locale][project.slug];
  return {
    ...project,
    ...(copy ?? {}),
    links: project.links.map((link) => ({
      ...link,
      label:
        link.label === 'Watch the demo'
          ? t.demo
          : link.label === 'Source on GitHub'
            ? t.source
            : link.label,
    })),
  };
}
