-- ============================================================
-- CHARME CMS · Seed 0001 · Categorías y formaciones (generado desde data.ts)
-- Idempotente: usa ON CONFLICT sobre slug. Re-ejecutable.
-- ============================================================

-- Categorías
insert into charme.course_categories (name, slug, sort_order)
  values ('Colorimetría', 'colorimetria', 0)
  on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;
insert into charme.course_categories (name, slug, sort_order)
  values ('Barbería', 'barberia', 1)
  on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;
insert into charme.course_categories (name, slug, sort_order)
  values ('Maquillaje', 'maquillaje', 2)
  on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;

-- Formaciones + contenidos relacionados

-- Colorimetría inicial
with cat as (select id from charme.course_categories where slug = 'colorimetria'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'colorimetria-inicial', 'Colorimetría inicial', 'Gs. 250.000', '/images/colorimetria-inicial.webp', cat.id, '4 semanas', '100% online', 'Inicial', 'Certificado digital al finalizar', 'El punto de partida ideal para entender el color con base técnica y profesional.', 'En Colorimetría inicial vas a construir la base técnica que todo profesional de la belleza necesita: entender qué pasa en el cabello cuando aplicamos color. Trabajamos desde los fundamentos — reflejos, subtonos, neutralización — hasta las primeras aplicaciones prácticas con protocolo profesional.', true, false, 0
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'colorimetria-inicial');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Fundamentos de teoría del color aplicada al cabello', 0 from charme.courses where slug = 'colorimetria-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Lectura de reflejos, subtonos y neutralización', 1 from charme.courses where slug = 'colorimetria-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Preparación segura de fórmulas y decoloración', 2 from charme.courses where slug = 'colorimetria-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Técnicas de aplicación limpia y precisa', 3 from charme.courses where slug = 'colorimetria-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Diagnóstico previo y protocolos de cuidado', 4 from charme.courses where slug = 'colorimetria-inicial';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'colorimetria-inicial');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Fundamentos del color', 'Círculo cromático, reflejos, subtonos y cómo se combinan en el cabello.', 0 from charme.courses where slug = 'colorimetria-inicial';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Diagnóstico del cabello', 'Cómo leer el cabello del cliente antes de tocar el color: porosidad, historial, altura de tono.', 1 from charme.courses where slug = 'colorimetria-inicial';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Preparación y fórmulas', 'Mezclas seguras, proporciones y elección del oxidante correcto.', 2 from charme.courses where slug = 'colorimetria-inicial';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Aplicación práctica', 'Técnicas limpias de aplicación paso a paso con protocolo profesional.', 3 from charme.courses where slug = 'colorimetria-inicial';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'colorimetria-inicial');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Ganas de aprender desde cero', 0 from charme.courses where slug = 'colorimetria-inicial';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Acceso a computadora o celular con internet', 1 from charme.courses where slug = 'colorimetria-inicial';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Kit básico de práctica (opcional para las clases guiadas)', 2 from charme.courses where slug = 'colorimetria-inicial';

