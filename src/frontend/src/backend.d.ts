import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export interface FlashSale {
    endTime: Time;
    productIds: Array<bigint>;
    discountPercent: bigint;
}
export interface Product {
    id: bigint;
    inStock: bigint;
    originalPrice?: bigint;
    name: string;
    description: string;
    imageUrl: string;
    category: ProductCategory;
    badge?: ProductBadge;
    rating: number;
    price: bigint;
    reviewCount: bigint;
    isTrending: boolean;
}
export interface UserProfile {
    name: string;
    email: string;
    shippingAddress: string;
}
export enum ProductBadge {
    hot = "hot",
    new_ = "new",
    viral = "viral",
    sale = "sale"
}
export enum ProductCategory {
    techGadgets = "techGadgets",
    petGear = "petGear",
    fashion = "fashion",
    homeEssentials = "homeEssentials"
}
export enum SortOption {
    trending = "trending",
    priceDesc = "priceDesc",
    rating = "rating",
    priceAsc = "priceAsc"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addToCart(productId: bigint, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createFlashSale(productIds: Array<bigint>, discountPercent: bigint, durationMinutes: bigint): Promise<void>;
    createProduct(product: Product): Promise<Product>;
    deleteProduct(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getFlashSale(): Promise<FlashSale | null>;
    getProduct(id: bigint): Promise<Product>;
    getProducts(category: ProductCategory | null, sort: SortOption | null): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeFromCart(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedData(): Promise<void>;
    updateCartItemQuantity(productId: bigint, quantity: bigint): Promise<void>;
    updateProduct(id: bigint, updatedProduct: Product): Promise<void>;
}
