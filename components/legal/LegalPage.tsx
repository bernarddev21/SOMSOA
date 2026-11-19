import Link from "next/link";

export default function LegalPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="legal-page">
      <div className="legal-page-inner">
        <Link href="/" className="legal-back">
          ← SOMSOA
        </Link>

        <p className="legal-eyebrow">{eyebrow}</p>
        <h1 className="legal-title">{title}</h1>

        <div className="legal-content">{children}</div>

        <div className="legal-contact">
          <strong>Sandra Gbadebo trading as SOMSOA</strong>
          <span>575 Westhorne Avenue</span>
          <span>SE9 6DN</span>
          <span>United Kingdom</span>
          <a href="mailto:somsoauk@yahoo.com">somsoauk@yahoo.com</a>
        </div>
      </div>
    </main>
  );
}