-- Colorimetría técnico 1
with cat as (select id from charme.course_categories where slug = 'colorimetria'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'colorimetria-tecnico-1', 'Colorimetría técnico 1', 'Gs. 300.000', '/images/colorimetria-tecnico-1.webp', cat.id, '6 semanas', '100% online', 'Técnico', 'Certificado digital al finalizar', 'Segundo nivel para consolidar la técnica con casos reales y clientas exigentes.', 'Ya conocés la base — ahora vamos a la técnica que se vende. Trabajamos casos reales de coloración, corrección y elaboración de mechas con protocolo profesional. Ideal para quienes ya trabajan en salón y quieren subir el nivel.', true, false, 1
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'colorimetria-tecnico-1');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Corrección de color y neutralización avanzada', 0 from charme.courses where slug = 'colorimetria-tecnico-1';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Técnicas de mechas: babylights, balayage y clásicas', 1 from charme.courses where slug = 'colorimetria-tecnico-1';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Fórmulas para coberturas de canas', 2 from charme.courses where slug = 'colorimetria-tecnico-1';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Cronograma capilar y cuidado post-color', 3 from charme.courses where slug = 'colorimetria-tecnico-1';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Precificación y comunicación con la clienta', 4 from charme.courses where slug = 'colorimetria-tecnico-1';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'colorimetria-tecnico-1');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Corrección de color', 'Cómo diagnosticar y corregir errores comunes en coloraciones previas.', 0 from charme.courses where slug = 'colorimetria-tecnico-1';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Mechas modernas', 'Babylights, balayage y mechas clásicas con paso a paso.', 1 from charme.courses where slug = 'colorimetria-tecnico-1';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Cobertura de canas', 'Fórmulas de larga duración para diferentes tipos de cana.', 2 from charme.courses where slug = 'colorimetria-tecnico-1';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Cronograma capilar', 'Cómo cuidar el cabello después del proceso químico.', 3 from charme.courses where slug = 'colorimetria-tecnico-1';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 5 — Negocio y precios', 'Cómo cobrar tu trabajo y comunicar el valor de la técnica.', 4 from charme.courses where slug = 'colorimetria-tecnico-1';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'colorimetria-tecnico-1');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Haber completado Colorimetría inicial o tener conocimientos equivalentes', 0 from charme.courses where slug = 'colorimetria-tecnico-1';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Acceso a computadora o celular con internet', 1 from charme.courses where slug = 'colorimetria-tecnico-1';

-- Colorimetría técnico 2
with cat as (select id from charme.course_categories where slug = 'colorimetria'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'colorimetria-tecnico-2', 'Colorimetría técnico 2', 'Gs. 350.000', '/images/colorimetria-tecnico-2.webp', cat.id, '8 semanas', '100% online', 'Técnico avanzado', 'Certificado digital al finalizar', 'Especialización en color de alta complejidad y trabajo editorial.', 'Tercer nivel de colorimetría, orientado a especialización. Trabajamos rubios extremos, color creativo, editoriales y técnicas de alta complejidad. Para colorimetristas que quieren distinguirse en el mercado.', true, false, 2
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'colorimetria-tecnico-2');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Rubios extremos y decoloraciones controladas', 0 from charme.courses where slug = 'colorimetria-tecnico-2';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Color creativo: fantasía, colores directos y semi-permanentes', 1 from charme.courses where slug = 'colorimetria-tecnico-2';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Editorial y color para producciones', 2 from charme.courses where slug = 'colorimetria-tecnico-2';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Protocolos de reconstrucción capilar profesional', 3 from charme.courses where slug = 'colorimetria-tecnico-2';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Consultoría y diagnóstico para clientas complejas', 4 from charme.courses where slug = 'colorimetria-tecnico-2';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'colorimetria-tecnico-2');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Rubios de alta gama', 'Decoloración segura, matices platino, rubios cálidos y fríos.', 0 from charme.courses where slug = 'colorimetria-tecnico-2';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Color creativo', 'Aplicación de colores fantasía y directos sobre cabello aclarado.', 1 from charme.courses where slug = 'colorimetria-tecnico-2';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Reconstrucción', 'Protocolos profesionales para cabellos comprometidos.', 2 from charme.courses where slug = 'colorimetria-tecnico-2';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Editorial y foto', 'Cómo pensar el color para producciones y redes.', 3 from charme.courses where slug = 'colorimetria-tecnico-2';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 5 — Casos complejos', 'Diagnóstico y resolución de situaciones fuera del manual.', 4 from charme.courses where slug = 'colorimetria-tecnico-2';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'colorimetria-tecnico-2');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Haber completado Colorimetría técnico 1 o tener experiencia comprobable', 0 from charme.courses where slug = 'colorimetria-tecnico-2';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Kit profesional propio recomendado', 1 from charme.courses where slug = 'colorimetria-tecnico-2';

