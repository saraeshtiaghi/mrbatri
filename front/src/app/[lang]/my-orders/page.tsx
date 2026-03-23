import {getDictionary} from '@/lib/dictionaries';
import Header from '@/components/Header';
import {cookies} from 'next/headers';
import {Order, OrderItem, OrderStatus} from "@/lib/db";

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export default async function MyOrdersPage({params}: { params: Promise<{ lang: 'en' | 'fa' }> }) {
    const {lang} = await params;
    const dict = await getDictionary(lang);

    // Grab the token from cookies during Server-Side Rendering
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt_token')?.value;

    // Fetch directly from Spring Boot securely!
    const res = await fetch(`${BACKEND_URL}/api/orders`, {
        cache: 'no-store',
        headers: {
            ...(token && {'Authorization': `Bearer ${token}`})
        }
    });

    const orders: Order[] = res.ok ? await res.json() : [];

    const statusMap: Record<OrderStatus, string> = {
        Delivered: lang === 'fa' ? 'تحویل شده' : 'Delivered',
        Shipped: lang === 'fa' ? 'در حال ارسال' : 'Shipping',
        Pending: lang === 'fa' ? 'در انتظار' : 'Pending',
        Processing: lang === 'fa' ? 'آماده سازی' : 'Processing',
        Cancelled: lang === 'fa' ? 'لغو شده' : 'Cancelled',
    };

    return (
        <div className="min-h-screen bg-background text-on-background font-sans">
            <Header lang={lang} dict={dict}/>
            <main className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-black mb-8">{lang === 'fa' ? 'سفارشات من' : 'My Orders'}</h1>

                <div className="space-y-6">
                    {orders.map((order: Order) => (
                        <div key={order.id} className="bg-surface border border-outline rounded-2xl p-6 shadow-sm">
                            <div
                                className="flex flex-col md:flex-row justify-between mb-4 pb-4 border-b border-outline gap-4">
                                <div>
                                    <p className="text-xs text-on-surface-muted uppercase font-bold">{lang === 'fa' ? 'شناسه سفارش' : 'Order ID'}</p>
                                    <p className="font-mono font-bold text-primary">{order.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-on-surface-muted uppercase font-bold">{lang === 'fa' ? 'تاریخ' : 'Date'}</p>
                                    <p className="font-bold">{order.createdAt}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-on-surface-muted uppercase font-bold">{lang === 'fa' ? 'وضعیت' : 'Status'}</p>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full font-bold ${order.status === 'Delivered' ? 'bg-success/10 text-success' : 'bg-secondary/10 text-secondary'}`}>
                                        {statusMap[order.status]}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-on-surface-muted uppercase font-bold">{lang === 'fa' ? 'جمع کل' : 'Total'}</p>
                                    <p className="font-black text-lg">${order.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>

                            <ul className="space-y-2">
                                {order.items.map((item: OrderItem, idx: number) => (
                                    <li key={idx} className="text-sm flex justify-between">
                                        <span className="text-on-surface-muted">{item.name}</span>
                                        <span className="font-bold">x{item.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}