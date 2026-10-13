import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { View as NativeView, Text as NativeText, Image as NativeImage, Pressable as NativePressable, ScrollView as NativeScrollView } from 'react-native';
import './styles.css';

function withWebClassName(Component) {
  return React.forwardRef(function WebClassComponent({ className, ...props }, forwardedRef) {
    const elementRef = useRef(null);
    React.useImperativeHandle(forwardedRef, () => elementRef.current);

    useLayoutEffect(() => {
      const element = elementRef.current;
      const classNames = className?.trim().split(/\s+/).filter(Boolean) ?? [];
      if (!element || classNames.length === 0) return undefined;

      element.classList.add(...classNames);
      return () => element.classList.remove(...classNames);
    }, [className]);

    return <Component {...props} ref={elementRef} />;
  });
}

const View = withWebClassName(NativeView);
const Text = withWebClassName(NativeText);
const StyledImage = withWebClassName(NativeImage);
const Pressable = withWebClassName(NativePressable);
const ScrollView = withWebClassName(NativeScrollView);

function Image(props) {
  const imageRef = useRef(null);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const imageUri = typeof props.source === 'string' ? props.source : props.source?.uri;
  const imageLabel = props.accessibilityLabel || 'Imagen del portafolio';

  useEffect(() => {
    const image = imageRef.current;
    if (!image || !imageUri) return undefined;

    const previousCursor = image.style.cursor;

    image.style.cursor = 'zoom-in';
    image.setAttribute('role', 'button');
    image.setAttribute('tabindex', '0');
    image.setAttribute('data-zoomable-image', 'true');
    image.setAttribute('aria-label', `Ampliar: ${imageLabel}`);
    return () => {
      image.style.cursor = previousCursor;
      image.removeAttribute('role');
      image.removeAttribute('tabindex');
      image.removeAttribute('data-zoomable-image');
      image.removeAttribute('aria-label');
    };
  }, [imageLabel, imageUri]);

  const openImage = event => {
    // Handle this in React so the image click is intercepted before a parent
    // project or publication link can navigate away.
    event.preventDefault();
    event.stopPropagation();
    setIsEnlarged(true);
  };

  const openImageFromKeyboard = event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    setIsEnlarged(true);
  };

  useEffect(() => {
    if (!isEnlarged) return undefined;
    const closeOnEscape = event => { if (event.key === 'Escape') setIsEnlarged(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isEnlarged]);

  return <>
    <StyledImage {...props} ref={imageRef} onClick={openImage} onKeyDown={openImageFromKeyboard}/>
    {isEnlarged && createPortal(<div className="image-lightbox" role="dialog" aria-modal="true" aria-label={imageLabel} onClick={event => { if (event.target === event.currentTarget) setIsEnlarged(false); }}>
      <button className="image-lightbox-close" type="button" aria-label="Cerrar imagen ampliada" onClick={event => { event.stopPropagation(); setIsEnlarged(false); }}>×</button>
      <img className="image-lightbox-image" src={imageUri} alt={imageLabel} onClick={event => event.stopPropagation()}/>
      <span className="image-lightbox-hint">Haz clic fuera de la imagen o presiona Esc para cerrar</span>
    </div>, document.body)}
  </>;
}

const photos = {
  portrait: '/Profile.png',
  cover: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1500&q=85',
  plaza: '/RutaClasica.jpeg',
  hospital: '/CentrodeArtes1.jpeg',
  street: '/esquemaSeccionesbrother.jpeg',
  aerial: '/Zonificacion.jpeg',
  sectionDiagram: '/esquemaSecciones.jpeg',
  logo:'/Logo.jpeg'
};

const projects = [
  {
    href: '/proyectos/ruta-clasica',
    image: photos.plaza,
    title: 'Ruta Clásica | Proyecto académico de hospedaje y glamping',
    tags: ['Diseño urbano', 'Turismo', 'Sustentabilidad'],
    description: 'Proyecto de hospedaje experiencial en Tecate, Baja California, que combina la identidad de la región con la arquitectura y la historia automotriz de las décadas de 1950 y 1960. La propuesta integra cabañas y unidades de glamping en un entorno semidesértico, utilizando carrocerías de automóviles clásicos recuperadas como elementos arquitectónicos distintivos, junto con materiales como concreto, acero corten, madera y piedra local.',
    skills: 'Diseño arquitectónico, Análisis del sitio, Sustentabilidad, Diseño de experiencias.',
    category: 'Diseño arquitectónico · Hotel boutique · Glamping · Experiencia',
    location: 'Tijuana, Baja California',
  },
  {
    href: '/proyectos/prisma',
    image: photos.hospital,
    title: 'Centro de Artes Prisma | Proyecto académico de equipamiento cultural',
    tags: ['Centro de artes', 'Comunidad', 'Cultura'],
    description: 'Propuesta arquitectónica de un centro de artes orientado a promover la expresión artística, el aprendizaje y la convivencia comunitaria. El proyecto busca integrar espacios flexibles para talleres, exposiciones y actividades culturales, mediante una distribución funcional que favorezca la accesibilidad, la interacción entre los usuarios y la relación del edificio con su entorno.',
    skills: 'Diseño arquitectónico, Distribución espacial, Diseño de espacios públicos y Desarrollo de propuestas conceptuales.',
    category: 'Diseño arquitectónico · Cultura · Espacio público',
    location: 'Tijuana, Baja California',
  },
];

function Icon({ name, size = 20 }) {
  const paths = {
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.1M12 17v-7m0 3a3 3 0 0 1 6 0v4"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    folder: <><path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M3 9h18"/></>,
    document: <><path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M14 2v6h6M8 13h8m-8 4h8"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
    chat: <><path d="M21 11.5a8.5 8.5 0 0 1-12.8 7.3L3 20l1.2-4.5A8.5 8.5 0 1 1 21 11.5Z"/></>,
    like: <path d="M7 10v11H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Zm0 0 5-8a3 3 0 0 1 2 3l-1 5h6a3 3 0 0 1 3 4l-2 7H7"/>,
    repost: <><path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></>,
    cap: <><path d="m2 10 10-6 10 6-10 6Z"/><path d="M6 12v5c3 3 9 3 12 0v-5m4-2v7"/></>,
    bulb: <><path d="M9 18h6m-5 4h4m-2-20a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2Z"/></>,
    chart: <><path d="M4 20V9m5 11V4m5 16v-7m5 7V2"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18m0-18a15 15 0 0 0 0 18"/></>,
    instagram:<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="18" cy="6" r="1" fill="currentColor" /></>,
    dartboard:<><circle cx="10" cy="14" r="8"/><circle cx="10" cy="14" r="5"/><circle cx="10" cy="14" r="2"/><path d="m22 2-12 12m8-12 5-1-1 5-4-2m1-1 3 3"/></>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function ActionButton({ icon, children, onPress, primary = false }) {
  return <Pressable accessibilityRole="button" onPress={onPress} className={`action-button ${primary ? 'primary' : ''}`}><Icon name={icon} size={17}/><Text className="action-label">{children}</Text></Pressable>;
}

function PortfolioPage() {
  const [counts, setCounts] = useState({ likes: 24, reposts: 8, comments: 3 });
  const [liked, setLiked] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => { fetch('/api/interactions').then(r => r.ok ? r.json() : null).then(data => data && setCounts(data)).catch(() => {}); }, []);
  async function updateCount(kind, amount = 1) {
    setCounts(current => ({ ...current, [kind]: Math.max(0, current[kind] + amount) }));
    try { const response = await fetch(`/api/interactions/${kind}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount }) }); if (response.ok) { const data = await response.json(); setCounts(current => ({ ...current, [kind]: data.count })); } } catch { /* The interface remains usable if the API is offline. */ }
  }
  function toggleLike() { const next = !liked; setLiked(next); updateCount('likes', next ? 1 : -1); }
  function submitComment() { const text = comment.trim(); if (!text) return; setComments(current => [text, ...current]); setComment(''); updateCount('comments'); }
  function message() { window.location.href = 'mailto:arq.nubeg@gmail.com?subject=Hola%20Nube'; }

  return <ScrollView className="page-scroll"><View className="layout">
    <View className="left-column">
      <View className="card profile-card">
        <View className="profile-wash"/><Image source={{ uri: photos.portrait }} className="portrait" accessibilityLabel="Retrato de Nube García"/>
        <Text className="name">Nube García</Text><Text className="headline">Estudiante de Arquitectura | Diseño arquitectónico y urbano | Rehabilitación urbana y arquitectura sostenible</Text>
        <View className="location-row"><Icon name="pin" size={17}/><Text className="muted">Tijuana, Baja California, México</Text></View>
        <View className="profile-actions"><ActionButton icon="user" primary onPress={() => setConnected(v => !v)}>{connected ? 'Conectada' : 'Conectar'}</ActionButton><ActionButton icon="send" onPress={message}>Mensaje</ActionButton><Pressable className="more-button" onPress={() => setShowContact(v => !v)}><Text className="more-text">{showContact ? 'Ocultar' : 'Más'}</Text></Pressable></View>
        {showContact && <View className="more-panel"><Text className="muted">Disponible para colaborar en proyectos de arquitectura y urbanismo.</Text><a href="mailto:arq.nubeg@gmail.com">Enviar correo</a></View>}
      </View>
      <View className="card details-card"><Text className="section-title small-title">Contacto</Text><a className="detail-row" href="mailto:arq.nubeg@gmail.com"><Icon name="mail" size={18}/><Text>arq.nubeg@gmail.com</Text></a><a className="detail-row" href="https://instagram.com/bespin.estudio/" target="_blank" rel="noreferrer"><Icon name="instagram" size={18}/><Text>@bespin.estudio</Text></a><View className="detail-row"><Icon name="pin" size={18}/><Text>Tijuana, B.C., México</Text></View></View>
      <View className="card skills-card"><Text className="section-title small-title">Habilidades</Text><View className="chips">{['AutoCAD','Rhino','Illustrator','Revit (en aprendizaje)','Diseño arquitectónico','Análisis urbano','Sustentabilidad','Trabajo en equipo','Proactividad','Adaptabilidad','SketchUp','Adobe Photoshop','Maquetas','Modelado 3D'].map(skill => <Text className="chip" key={skill}>{skill}</Text>)}</View><View className="signature"><Image source={{ uri: photos.logo }} className="signature-logo" accessibilityLabel="Logotipo de arquitectura con edificio entre nubes"/></View></View>
    </View>

    <View className="center-column">
      <View className="card hero-card"><Image source={{ uri: photos.cover }} className="cover-image" accessibilityLabel="Arquitectura contemporánea en concreto"/><View className="hero-body"><View className="hero-copy"><Text className="hero-name">Nube García</Text><Text className="hero-headline">Estudiante de Arquitectura | Diseño arquitectónico y urbano | Rehabilitación urbana y arquitectura sostenible</Text><View className="hero-meta"><Text>Tijuana, Baja California, México</Text><Text className="meta-dot">·</Text><Pressable onPress={() => setShowContact(true)}><Text className="contact-link">Contacto</Text></Pressable></View></View><View className="education"><Icon name="cap" size={22}/><View><Text>10.º cuatrimestre</Text><Text className="education-sub">Facultad de Arquitectura</Text></View></View></View></View>
      <View className="card about-card"><Text className="section-title"><Icon name="user" size={23}/> Acerca de mí</Text><Text className="body-copy">Soy estudiante de Arquitectura y me interesa el diseño de espacios funcionales, la rehabilitación urbana y la arquitectura sostenible. Durante mi formación he desarrollado proyectos que me han permitido analizar el entorno, proponer soluciones y trabajar en la distribución de espacios que respondan a las necesidades de las personas.</Text><Text className="body-copy">Me considero una persona adaptable, proactiva y con disposición para aprender. Disfruto investigar cómo funcionan los espacios y los sistemas que los conforman para identificar oportunidades de mejora y desarrollar propuestas más eficientes.</Text><Text className="body-copy last-copy">Busco seguir desarrollando mis habilidades en el área de proyectos arquitectónicos, colaborando en equipos de trabajo donde pueda aportar mis conocimientos y participar en el diseño de espacios que mejoren la calidad de vida de sus usuarios.</Text></View>
      <View className="card projects-card"><Text className="section-title"><Icon name="folder" size={24}/> Proyectos</Text>
        {projects.map(project => <Project key={project.href} {...project}/>) }
        <View className="purpose"><Icon name="dartboard" size={30}/><View><Text className="purpose-title">Propuesta de valor</Text><Text className="purpose-copy">Transformar espacios y entornos en lugares mas funcionales,inclusivos y sostenibles mediante el diseño arquitectónico y urbano.</Text></View></View>
      </View>
    </View>

    <View className="right-column"><View className="card featured-card"><a className="featured-heading-link" href="/publicaciones/redensificacion-la-mesa"><Text className="section-title featured-heading"><Icon name="document" size={21}/> Publicación destacada</Text></a><View className="post">
      <a className="post-detail-link" href="/publicaciones/redensificacion-la-mesa" aria-label="Abrir publicación: Redensificación urbana y usos mixtos">
      <View className="post-author"><Image source={{ uri: photos.portrait }} className="author-avatar"/><View className="author-info"><Text className="author-name">Nube García</Text><Text className="author-sub">Estudiante de Arquitectura</Text><Text className="author-sub">Ahora · <Icon name="globe" size={12}/></Text></View><View accessibilityLabel="Más opciones" className="post-more"><Icon name="more" size={19}/></View></View>
      <Text className="post-title">Redensificación urbana y usos mixtos: una propuesta para La Mesa, Tijuana</Text><Text className="post-intro">El sector de La Mesa, Tijuana, presenta oportunidades para mejorar la integración entre los espacios construidos, las áreas abiertas y las actividades cotidianas de trabajadores y visitantes.</Text>
      <PostPoint icon="bulb" title="Problema urbano/espacial">La zona muestra una distribución de usos poco integrada, con espacios de convivencia limitados y recorridos peatonales poco seguros o continuos, lo que dificulta la accesibilidad a servicios y la interacción entre las personas.</PostPoint>
      <PostPoint icon="bulb" title="Solución en proyecto">Se propone una intervención de usos mixtos que integra servicios, espacios de convivencia y áreas peatonales. La propuesta busca aprovechar mejor el suelo urbano y favorecer la relación entre las actividades de la zona, facilitando la rutina de sus usuarios.</PostPoint>
      <PostPoint icon="chart" title="Resultado técnico">El proyecto se desarrolla a partir de un análisis de ocupación del suelo, con una proporción aproximada de 60% de superficie construida y 40% de superficie abierta. Esta información sirve como base para la zonificación y la organización de los espacios.</PostPoint>
      <View className="visual-grid"><Text className="legend-title">Zonificación propuesta</Text><Image source={{ uri: photos.aerial }} className="map-image" accessibilityLabel="Vista aérea de la zona urbana"/></View>
      <View className="section-scheme"><View className="section-diagram-card"><Text className="section-scheme-title">Esquema de secciones</Text><Image source={{ uri: photos.sectionDiagram }} className="section-diagram-image" accessibilityLabel="Dibujo esquemático de una sección urbana"/></View><Image source={{ uri: photos.street }} className="section-render-image" accessibilityLabel="Perspectiva arquitectónica del espacio público"/></View>
      <View className="state-label">Estado actual (aprox.)</View><View className="state-row"><View className="progress-box"><View className="progress-bar"><View className="built"><Text>60% construido</Text></View></View><View className="open-bar"><Text>40% abierto</Text></View></View><Image source={{ uri: photos.logo }} className="state-logo-image" accessibilityLabel="Logotipo de arquitectura con edificio entre nubes"/></View>
      </a>
      <View className="social-actions"><Pressable accessibilityRole="button" className={`social-button ${liked ? 'is-liked' : ''}`} onPress={toggleLike}><Icon name="like" size={17}/><Text>{liked ? 'Te gusta' : 'Like'}{counts.likes > 0 ? ` · ${counts.likes}` : ''}</Text></Pressable><Pressable accessibilityRole="button" className="social-button" onPress={() => setCommentOpen(v => !v)}><Icon name="chat" size={17}/><Text>Comment{counts.comments > 0 ? ` · ${counts.comments}` : ''}</Text></Pressable><Pressable accessibilityRole="button" className="social-button" onPress={() => updateCount('reposts')}><Icon name="repost" size={17}/><Text>Repost{counts.reposts > 0 ? ` · ${counts.reposts}` : ''}</Text></Pressable><Pressable accessibilityRole="button" className="social-button" onPress={() => { navigator.clipboard?.writeText(window.location.href); }}><Icon name="send" size={17}/><Text>Send</Text></Pressable></View>
      {commentOpen && <View className="comment-area"><View className="comment-compose"><Image source={{ uri: photos.portrait }} className="comment-avatar"/><input aria-label="Escribe un comentario" placeholder="Escribe un comentario…" value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') submitComment(); }}/><Pressable className="comment-submit" accessibilityRole="button" onPress={submitComment}><Icon name="send" size={16}/></Pressable></View>{comments.map((text,i)=><Text className="comment-entry" key={`${text}-${i}`}>{text}</Text>)}</View>}
    </View></View></View>
  </View></ScrollView>;
}

function Project({ href, image, title, tags, description, skills }) {
  return <Pressable accessibilityRole="link" accessibilityLabel={`Abrir proyecto: ${title}`} onPress={event => {
    const target = event?.nativeEvent?.target ?? event?.target;
    if (target?.closest?.('[data-zoomable-image="true"]')) return;
    window.location.assign(href);
  }} className="project project-clickable"><Image source={{ uri: image }} className="project-image" accessibilityLabel={title}/><View className="project-content"><Text className="project-title">{title}</Text><View className="project-tags">{tags.map(tag => <Text className="tag" key={tag}>{tag}</Text>)}</View><Text className="project-description">{description}</Text><Text className="project-skills"><Text className="skill-lead">Habilidades:</Text> {skills}</Text></View></Pressable>;
}

function PostPoint({ icon, title, children }) { return <View className="post-point"><View className="point-icon"><Icon name={icon} size={23}/></View><View><Text className="point-title">{title}</Text><Text className="point-copy">{children}</Text></View></View>; }

function DetailShell({ children }) {
  return <ScrollView className="page-scroll"><View className="detail-layout"><a className="back-link" href="/">← Volver al portafolio</a>{children}</View></ScrollView>;
}

function ProjectDetail({ project }) {
  return <DetailShell><View className="card project-detail-card">
    <Image source={{ uri: project.image }} className="detail-cover" accessibilityLabel={project.title}/>
    <View className="detail-content"><Text className="detail-kicker">PROYECTO DE ARQUITECTURA</Text><Text className="detail-title">{project.title}</Text>
      <View className="project-tags detail-tags">{project.tags.map(tag => <Text className="tag" key={tag}>{tag}</Text>)}</View>
      <View className="detail-meta"><View><Text className="meta-label">Ubicación</Text><Text className="meta-value">{project.location}</Text></View><View><Text className="meta-label">Enfoque</Text><Text className="meta-value">{project.category}</Text></View></View>
      <Text className="detail-section-title">Concepto</Text><Text className="detail-paragraph">{project.description}</Text>
      <Text className="detail-section-title">Habilidades aplicadas</Text><Text className="detail-paragraph">{project.skills}</Text>
      <View className="detail-gallery">{[project.image, photos.street].map((image, index) => <Image source={{ uri: image }} className="gallery-image" accessibilityLabel={`${project.title}, vista ${index + 1}`} key={`${image}-${index}`}/>)}</View>
      <View className="detail-note"><Text className="detail-note-title">Arquitectura con propósito</Text><Text className="detail-paragraph">Diseñar espacios que conecten a las personas con su entorno y mejoren su calidad de vida.</Text></View>
    </View>
  </View></DetailShell>;
}

function FeaturedPostDetail() {
  return <DetailShell><View className="card post-detail-page">
    <View className="post-author detail-author"><Image source={{ uri: photos.portrait }} className="author-avatar"/><View className="author-info"><Text className="author-name">Nube García</Text><Text className="author-sub">Estudiante de Arquitectura · Ahora</Text></View></View>
    <Text className="detail-title">Redensificación urbana y usos mixtos: una propuesta para La Mesa, Tijuana</Text>
    <Text className="detail-paragraph">El sector de La Mesa, Tijuana, presenta oportunidades para mejorar la integración entre los espacios construidos, las áreas abiertas y las actividades cotidianas de trabajadores y visitantes.</Text>
    <PostPoint icon="bulb" title="Problema urbano/espacial">La zona muestra una distribución de usos poco integrada, con espacios de convivencia limitados y recorridos peatonales poco seguros o continuos, lo que dificulta la accesibilidad a servicios y la interacción entre las personas.</PostPoint>
    <PostPoint icon="bulb" title="Solución en proyecto">Se propone una intervención de usos mixtos que integra servicios, espacios de convivencia y áreas peatonales. La propuesta busca aprovechar mejor el suelo urbano y favorecer la relación entre las actividades de la zona, facilitando la rutina de sus usuarios.</PostPoint>
    <PostPoint icon="chart" title="Resultado técnico">El proyecto se desarrolla a partir de un análisis de ocupación del suelo, con una proporción aproximada de 60% de superficie construida y 40% de superficie abierta. Esta información sirve como base para la zonificación y la organización de los espacios.</PostPoint>
    <View className="detail-gallery"><Image source={{ uri: photos.aerial }} className="gallery-image" accessibilityLabel="Plano de zonificación propuesta"/><Image source={{ uri: photos.street }} className="gallery-image" accessibilityLabel="Perspectiva de la propuesta urbana"/></View>
    <View className="section-scheme detail-section-scheme"><View className="section-diagram-card"><Text className="section-scheme-title">Esquema de secciones</Text><Image source={{ uri: photos.sectionDiagram }} className="section-diagram-image" accessibilityLabel="Dibujo esquemático de una sección urbana"/></View></View>
    <Text className="state-label">Estado actual (aprox.)</Text><View className="state-row"><View className="progress-box"><View className="progress-bar"><View className="built"><Text>60% construido</Text></View></View><View className="open-bar"><Text>40% abierto</Text></View></View></View>
  </View></DetailShell>;
}

function App() {
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  const project = projects.find(item => item.href === pathname);
  if (project) return <ProjectDetail project={project}/>;
  if (pathname === '/publicaciones/redensificacion-la-mesa') return <FeaturedPostDetail/>;
  return <PortfolioPage/>;
}

createRoot(document.getElementById('root')).render(<App/>);
