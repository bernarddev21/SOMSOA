import Link from 'next/link';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-shell"><aside className="admin-sidebar"><Link className="admin-brand" href="/admin">SOMSOA <span>CONTROL CENTRE</span></Link><nav><Link href="/admin">Overview</Link><Link href="/admin/products">Products & pricing</Link><Link href="/admin/orders">Orders</Link><Link href="/admin/discounts">Discount codes</Link><Link href="/admin/analytics">Website analytics</Link></nav><p className="admin-sidebar-note">Private administration</p></aside><main className="admin-main">{children}</main></div>;
}
