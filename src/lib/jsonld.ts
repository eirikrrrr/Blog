/**
 * Datos estructurados schema.org.
 *
 * El objetivo es que Google entienda que el sitio describe a una *persona*
 * concreta —una entidad— y no un texto suelto. Se emite un @graph con nodos
 * enlazados por @id para que las relaciones sean explícitas.
 */
import { perfil } from '@/data/perfil';
import { experiencia } from '@/data/experiencia';
import { proyectos } from '@/data/proyectos';

const PERSONA_ID = `${perfil.sitio}/#persona`;
const SITIO_ID = `${perfil.sitio}/#sitio`;

const persona = {
  '@type': 'Person',
  '@id': PERSONA_ID,
  name: perfil.nombre,
  alternateName: 'eirikrrrr',
  url: `${perfil.sitio}/`,
  image: `${perfil.sitio}/profile-picture.jpg`,
  jobTitle: perfil.rol,
  description: perfil.claim,
  email: `mailto:${perfil.email}`,
  knowsAbout: [...perfil.temas],
  knowsLanguage: perfil.idiomas.map((i) => ({ '@type': 'Language', name: i.idioma })),
  nationality: { '@type': 'Country', name: 'Venezuela' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: perfil.ubicacionCorta,
    addressRegion: 'Comunidad Valenciana',
    addressCountry: perfil.pais,
  },
  // `sameAs` recíproco con LinkedIn y GitHub: la señal de entidad más fuerte
  // que se puede construir sin backlinks externos.
  sameAs: [perfil.linkedin, perfil.github],
  hasOccupation: {
    '@type': 'Occupation',
    name: perfil.rol,
    occupationalCategory: '15-1244.00', // O*NET: Network and Computer Systems Administrators
    skills: perfil.temas.join(', '),
  },
  worksFor: experiencia
    .filter((p) => p.hasta === null)
    .map((p) => ({ '@type': 'Organization', name: p.empresa })),
};

const sitio = {
  '@type': 'WebSite',
  '@id': SITIO_ID,
  url: `${perfil.sitio}/`,
  name: `${perfil.nombre} — ${perfil.rol}`,
  description: perfil.descripcion,
  inLanguage: 'es-ES',
  publisher: { '@id': PERSONA_ID },
};

/** Home: ProfilePage + Person + WebSite. */
export function jsonLdInicio() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      persona,
      sitio,
      {
        '@type': 'ProfilePage',
        '@id': `${perfil.sitio}/#profilepage`,
        url: `${perfil.sitio}/`,
        name: `${perfil.nombre} — ${perfil.rol}`,
        description: perfil.descripcion,
        inLanguage: 'es-ES',
        isPartOf: { '@id': SITIO_ID },
        about: { '@id': PERSONA_ID },
        mainEntity: { '@id': PERSONA_ID },
        hasPart: proyectos.map((p) => ({
          '@type': 'CreativeWork',
          name: p.titulo,
          url: `${perfil.sitio}/proyectos/${p.slug}`,
        })),
      },
    ],
  };
}

/** Página de proyecto: CreativeWork atribuido a la persona + migas. */
export function jsonLdProyecto(proyecto: (typeof proyectos)[number]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      persona,
      {
        '@type': 'CreativeWork',
        '@id': `${perfil.sitio}/proyectos/${proyecto.slug}#obra`,
        name: proyecto.titulo,
        headline: proyecto.titulo,
        description: proyecto.descripcion,
        url: `${perfil.sitio}/proyectos/${proyecto.slug}`,
        inLanguage: 'es-ES',
        author: { '@id': PERSONA_ID },
        creator: { '@id': PERSONA_ID },
        keywords: proyecto.tecnologias.join(', '),
        isPartOf: { '@id': SITIO_ID },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${perfil.sitio}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Proyectos',
            item: `${perfil.sitio}/#proyectos`,
          },
          { '@type': 'ListItem', position: 3, name: proyecto.tituloCorto },
        ],
      },
    ],
  };
}

/** CV. */
export function jsonLdCv() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      persona,
      {
        '@type': 'WebPage',
        '@id': `${perfil.sitio}/cv#pagina`,
        url: `${perfil.sitio}/cv`,
        name: `Currículum de ${perfil.nombre}`,
        description: `Currículum de ${perfil.nombre}, ${perfil.rol}. Experiencia, proyectos y stack técnico.`,
        inLanguage: 'es-ES',
        isPartOf: { '@id': SITIO_ID },
        about: { '@id': PERSONA_ID },
      },
    ],
  };
}
