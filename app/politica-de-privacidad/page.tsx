import Link from "next/link";
import NextImage from "next/image";

export const metadata = {
  title: "Política de privacidad — Academia CHARME",
  description:
    "Cómo Academia CHARME recolecta, usa y protege los datos personales de sus alumnos y visitantes.",
};

export default function PoliticaPrivacidadPage() {
  return (
    <main className="legal">
      <header className="site-header nosotros-header">
        <Link href="/" className="brand" aria-label="Academia CHARME">
          <NextImage src="/images/logo.png" alt="Academia CHARME" width={200} height={110} unoptimized />
        </Link>
        <nav className="desktop-nav">
          <Link href="/#formaciones">Formaciones</Link>
          <Link href="/#academia">Academia</Link>
          <Link href="/nosotros">Nosotros</Link>
          <Link href="/#profesionales">Profesionales</Link>
        </nav>
        <div className="header-actions">
          <Link className="button button-dark" href="/">Volver al inicio</Link>
        </div>
      </header>

      <section className="legal-hero section-shell">
        <p className="eyebrow">Academia CHARME</p>
        <h1>Política de privacidad</h1>
        <span className="short-line" />
        <p className="legal-updated">Última actualización: 10 de agosto de 2026</p>
      </section>

      <article className="legal-body section-shell">
        <h2>1. Introducción</h2>
        <p>
          En Academia CHARME valoramos y respetamos la privacidad de nuestros alumnos, visitantes
          y cualquier persona que interactúe con nosotros. Esta Política de Privacidad describe
          cómo recolectamos, usamos, almacenamos y protegemos la información personal que
          recibimos a través de este sitio web y de los servicios asociados.
        </p>

        <h2>2. Responsable del tratamiento</h2>
        <p>
          El responsable del tratamiento de los datos personales es Academia CHARME, con domicilio
          en Avda. Gaspar Rodríguez de Francia c/ Defensores del Chaco, San Lorenzo, Paraguay.
          Para cualquier consulta relacionada con esta política, podés escribirnos a{" "}
          <a href="mailto:academiacharmeparaguay@gmail.com">academiacharmeparaguay@gmail.com</a>.
        </p>

        <h2>3. Datos que recolectamos</h2>
        <p>Podemos recolectar los siguientes tipos de información:</p>
        <ul>
          <li><strong>Datos de identificación:</strong> nombre, apellido, documento de identidad.</li>
          <li><strong>Datos de contacto:</strong> correo electrónico, número de teléfono, dirección.</li>
          <li><strong>Datos de la cuenta:</strong> usuario, contraseña (encriptada), preferencias.</li>
          <li><strong>Datos de facturación:</strong> información necesaria para procesar pagos e inscripciones.</li>
          <li><strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas, cookies.</li>
        </ul>

        <h2>4. Finalidad del tratamiento</h2>
        <p>Usamos tus datos personales para:</p>
        <ul>
          <li>Gestionar tu inscripción y acceso a los cursos.</li>
          <li>Enviarte información académica y comercial vinculada a nuestros servicios.</li>
          <li>Emitir facturas y llevar registros contables conforme a la normativa aplicable.</li>
          <li>Responder consultas, reclamos o solicitudes de soporte.</li>
          <li>Mejorar la experiencia de uso del sitio y de la plataforma del alumno.</li>
          <li>Cumplir con obligaciones legales y regulatorias.</li>
        </ul>

        <h2>5. Base legal</h2>
        <p>
          El tratamiento de tus datos se realiza con base en tu consentimiento, en la ejecución
          del contrato de servicios educativos con Academia CHARME, en el cumplimiento de
          obligaciones legales y en el interés legítimo de la institución.
        </p>

        <h2>6. Uso de cookies</h2>
        <p>
          Este sitio utiliza cookies propias y de terceros para asegurar el correcto
          funcionamiento del sitio, analizar el uso y mejorar la experiencia de navegación. Podés
          configurar o desactivar las cookies desde tu navegador. Al continuar navegando aceptás
          el uso de cookies según esta política.
        </p>

        <h2>7. Compartición con terceros</h2>
        <p>
          No vendemos ni cedemos tus datos personales. Podemos compartirlos únicamente con
          proveedores que prestan servicios en nuestro nombre (por ejemplo: procesadores de pago,
          plataformas de correo, servicios de hosting), quienes están obligados contractualmente
          a mantener la confidencialidad y a usarlos solo para el fin acordado.
        </p>

        <h2>8. Conservación de datos</h2>
        <p>
          Conservamos tus datos personales mientras exista una relación activa con nosotros y,
          posteriormente, durante los plazos que exija la normativa vigente para cumplir con
          obligaciones legales, contables y fiscales.
        </p>

        <h2>9. Tus derechos</h2>
        <p>Como titular de tus datos, tenés derecho a:</p>
        <ul>
          <li>Acceder a los datos personales que tenemos sobre vos.</li>
          <li>Solicitar la rectificación de datos inexactos o incompletos.</li>
          <li>Solicitar la eliminación de tus datos cuando ya no sean necesarios.</li>
          <li>Retirar tu consentimiento en cualquier momento.</li>
          <li>Oponerte al tratamiento o solicitar su limitación.</li>
        </ul>
        <p>
          Para ejercer estos derechos podés escribirnos a{" "}
          <a href="mailto:academiacharmeparaguay@gmail.com">academiacharmeparaguay@gmail.com</a>{" "}
          indicando tu solicitud y adjuntando una copia de tu documento de identidad.
        </p>

        <h2>10. Seguridad</h2>
        <p>
          Aplicamos medidas técnicas y organizativas razonables para proteger tus datos
          personales frente a accesos no autorizados, pérdida, alteración o divulgación. Sin
          embargo, ningún sistema es 100 % seguro y no podemos garantizar la seguridad absoluta
          de la información transmitida por internet.
        </p>

        <h2>11. Menores de edad</h2>
        <p>
          Nuestros servicios están dirigidos a personas mayores de 18 años. En caso de menores,
          será necesario contar con el consentimiento expreso de sus padres o tutores legales.
        </p>

        <h2>12. Cambios en la política</h2>
        <p>
          Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en
          nuestras prácticas, la legislación o los servicios. Publicaremos la versión vigente en
          esta misma página con su fecha de última actualización.
        </p>

        <h2>13. Legislación aplicable</h2>
        <p>
          Esta Política de Privacidad se rige por las leyes de la República del Paraguay.
          Cualquier controversia será sometida a los tribunales competentes de la ciudad de
          Asunción.
        </p>
      </article>

      <footer>
        <div className="footer-grid section-shell">
          <NextImage className="footer-logo" src="/images/logo.png" alt="Academia CHARME" width={310} height={170} unoptimized />
          <div><h3>Academia</h3><Link href="/#academia">Sobre nosotros</Link><Link href="/#profesionales">Profesionales</Link></div>
          <div><h3>Formaciones</h3><Link href="/#formaciones">Todos los cursos</Link></div>
          <div><h3>Contacto</h3><a href="https://wa.me/595986373130" target="_blank" rel="noreferrer">WhatsApp</a><span>Paraguay</span></div>
          <div><h3>Legal</h3><Link href="/politica-de-privacidad">Política de privacidad</Link></div>
        </div>
        <div className="copyright">
          <span>© Academia CHARME. Todos los derechos reservados.</span>
          <span className="dev-credit">Desarrollado por <a href="https://neura.com.py" target="_blank" rel="noreferrer">Neura</a></span>
        </div>
      </footer>
    </main>
  );
}