-- Técnico superior
with cat as (select id from charme.course_categories where slug = 'colorimetria'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'tecnico-superior', 'Técnico superior', 'Gs. 400.000', '/images/tecnico-superior.webp', cat.id, '12 semanas', 'Online + workshops presenciales', 'Avanzado', 'Certificado técnico superior', 'Formación integral para posicionarte como especialista de referencia.', 'Una formación integral que combina toda la ruta técnica, casos clínicos, negocio y marca personal. Para quien quiere ser referencia en su ciudad.', true, false, 3
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'tecnico-superior');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Ruta técnica completa: base + avanzada + editorial', 0 from charme.courses where slug = 'tecnico-superior';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Diagnóstico integral y resolución de casos complejos', 1 from charme.courses where slug = 'tecnico-superior';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Marca personal y comunicación profesional', 2 from charme.courses where slug = 'tecnico-superior';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Precificación estratégica y captación de clientas', 3 from charme.courses where slug = 'tecnico-superior';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Protocolos de excelencia y control de calidad', 4 from charme.courses where slug = 'tecnico-superior';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'tecnico-superior');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Consolidación técnica', 'Repaso y profundización de toda la ruta anterior.', 0 from charme.courses where slug = 'tecnico-superior';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Casos clínicos', 'Diagnóstico y tratamiento de casos reales complejos.', 1 from charme.courses where slug = 'tecnico-superior';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Marca personal', 'Cómo construir una marca profesional que atrae.', 2 from charme.courses where slug = 'tecnico-superior';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Negocio', 'Precios, agenda, retención y crecimiento sostenible.', 3 from charme.courses where slug = 'tecnico-superior';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 5 — Certificación', 'Trabajo final y evaluación integral.', 4 from charme.courses where slug = 'tecnico-superior';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'tecnico-superior');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Formación previa en colorimetría o experiencia demostrable', 0 from charme.courses where slug = 'tecnico-superior';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Disponibilidad para prácticas guiadas', 1 from charme.courses where slug = 'tecnico-superior';

-- Master en colorimetría
with cat as (select id from charme.course_categories where slug = 'colorimetria'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'master-colorimetria', 'Master en colorimetría', 'Gs. 500.000', '/images/master-colorimetria.webp', cat.id, '6 meses', 'Online + workshops presenciales', 'Master', 'Certificado Master en alianza con HSB', 'El programa más completo de CHARME, en alianza con la Academia N°1 del mundo en color.', 'El Master en Colorimetría es la propuesta más ambiciosa de Academia CHARME. Un recorrido de 6 meses en alianza con HSB, la academia número 1 del mundo en color, para formar colorimetristas de altísimo nivel. Cupos limitados.', true, true, 4
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'master-colorimetria');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Todos los contenidos de la ruta técnica CHARME', 0 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Metodología HSB de nivel internacional', 1 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Master classes con referentes de la industria', 2 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Portfolio profesional y prácticas supervisadas', 3 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Certificación reconocida a nivel internacional', 4 from charme.courses where slug = 'master-colorimetria';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'master-colorimetria');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Bloque 1 — Fundamentos y técnica', 'Consolidación completa de la base técnica.', 0 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Bloque 2 — Avanzado + editorial', 'Rubios extremos, color creativo y editorial.', 1 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Bloque 3 — Metodología HSB', 'Contenidos exclusivos de la academia internacional.', 2 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Bloque 4 — Master classes', 'Encuentros en vivo con referentes globales.', 3 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Bloque 5 — Práctica supervisada', 'Casos reales con acompañamiento de tutor.', 4 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Bloque 6 — Trabajo final', 'Portfolio profesional y evaluación integral.', 5 from charme.courses where slug = 'master-colorimetria';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'master-colorimetria');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Formación previa en colorimetría (mínimo nivel técnico)', 0 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Compromiso con la práctica semanal', 1 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Cupos limitados — postulación previa', 2 from charme.courses where slug = 'master-colorimetria';

