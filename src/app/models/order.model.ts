export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface Order {
    id: number;
    items: OrderItem[];
    totalPrice: number;
    status: string;
    createdAt: string;
}