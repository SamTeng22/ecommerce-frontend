export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    categoryName: string;
}

export interface ProductPage {
    content: Product[];
    totalElements: number;
    totalPages: number;
    number: number;
}