-- Barbería inicial
with cat as (select id from charme.course_categories where slug = 'barberia'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'barberia-inicial', 'Barbería inicial', 'Gs. 250.000', '/images/barberia-inicial.webp', cat.id, '4 semanas', '100% online', 'Inicial', 'Certificado digital al finalizar', 'Base sólida en cortes clásicos, herramientas y atención al cliente.', 'Empezá a formarte en barbería con la base técnica que necesitás: manejo de herramientas, cortes clásicos, higiene y atención profesional. Ideal para arrancar de cero.', true, false, 5
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'barberia-inicial');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Cortes clásicos y contemporáneos con máquina y tijera', 0 from charme.courses where slug = 'barberia-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Diseño de barba y bigote profesional', 1 from charme.courses where slug = 'barberia-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Técnicas de degradado (fade) y desvanecido', 2 from charme.courses where slug = 'barberia-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Higiene, ergonomía y manejo de herramientas', 3 from charme.courses where slug = 'barberia-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Atención al cliente y estilos según rostro', 4 from charme.courses where slug = 'barberia-inicial';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'barberia-inicial');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Herramientas y ergonomía', 'Máquinas, tijeras, navajas y cuidado del kit.', 0 from charme.courses where slug = 'barberia-inicial';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Cortes clásicos', 'Corte de cabello con máquina y tijera paso a paso.', 1 from charme.courses where slug = 'barberia-inicial';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Barba y bigote', 'Diseño básico y mantenimiento profesional.', 2 from charme.courses where slug = 'barberia-inicial';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Cliente y salón', 'Higiene, atención y flujo de trabajo profesional.', 3 from charme.courses where slug = 'barberia-inicial';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'barberia-inicial');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Kit básico de barbería recomendado', 0 from charme.courses where slug = 'barberia-inicial';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Acceso a computadora o celular con internet', 1 from charme.courses where slug = 'barberia-inicial';

-- Barbería intermedia
with cat as (select id from charme.course_categories where slug = 'barberia'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'barberia-intermedia', 'Barbería intermedia', 'Gs. 300.000', '/images/barberia-intermedia.webp', cat.id, '6 semanas', '100% online', 'Intermedio', 'Certificado digital al finalizar', 'Refiná técnica y sumá degradados, diseños y estilos actuales.', 'Segundo nivel para barberos que ya tienen la base. Trabajamos degradados (fades), diseños y estilos modernos que se demandan hoy en día.', true, false, 6
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'barberia-intermedia');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Técnicas de fade y desvanecido', 0 from charme.courses where slug = 'barberia-intermedia';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Diseños de barba modernos', 1 from charme.courses where slug = 'barberia-intermedia';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Cortes con estructura y volumen', 2 from charme.courses where slug = 'barberia-intermedia';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Adaptación del corte al tipo de rostro', 3 from charme.courses where slug = 'barberia-intermedia';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Retoque y mantenimiento profesional', 4 from charme.courses where slug = 'barberia-intermedia';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'barberia-intermedia');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Fade paso a paso', 'Degradados low, mid y high con precisión.', 0 from charme.courses where slug = 'barberia-intermedia';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Barba de nivel', 'Diseño y perfilado profesional de barba.', 1 from charme.courses where slug = 'barberia-intermedia';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Cortes con estructura', 'Estilos con volumen, texture y forma.', 2 from charme.courses where slug = 'barberia-intermedia';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Cliente y estilo', 'Consulta y adaptación al rostro del cliente.', 3 from charme.courses where slug = 'barberia-intermedia';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'barberia-intermedia');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Haber completado Barbería inicial o experiencia equivalente', 0 from charme.courses where slug = 'barberia-intermedia';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Kit propio de trabajo', 1 from charme.courses where slug = 'barberia-intermedia';

