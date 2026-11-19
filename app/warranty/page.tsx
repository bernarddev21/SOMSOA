import LegalPage from "../../components/legal/LegalPage";

export default function WarrantyPage() {
  return (
    <LegalPage eyebrow="LEGAL / 04" title="1-Year Warranty">
      <p className="legal-updated">Last updated: 25 September 2026</p>

      <p>
        SOMSOA products are supplied with a 1-year warranty unless otherwise
        stated on the relevant product page.
      </p>

      <h2>1. What the warranty covers</h2>
      <p>
        The warranty covers manufacturing defects and faults that arise under
        normal intended use during the warranty period.
      </p>

      <h2>2. What the warranty does not cover</h2>
      <ul>
        <li>Accidental damage</li>
        <li>Misuse or improper use</li>
        <li>Damage caused by unauthorised modification or repair</li>
        <li>Normal cosmetic wear and tear</li>
        <li>Damage caused by failure to follow the product instructions</li>
        <li>Damage caused by circumstances outside the product&apos;s intended use</li>
      </ul>

      <h2>3. Making a warranty claim</h2>
      <p>
        Contact <a href="mailto:somsoauk@yahoo.com">somsoauk@yahoo.com</a> and
        provide your order number, name, a description of the issue and
        photographs or video where appropriate.
      </p>

      <h2>4. Remedies</h2>
      <p>
        Where a valid warranty claim is accepted, SOMSOA may offer an
        appropriate remedy, which may include repair, replacement or another
        appropriate solution.
      </p>

      <h2>5. Your statutory rights</h2>
      <p>
        This warranty is provided in addition to, and does not replace or
        restrict, your statutory consumer rights.
      </p>
    </LegalPage>
  );
}
