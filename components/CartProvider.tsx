"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";
import type { Product, SizeSystem } from "./products";
import { trackCommerceEvent } from "@/lib/analytics-client";

export type CartItem = {
  id: string;
  product: Product;
  sizeSystem: SizeSystem;
  size: string;
  quantity: number;
};

type AddToCartItem = {
  product: Product;
  sizeSystem: SizeSystem;
  size: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  addItem: (item: AddToCartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function restoreCart() {
      let saved: CartItem[] = [];
      try {
        const raw = localStorage.getItem("somsoa-cart");
        const parsed: unknown = raw ? JSON.parse(raw) : [];
        if (Array.isArray(parsed)) saved = parsed as CartItem[];
      } catch {
        localStorage.removeItem("somsoa-cart");
      }

      if (cancelled) return;
      setItems(saved);

      // Refresh stored cart items from the current public catalogue so admin
      // price/availability changes are reflected before the next checkout.
      try {
        const response = await fetch('/api/products', { cache: 'no-store' });
        if (response.ok) {
          const payload = await response.json();
          if (Array.isArray(payload?.products)) {
            const latest = new Map<string, Product>(payload.products.map((product: Product) => [product.id, product]));
            if (!cancelled) {
              setItems(saved
                .filter((item) => latest.has(item.product.id))
                .map((item) => ({ ...item, product: latest.get(item.product.id)! })));
            }
          }
        }
      } catch {
        // Keep the saved cart visible; checkout independently validates prices.
      } finally {
        if (!cancelled) setCartLoaded(true);
      }
    }
    restoreCart();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!cartLoaded) return;
    localStorage.setItem("somsoa-cart", JSON.stringify(items));
  }, [items, cartLoaded]);

  const addItem = useCallback((item: AddToCartItem) => {
    void trackCommerceEvent("add_to_cart", item.product.id);
    const itemId = `${item.product.id}-${item.sizeSystem}-${item.size}`;

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) => cartItem.id === itemId
      );

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.id === itemId
            ? {
                ...cartItem,
                quantity: cartItem.quantity + item.quantity,
              }
            : cartItem
        );
      }

      return [
        ...currentItems,
        {
          id: itemId,
          product: item.product,
          sizeSystem: item.sizeSystem,
          size: item.size,
          quantity: item.quantity,
        },
      ];
    });

    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== id)
      );

      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
  setItems([]);

  if (typeof window !== "undefined") {
    localStorage.removeItem("somsoa-cart");
  }
}, []);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const cartCount = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const cartTotal = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }, [items]);

  const contextValue = useMemo<CartContextType>(
    () => ({
      items,
      cartCount,
      cartTotal,
      isCartOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
    }),
    [
      items,
      cartCount,
      cartTotal,
      isCartOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }

  return context;
}