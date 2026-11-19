import LegalPage from "../../components/legal/LegalPage";

export default function ContactPage() {
  return (
    <LegalPage eyebrow="SOMSOA / CONTACT" title="Contact SOMSOA">
      <p>
        We&apos;re here to help with orders, products, sizing, delivery,
        returns and general enquiries.
      </p>

      <h2>Email</h2>
      <p>
        <a href="mailto:somsoauk@yahoo.com">somsoauk@yahoo.com</a>
      </p>

      <h2>Business</h2>
      <p>
        Sandra Gbadebo trading as SOMSOA
        <br />
        Sole trader
      </p>

      <h2>Address</h2>
      <p>
        575 Westhorne Avenue
        <br />
        SE9 6DN
        <br />
        United Kingdom
      </p>

      <h2>Order enquiries</h2>
      <p>
        If you&apos;re contacting us about an existing order, please include
        your order number so we can help you as quickly as possible.
      </p>

      <h2>Customer support</h2>
      <p>
        We aim to respond to enquiries as soon as possible, normally within
        1–2 working days.
      </p>
    </LegalPage>
  );
}