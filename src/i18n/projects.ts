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
    'character-customization': {
      headline: 'Personalización Avanzada de Personajes',
      summary: 'Equipamiento modular y animaciones por estados.',
      description:
        'Sistema de alto rendimiento con retroalimentación visual persistente. Incluye bucles de animación por estados, mecánicas de peso basadas en metadatos y compatibilidad R6/R15 con interpolación suave de cámara orbital.',
    },
    'tactical-framework': {
      headline: 'Framework de Misiones Tácticas',
      summary: 'IA avanzada y objetivos guiados por la historia.',
      description:
        'Motor táctico a gran escala inspirado en HELLMET. Incluye sistemas de diálogo dinámicos, objetivos con consecuencias (ROE) y una IA de NPC capaz de flanquear y fingir rendición.',
    },
    'vehicle-damage': {
      headline: 'Destrucción Dinámica de Vehículos',
      summary: 'Motor de daño localizado y soporte para A-Chassis.',
      description:
        'Sistema de daño completo compatible con A-Chassis. Incluye retroalimentación visual por niveles (humo/fuego), remoción procedural de neumáticos y multiplicadores de daño localizados según el punto de impacto.',
    },
    'trunk-burglary': {
      headline: 'Maletero e Inventario: Robo',
      summary: 'Seguridad y almacenamiento basado en peso.',
      description:
        'Sistema de seguridad vehicular que permite bloquear y desbloquear el almacenamiento para carga ilegal. Incluye mecánicas de robo: se pueden romper las ventanas y destruir las cerraduras del maletero.',
    },
    'open-world-economy': {
      headline: 'Economía de Mundo Abierto',
      summary: 'Sistema de múltiples trabajos e intercambio entre jugadores.',
      description:
        'Sistema de trabajos completo con minería, tala y agricultura. Incluye dinero físico que se puede soltar y un sistema único de equipamiento dinámico para lámparas al estilo RDR2.',
    },
    'industrial-iot-dashboard': {
      headline: 'Panel Industrial IoT',
      summary: 'Analítica de datos fullstack e integración con hardware.',
      description:
        'Plataforma compleja de analítica de datos desarrollada como proyecto final técnico. Incluye un panel de alta fidelidad para monitoreo industrial. Actualmente implemento la integración hardware-nube con C y ESP32 para la recolección de datos IoT en tiempo real.',
    },
    'personal-portfolio': {
      headline: 'Portafolio Dev Moderno',
      summary: 'El propio sitio que estás viendo ahora.',
      description:
        'Portafolio full-stack reconstruido con Next.js y TypeScript. Incluye un fondo WebGL en todo el sitio, scroll suave con inercia, animaciones GSAP guiadas por el scroll, transiciones de ruta y una capa de contenido tipada.',
    },
    'facial-expressions': {
      headline: 'Sistema de Expresiones Faciales',
      summary: 'Aleatoriza la boca y los ojos del jugador.',
      description:
        'Cada jugador tiene un rostro aleatorio. Los ojos y la boca cambian al azar cada pocos segundos, y cada expresión se actualiza en momentos completamente impredecibles.',
    },
    'caribbean-islands': {
      headline: 'Islas del Caribe: Level Design',
      summary: 'Entorno atmosférico y level design.',
      description:
        "Un amplio estudio de entorno inspirado en la edad de oro de la piratería y en Assassin's Creed IV: Black Flag. El proyecto se centra en la generación realista de terreno, la distribución de vegetación tropical y configuraciones de iluminación de alta fidelidad, con técnicas avanzadas de heightmap y pintura de texturas personalizada para lograr una auténtica atmósfera caribeña.",
    },
    'southern-highlands': {
      headline: 'Tierras Altas del Sur: Entorno Realista',
      summary: 'Entorno regional y estudio de materiales.',
      description:
        'Un estudio de entorno centrado en la topografía única del sur de Brasil (Serra Gaúcha). Explora la integración de tierras altas subtropicales con efectos atmosféricos de clima frío. Entre sus características técnicas: escultura de heightmap personalizada, orquestación avanzada de la densidad de niebla para crear profundidad y transiciones procedurales de material entre roca y pasto. Diseñado con foco en biomas naturales y dispersión realista de la luz solar.',
    },
    'caribbean-city-1715': {
      headline: 'Ciudad del Caribe: Históricamente Precisa',
      summary: 'Entorno urbano histórico.',
      description:
        'Una reconstrucción histórica de una ciudad portuaria del Caribe hacia 1715, con énfasis en la precisión arquitectónica colonial y el trazado urbano. El proyecto contrasta poblados densos con entornos costeros exuberantes, usando kits modulares de edificios e iluminación horneada personalizada para capturar la atmósfera sofocante y salobre de las Indias Occidentales.',
    },
    'northeastern-badlands': {
      headline: 'Noreste de Brasil: Bioma Semiárido',
      summary: 'Estudio de terreno y vegetación semiárida.',
      description:
        'Un estudio de entorno basado en los paisajes únicos del Sertão brasileño. Se enfoca en la topografía árida y en la distribución de la vegetación nativa característica del Nordeste. El terreno fue esculpido completamente desde cero, usando BrushTool para el modelado orgánico y MeshVox para la optimización del entorno en alta fidelidad.',
    },
    'squid-game-replica': {
      headline: 'Squid Game: Réplica Técnica',
      summary: 'Geometría arquitectónica y diseño de precisión.',
      description:
        'Una recreación de alta precisión de los entornos icónicos de la serie Squid Game. El proyecto enfatiza la escala arquitectónica, las paletas de colores vibrantes y las formas geométricas limpias para replicar la atmósfera surreal de la serie. El mapa incluye assets modulares construidos a medida, iluminación realista de aspecto natural y level design a gran escala.',
    },
    'undstread-local': {
      headline: 'Undstread Local: Estudio Avanzado de Biomas',
      summary: 'Entorno cinematográfico y estudio de biomas.',
      description:
        'Un proyecto de entorno que explora el contraste entre densos bosques de pinos y costas rocosas. Muestra formaciones rocosas esculpidas a mano y una pintura de terreno detallada, con fuerte énfasis en la profundidad atmosférica mediante niebla en capas y dispersión realista de rayos de sol (god rays) para lograr una experiencia inmersiva y cinematográfica.',
    },
  },
  pt: {
    'character-customization': {
      headline: 'Customização Avançada de Personagem',
      summary: 'Equipamentos modulares e animações por estados.',
      description:
        'Sistema de alta performance com feedback visual persistente. Possui loops de animação por estados, mecânicas de peso baseadas em metadados e compatibilidade R6/R15 com interpolação suave de câmera orbital.',
    },
    'tactical-framework': {
      headline: 'Framework de Missões Táticas',
      summary: 'IA avançada e objetivos guiados pela história.',
      description:
        'Engine tática de grande escala inspirada em HELLMET. Inclui sistemas de diálogo dinâmicos, objetivos com consequências (ROE) e uma IA de NPC capaz de flanquear e fingir rendição.',
    },
    'vehicle-damage': {
      headline: 'Destruição Dinâmica de Veículos',
      summary: 'Engine de dano localizado e suporte ao A-Chassis.',
      description:
        'Sistema de dano completo compatível com A-Chassis. Possui feedback visual em níveis (fumaça/fogo), remoção procedural de pneus e multiplicadores de dano localizados conforme o ponto de impacto.',
    },
    'trunk-burglary': {
      headline: 'Porta-malas e Arrombamento',
      summary: 'Segurança e armazenamento baseado em peso.',
      description:
        'Sistema de segurança veicular que permite travar e destravar o armazenamento para carga ilegal. Inclui mecânicas de arrombamento: os vidros podem ser quebrados e as trancas do porta-malas destruídas.',
    },
    'open-world-economy': {
      headline: 'Economia de Mundo Aberto',
      summary: 'Sistema de vários empregos e troca entre jogadores.',
      description:
        'Sistema de empregos completo com mineração, corte de madeira e agricultura. Possui dinheiro físico que pode ser largado e um sistema único de equipamento dinâmico para lamparinas, no estilo RDR2.',
    },
    'industrial-iot-dashboard': {
      headline: 'Dashboard Industrial IoT',
      summary: 'Análise de dados fullstack e integração com hardware.',
      description:
        'Plataforma complexa de análise de dados desenvolvida como projeto final do curso técnico. Possui um dashboard de alta fidelidade para monitoramento industrial. Atualmente implemento a integração hardware-nuvem com C e ESP32 para coleta de dados IoT em tempo real.',
    },
    'personal-portfolio': {
      headline: 'Portfólio Dev Moderno',
      summary: 'O próprio site que você está vendo agora.',
      description:
        'Portfólio full-stack reconstruído com Next.js e TypeScript. Possui um fundo WebGL em todo o site, rolagem suave com inércia, animações GSAP guiadas pelo scroll, transições de rota e uma camada de conteúdo tipada.',
    },
    'facial-expressions': {
      headline: 'Sistema de Expressões Faciais',
      summary: 'Randomiza a boca e os olhos do jogador.',
      description:
        'Cada jogador tem um rosto aleatório. Os olhos e a boca mudam ao acaso a cada poucos segundos, e cada expressão é atualizada em momentos completamente imprevisíveis.',
    },
    'caribbean-islands': {
      headline: 'Ilhas do Caribe: Level Design',
      summary: 'Ambiente atmosférico e level design.',
      description:
        "Um amplo estudo de ambiente inspirado na era de ouro da pirataria e em Assassin's Creed IV: Black Flag. O projeto foca em geração realista de terreno, distribuição de vegetação tropical e configurações de iluminação de alta fidelidade, usando técnicas avançadas de heightmap e pintura de texturas personalizada para alcançar uma autêntica atmosfera caribenha.",
    },
    'southern-highlands': {
      headline: 'Serras do Sul: Ambiente Realista',
      summary: 'Ambiente regional e estudo de materiais.',
      description:
        'Um estudo de ambiente focado na topografia única do Sul do Brasil (Serra Gaúcha). Explora a integração de serras subtropicais com efeitos atmosféricos de clima frio. Entre os destaques técnicos: escultura de heightmap personalizada, orquestração avançada da densidade de neblina para criar profundidade e transições procedurais de material entre rocha e grama. Pensado para biomas naturais e dispersão realista da luz do sol.',
    },
    'caribbean-city-1715': {
      headline: 'Cidade Caribenha: Historicamente Precisa',
      summary: 'Ambiente urbano histórico.',
      description:
        'Uma reconstrução histórica de uma cidade portuária caribenha por volta de 1715, com ênfase na precisão da arquitetura colonial e no traçado urbano. O projeto contrapõe vilas densas a ambientes costeiros exuberantes, usando kits modulares de construção e iluminação baked personalizada para capturar a atmosfera sufocante e salgada das Índias Ocidentais.',
    },
    'northeastern-badlands': {
      headline: 'Nordeste do Brasil: Bioma Semiárido',
      summary: 'Estudo de terreno e vegetação semiárida.',
      description:
        'Um estudo de ambiente baseado nas paisagens únicas do Sertão brasileiro. O projeto foca na topografia árida e na distribuição da vegetação nativa característica do Nordeste. O terreno foi esculpido inteiramente do zero, usando o BrushTool para a modelagem orgânica e o MeshVox para a otimização do ambiente em alta fidelidade.',
    },
    'squid-game-replica': {
      headline: 'Round 6: Réplica Técnica',
      summary: 'Geometria arquitetônica e design de precisão.',
      description:
        'Uma recriação de alta precisão dos ambientes icônicos da série Squid Game. O projeto enfatiza escala arquitetônica, paletas de cores vibrantes e formas geométricas limpas para replicar a atmosfera surreal da série. O mapa conta com assets modulares feitos sob medida, iluminação realista de aspecto natural e level design em larga escala.',
    },
    'undstread-local': {
      headline: 'Undstread Local: Estudo Avançado de Biomas',
      summary: 'Ambiente cinematográfico e estudo de biomas.',
      description:
        'Um projeto de ambiente que explora o contraste entre densos pinheirais e litorais rochosos. Mostra formações rochosas esculpidas à mão e uma pintura de terreno detalhada, com forte foco em profundidade atmosférica por meio de neblina em camadas e dispersão realista dos raios de sol (god rays) para criar uma experiência imersiva e cinematográfica.',
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
