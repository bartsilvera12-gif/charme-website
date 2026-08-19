-- ============================================================
-- CHARME CMS · Seed 0002 · Contenido (home, nosotros, config, etc.)
-- Idempotente donde es posible (singletons por 'singleton'/'section';
-- listas sólo se insertan si la tabla está vacía).
-- ============================================================

-- ------------------------------------------------------------
-- Configuración general
-- ------------------------------------------------------------
insert into charme.site_settings
  (singleton, site_name, logo_url, favicon_url, whatsapp, phone, email, address,
   copyright, neura_url, payment_terms)
values
  (true, 'Academia CHARME', '/images/logo.png', '/favicon.ico',
   '595986373130', '+595 (986) 373 130', 'academiacharmeparaguay@gmail.com',
   'Avda. Gaspar Rodríguez de Francia c/ Defensores del Chaco — San Lorenzo',
   '© Academia CHARME. Todos los derechos reservados.', 'https://neura.com.py',
   'Precios expresados para pagos en efectivo. Débito: recargo del 5%. Crédito: recargo del 10%.')
on conflict (singleton) do update set
  site_name = excluded.site_name, logo_url = excluded.logo_url, favicon_url = excluded.favicon_url,
  whatsapp = excluded.whatsapp, phone = excluded.phone, email = excluded.email,
  address = excluded.address, copyright = excluded.copyright, neura_url = excluded.neura_url,
  payment_terms = excluded.payment_terms;

-- ------------------------------------------------------------
-- Contacto (fuente canónica)
-- ------------------------------------------------------------
insert into charme.contact_settings
  (singleton, phone, whatsapp, email, address, hours, maps_url, map_embed_url)
values
  (true, '+595 (986) 373 130', '595986373130', 'academiacharmeparaguay@gmail.com',
   'Avda. Gaspar Rodríguez de Francia c/ Defensores del Chaco — San Lorenzo',
   'Lunes a viernes, 08:00 a 18:00 hs',
   'https://www.google.com.py/maps/place/CHARME+SAN+LORENZO/@-25.3417691,-57.5077899,17z',
   'https://www.google.com/maps?q=CHARME+SAN+LORENZO,-25.3417691,-57.5077899&z=16&output=embed')
on conflict (singleton) do update set
  phone = excluded.phone, whatsapp = excluded.whatsapp, email = excluded.email,
  address = excluded.address, hours = excluded.hours, maps_url = excluded.maps_url,
  map_embed_url = excluded.map_embed_url;

-- ------------------------------------------------------------
-- Home por secciones
-- ------------------------------------------------------------
insert into charme.home_content (section, eyebrow, title, subtitle, body, cta_label, cta_url, image_url, extra, sort_order)
values
  ('hero', 'Academia digital CHARME', 'Aprendé de quienes viven la belleza.',
   'Formación profesional, ahora desde cualquier lugar.', null,
   'Explorar formaciones', '#formaciones', '/images/hero.avif',
   '{"badge_left":"Est. Paraguay","badge_right":"+30 años de excelencia","image_secondary":"/images/editorial.webp"}'::jsonb, 0),
  ('academia', 'Nuestra forma de enseñar', 'Experiencia que se enseña.', null,
   'En Academia CHARME transformamos años de experiencia en formación real y aplicable. Enseñamos con excelencia para que desarrolles tu talento, eleves tu técnica y construyas tu propio camino en la belleza.',
   'Conocer la academia', '#profesionales', '/images/galeria/galeria-26.webp', '{}'::jsonb, 1),
  ('formaciones', 'Formaciones CHARME', 'Perfeccioná tu técnica.', null,
   'Elegí la formación que acompaña tu próximo nivel profesional.', null, null, null,
   '{"initial_count":4,"payment_terms":"Precios expresados para pagos en efectivo. Débito: recargo del 5%. Crédito: recargo del 10%."}'::jsonb, 2),
  ('masterclass', 'CHARME Masterclass', 'Llevá tu técnica al próximo nivel.', null, null,
   'Descubrir masterclass', '#formaciones', '/images/masterclass.webp', '{}'::jsonb, 3),
  ('online', 'Experiencia online', 'Tu formación continúa donde estés.', null,
   'Una experiencia online diseñada para acompañarte en cada paso. Accedé a tus cursos, seguí tu progreso y organizá tu aprendizaje con todo en un solo lugar.',
   'Conocer el área del alumno', null, '/images/experiencia-online.png', '{}'::jsonb, 4),
  ('final_cta', 'Academia CHARME', 'Tu próximo nivel empieza acá.', null, null,
   'Explorar formaciones', '#formaciones', '/images/final-cta.webp', '{}'::jsonb, 5)
on conflict (section) do update set
  eyebrow = excluded.eyebrow, title = excluded.title, subtitle = excluded.subtitle,
  body = excluded.body, cta_label = excluded.cta_label, cta_url = excluded.cta_url,
  image_url = excluded.image_url, extra = excluded.extra, sort_order = excluded.sort_order;

-- ------------------------------------------------------------
-- Nosotros
-- ------------------------------------------------------------
insert into charme.about_content
  (singleton, title, main_description, image_url, vision, mission, quote, quote_author)
values
  (true, 'Nosotros',
   'Nacida del fruto de más de 30 años de experiencia de su Directora, la Sra. Mirta Mena. Academia CHARME es una institución creada para brindar una educación de calidad y excelencia a las personas que deseen comenzar a capacitarse como profesional en el ámbito de la Belleza Integral. En alianza con la Academia número 1 del mundo en color, la HSB, impartimos clases con profesionales de primer nivel.',
   '/images/nosotros-hero.webp',
   'Ser la institución líder a nivel nacional de alto adiestramiento profesional por la formación completa de sus profesionales en todas las áreas de la belleza y estética integral.',
   'Proveer al estudiante de Academia CHARME la experiencia más completa, moderna y de excelencia en el aprendizaje, usando metodologías innovadoras a nivel mundial con educadores altamente preparados, fomentando la cultura del estudio constante.',
   'La meta de la educación es el avance en el conocimiento y en la diseminación de la verdad.',
   '— Dir. Gral. Mirta Mena')