-- Barbería avanzado
with cat as (select id from charme.course_categories where slug = 'barberia'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'barberia-avanzado', 'Barbería avanzado', 'Gs. 350.000', '/images/barberia-avanzado.webp', cat.id, '8 semanas', 'Online + workshops presenciales', 'Avanzado', 'Certificado digital al finalizar', 'Nivel senior: diseño creativo, técnica editorial y desarrollo de marca personal.', 'Para barberos con experiencia que quieren posicionarse como referencia. Diseño creativo, técnica editorial y desarrollo de marca personal.', true, false, 7
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'barberia-avanzado');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Diseños creativos y freehand', 0 from charme.courses where slug = 'barberia-avanzado';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Cortes editoriales y de producción', 1 from charme.courses where slug = 'barberia-avanzado';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Colorimetría aplicada a barbería', 2 from charme.courses where slug = 'barberia-avanzado';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Marca personal y redes', 3 from charme.courses where slug = 'barberia-avanzado';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Precificación y modelo de negocio', 4 from charme.courses where slug = 'barberia-avanzado';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'barberia-avanzado');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Diseño creativo', 'Freehand y patrones para diferenciarte.', 0 from charme.courses where slug = 'barberia-avanzado';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Cortes editoriales', 'Trabajos de producción y foto.', 1 from charme.courses where slug = 'barberia-avanzado';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Color en barbería', 'Aplicación de color y decoloración segura.', 2 from charme.courses where slug = 'barberia-avanzado';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Marca y negocio', 'Cómo posicionarte y cobrar tu trabajo.', 3 from charme.courses where slug = 'barberia-avanzado';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'barberia-avanzado');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Experiencia previa comprobable en barbería', 0 from charme.courses where slug = 'barberia-avanzado';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Kit profesional propio', 1 from charme.courses where slug = 'barberia-avanzado';

-- Maquillaje inicial
with cat as (select id from charme.course_categories where slug = 'maquillaje'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'maquillaje-inicial', 'Maquillaje inicial', 'Gs. 250.000', '/images/maquillaje-inicial.webp', cat.id, '4 semanas', '100% online', 'Inicial', 'Certificado digital al finalizar', 'Base técnica y práctica para arrancar en el mundo del maquillaje profesional.', 'Un curso pensado para quien empieza: fundamentos de preparación de piel, uso de productos, cejas, ojos y contorno. Todo lo que necesitás para tus primeros trabajos.', true, false, 8
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'maquillaje-inicial');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Preparación de piel y elección de bases', 0 from charme.courses where slug = 'maquillaje-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Técnicas de cejas, ojos y contorno', 1 from charme.courses where slug = 'maquillaje-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Maquillaje de día, noche y ocasiones especiales', 2 from charme.courses where slug = 'maquillaje-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Uso profesional de pinceles y productos', 3 from charme.courses where slug = 'maquillaje-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Fotografía y comunicación de tu trabajo', 4 from charme.courses where slug = 'maquillaje-inicial';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'maquillaje-inicial');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Preparación de piel', 'Limpieza, hidratación y base para maquillaje.', 0 from charme.courses where slug = 'maquillaje-inicial';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Cejas y ojos', 'Diseño de cejas y técnicas básicas de ojos.', 1 from charme.courses where slug = 'maquillaje-inicial';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Rostro completo', 'Contorno, iluminado y rubor.', 2 from charme.courses where slug = 'maquillaje-inicial';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Práctica integral', 'Maquillaje de día y noche paso a paso.', 3 from charme.courses where slug = 'maquillaje-inicial';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'maquillaje-inicial');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Kit básico de maquillaje', 0 from charme.courses where slug = 'maquillaje-inicial';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Acceso a computadora o celular con internet', 1 from charme.courses where slug = 'maquillaje-inicial';

