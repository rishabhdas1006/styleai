export interface Product {
    id: number;
    name: string;
    category: string;
    brand: string;
    price: number;
    image: string;
    description?: string;
    colors?: string[];
}

export interface ProductVariant {
    id: string;
    size: string;
    color: string;
    colorName: string;
    sku: string;
    stock: number;
    price: number;
    images: string[];
}

export interface ProductDetail {
    id: number;
    name: string;
    categoryId: number;
    categoryName: string;
    brand: string;
    price: number;
    description: string;
    image?: string;
    images: string[];
    availableColors: {
        name: string;
        hex: string;
    }[];
    variants: ProductVariant[];
}

export interface NavItem {
    label: string;
    href: string;
}

export interface ServerCartItem {
    id: number;
    variantId: string;
    quantity: number;

    variant: {
        id: string;
        size: string;
        color: string;
        colorName: string;
        price: number;
        stock: number;
        images: string[];

        product: {
            id: number;
            name: string;
            category: string;
            brand: string;
        };
    };
}

export interface ServerCart {
    items: ServerCartItem[];
    total: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
    variantId?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ProductsQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    brand?: string;
    gender?: string;
    color?: string;
    size?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    mine?: boolean;
}

export interface CreateProductPayload {
    name: string;
    description: string;
    brand: string;
    category_id: number;
    gender: string;
    primary_image_url: string;
    primary_image_public_id: string;
}

export interface CreateVariantPayload {
    variantId: string;
    size: string;
    color: string;
    price: number;
    stock: number;
    images: {
        url: string;
        public_id: string;
    }[];
}

export interface UpdateVariantPayload {
    variantId: string;
    price?: number;
    stock?: number;
}

export interface Category {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    role: string;
    user: User | null;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface OrderItem {
    id: number;
    variantId: string;
    quantity: number;
    price: number;

    variant: {
        size: string;
        color: string;
        colorName: string;

        product: {
            id: number;
            name: string;
            category: string;
        };
    };
}

export interface Order {
    id: number;
    status: string;
    total: number;
    items: OrderItem[];
    createdAt: string;
}