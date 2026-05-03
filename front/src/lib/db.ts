export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    imageUrl: string;
    description: string;
    stock: number;
    createdAt: string;
}

// We use 'let' so our Admin POST/DELETE routes can modify it later!
export let mockProducts: Product[] = [
    {
        id: 1,
        name: 'Samsung Galaxy S21 Battery',
        price: 25.99,
        category: 'Mobile',
        imageUrl: '/images/battery-1.webp',
        description: 'High-capacity replacement battery for Samsung Galaxy S21.',
        createdAt: '2023-10-15T08:00:00Z'
    },
    {
        id: 2,
        name: 'iPhone 13 Pro Max Battery',
        price: 35.00,
        category: 'Mobile',
        imageUrl: '/images/battery-1.webp',
        description: 'Premium quality replacement battery for iPhone 13 Pro Max.',
        createdAt: '2024-01-20T14:30:00Z'
    },
    {
        id: 3,
        name: 'Asus ROG Laptop Battery',
        price: 65.50,
        category: 'Laptop',
        imageUrl: '/images/battery-2.webp',
        description: 'Extended life 6-cell battery for Asus ROG series laptops.',
        createdAt: '2023-12-05T09:15:00Z'
    },
    {
        id: 4,
        name: 'Dell XPS 15 Battery',
        price: 70.00,
        category: 'Laptop',
        imageUrl: '/images/battery-2.webp',
        description: 'Genuine OEM replacement battery for Dell XPS 15.',
        createdAt: '2024-02-25T11:45:00Z'
    },
];

export const getCategories = (products: Product[]) => {
    const counts = products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, count]) => ({
        id: name,
        name,
        count
    }));
};

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    imageUrl: string
}

export interface Order {
    id: string; // Using number to match your exact old code
    customerPhone: string;
    fullName?: string;
    shippingAddress?: string;
    createdAt: string;
    status: OrderStatus;
    totalAmount: number;
    items: OrderItem[];
}

// This acts as our temporary database table
export let mockOrders: Order[] = [];

export interface User {
    id: number;
    phone: string;
    role: 'USER' | 'ADMIN';
    joinedAt: string;
}

export let mockUsers: User[] = [];

export const getOrCreateUser = (phone: string): User => {
    let user = mockUsers.find(u => u.phone === phone);
    if (!user) {
        user = {
            id: mockUsers.length + 1,
            phone,
            role: phone.endsWith('99') ? 'ADMIN' : 'USER', // Your logic for admin
            joinedAt: new Date().toISOString()
        };
        mockUsers.push(user);
    }
    return user;
};