-- Maquillaje intermedio
with cat as (select id from charme.course_categories where slug = 'maquillaje'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'maquillaje-intermedio', 'Maquillaje intermedio', 'Gs. 300.000', '/images/maquillaje-intermedio.webp', cat.id, '6 semanas', '100% online', 'Intermedio', 'Certificado digital al finalizar', 'Sumá técnica de novias, sociales y trabajos de mayor exigencia.', 'Segundo nivel para maquilladoras que ya tienen la base. Trabajamos maquillaje de novias, sociales y técnicas de larga duración.', true, false, 9
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'maquillaje-intermedio');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Maquillaje de novia y sociales', 0 from charme.courses where slug = 'maquillaje-intermedio';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Cut crease y técnicas de ojos avanzadas', 1 from charme.courses where slug = 'maquillaje-intermedio';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Larga duración y fijación profesional', 2 from charme.courses where slug = 'maquillaje-intermedio';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Adaptación a diferentes tipos de piel', 3 from charme.courses where slug = 'maquillaje-intermedio';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Atención y protocolo con la clienta', 4 from charme.courses where slug = 'maquillaje-intermedio';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'maquillaje-intermedio');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Novia clásica y moderna', 'Estilos de novia según personalidad.', 0 from charme.courses where slug = 'maquillaje-intermedio';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Ojos avanzados', 'Cut crease, halo eye y otras técnicas.', 1 from charme.courses where slug = 'maquillaje-intermedio';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Larga duración', 'Productos y técnicas para 12+ horas.', 2 from charme.courses where slug = 'maquillaje-intermedio';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Tipos de piel', 'Adaptación a cada piel y edad.', 3 from charme.courses where slug = 'maquillaje-intermedio';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'maquillaje-intermedio');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Haber completado Maquillaje inicial o experiencia equivalente', 0 from charme.courses where slug = 'maquillaje-intermedio';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Kit propio con paletas profesionales', 1 from charme.courses where slug = 'maquillaje-intermedio';

-- Maquillaje avanzado
with cat as (select id from charme.course_categories where slug = 'maquillaje'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'maquillaje-avanzado', 'Maquillaje avanzado', 'Gs. 350.000', '/images/maquillaje-avanzado.webp', cat.id, '8 semanas', 'Online + workshops presenciales', 'Avanzado', 'Certificado digital al finalizar', 'Nivel senior: editorial, caracterización y trabajo de foto/video.', 'Para maquilladoras que quieren dar el salto al trabajo editorial, fotográfico y de caracterización. Técnicas de alto nivel y marca personal.', true, false, 10
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'maquillaje-avanzado');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Maquillaje editorial y de producción', 0 from charme.courses where slug = 'maquillaje-avanzado';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Técnicas para foto y video', 1 from charme.courses where slug = 'maquillaje-avanzado';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Caracterización y efectos', 2 from charme.courses where slug = 'maquillaje-avanzado';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Marca personal y portfolio', 3 from charme.courses where slug = 'maquillaje-avanzado';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Networking en la industria', 4 from charme.courses where slug = 'maquillaje-avanzado';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'maquillaje-avanzado');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Editorial', 'Piel de revista y looks vanguardistas.', 0 from charme.courses where slug = 'maquillaje-avanzado';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Foto y video', 'Cómo adaptar el make a distintas cámaras.', 1 from charme.courses where slug = 'maquillaje-avanzado';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Caracterización', 'Introducción a efectos y transformación.', 2 from charme.courses where slug = 'maquillaje-avanzado';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Marca y portfolio', 'Construcción de imagen profesional.', 3 from charme.courses where slug = 'maquillaje-avanzado';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'maquillaje-avanzado');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Experiencia previa demostrable en maquillaje', 0 from charme.courses where slug = 'maquillaje-avanzado';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Kit profesional completo', 1 from charme.courses where slug = 'maquillaje-avanzado';