on conflict (singleton) do update set
  title = excluded.title, main_description = excluded.main_description, image_url = excluded.image_url,
  vision = excluded.vision, mission = excluded.mission, quote = excluded.quote, quote_author = excluded.quote_author;

insert into charme.about_values (label, sort_order)
select v.label, v.ord from (values
  ('Excelencia', 0), ('Compromiso', 1), ('Integridad', 2), ('Fe y Salvación', 3),
  ('Perseverancia', 4), ('Sacrificio', 5), ('Pasión', 6)
) as v(label, ord)
where not exists (select 1 from charme.about_values);

-- ------------------------------------------------------------
-- Profesionales (Mirta Mena)
-- ------------------------------------------------------------
insert into charme.professionals (name, role_title, eyebrow, short_description, image_url, is_featured, sort_order)
select 'Mirta Mena', 'Master artist', 'Master artist',
  'Una propuesta de formación nacida del oficio, la práctica y la búsqueda constante de excelencia.',
  '/images/mirta.webp', true, 0
where not exists (select 1 from charme.professionals);

-- ------------------------------------------------------------
-- Testimonios
-- ------------------------------------------------------------
insert into charme.testimonials (name, username, body, avatar_url, country, sort_order)
select t.name, t.username, t.body, t.avatar_url, t.country, t.ord from (values
  ('Ana Giménez', '@ana.g', 'Los cursos me cambiaron la forma de trabajar. Práctica pura y bien explicada.', 'https://randomuser.me/api/portraits/women/32.jpg', '🇵🇾 Paraguay', 0),
  ('Sofía Ramírez', '@sofir', 'Aprendí colorimetría desde cero y hoy vivo de esto. Gracias CHARME.', 'https://randomuser.me/api/portraits/women/68.jpg', '🇦🇷 Argentina', 1),
  ('Mateo Rojas', '@mateor', 'Las clases online son claras, con material que se puede ver una y otra vez.', 'https://randomuser.me/api/portraits/men/51.jpg', '🇺🇾 Uruguay', 2),
  ('María Duarte', '@mari', 'Me encantó la forma de enseñar. Muy profesional y humano a la vez.', 'https://randomuser.me/api/portraits/women/53.jpg', '🇵🇾 Paraguay', 3),
  ('Nicolás Vera', '@nicov', 'El master de colorimetría es lo mejor que hice en mi carrera.', 'https://randomuser.me/api/portraits/men/33.jpg', '🇨🇱 Chile', 4),
  ('Lucas Benítez', '@lucasb', 'Muy práctico y aplicable desde el primer día. 100% recomendado.', 'https://randomuser.me/api/portraits/men/22.jpg', '🇧🇴 Bolivia', 5),
  ('Camila Torres', '@camit', 'El área del alumno es cómoda y muy fácil de usar.', 'https://randomuser.me/api/portraits/women/85.jpg', '🇵🇾 Paraguay', 6),
  ('Emma López', '@emma', 'Contenido de altísima calidad. Se nota la experiencia detrás.', 'https://randomuser.me/api/portraits/women/45.jpg', '🇵🇪 Perú', 7),
  ('Carlos Ríos', '@carlos', 'Los tips de Mirta valen oro. Ya se ve el cambio en mi trabajo.', 'https://randomuser.me/api/portraits/men/61.jpg', '🇪🇸 España', 8)
) as t(name, username, body, avatar_url, country, ord)
where not exists (select 1 from charme.testimonials);

-- ------------------------------------------------------------
-- Preguntas frecuentes
-- ------------------------------------------------------------
insert into charme.faqs (question, answer, sort_order)
select f.q, f.a, f.ord from (values
  ('¿Cómo accedo a los cursos?', 'Después de inscribirte, ingresás al área del alumno con tu correo y contraseña para acceder a tus formaciones.', 0),
  ('¿Los cursos tienen certificado?', 'La disponibilidad y las condiciones del certificado se indican en la ficha de cada formación antes de inscribirte.', 1),
  ('¿Puedo estudiar desde mi celular?', 'Sí. La plataforma está preparada para computadora, tablet y celular.', 2),
  ('¿Por cuánto tiempo tengo acceso?', 'El tiempo de acceso puede variar según la formación. Vas a encontrar ese dato dentro del detalle de cada curso.', 3)
) as f(q, a, ord)
where not exists (select 1 from charme.faqs);

-- ------------------------------------------------------------
-- Galería (48 imágenes + 6 videos existentes en /public)
-- Migración inicial referenciando los archivos actuales.
-- ------------------------------------------------------------
insert into charme.gallery_items (type, media_url, alt_text, sort_order)
select 'video',
       '/videos/galeria/galeria-v' || lpad(g::text, 2, '0') || '.mp4',
       'Video de Academia CHARME ' || g, g
from generate_series(1, 6) as g
where not exists (select 1 from charme.gallery_items);

insert into charme.gallery_items (type, media_url, alt_text, sort_order)
select 'image',
       '/images/galeria/galeria-' || lpad(g::text, 2, '0') || '.webp',
       'Trabajo profesional de Academia CHARME ' || g, 100 + g
from generate_series(1, 48) as g
where not exists (select 1 from charme.gallery_items where type = 'image');
