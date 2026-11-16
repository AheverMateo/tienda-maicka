"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button, buttonVariants } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export type CartItem = {
  key: string
  productId: string
  name: string
  price: number
  talle?: string
  qty: number
  maxStock?: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  open: boolean
  setOpen: (open: boolean) => void
  addItem: (item: Omit<CartItem, "key" | "qty">) => void
  removeItem: (key: string) => void
  setQty: (key: string, qty: number) => void
  notify: (message: string) => void
}

const CartContext = createContext<CartContextValue | null>(null)

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ?? ""
const WHATSAPP_READY = /^\d{8,15}$/.test(WHATSAPP_NUMBER)

const STORAGE_KEY = "tienda-cart-v1"

function loadStoredCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is CartItem => {
      if (typeof item !== "object" || item === null) return false
      const candidate = item as Record<string, unknown>
      return (
        typeof candidate.key === "string" &&
        typeof candidate.productId === "string" &&
        typeof candidate.name === "string" &&
        typeof candidate.price === "number" &&
        candidate.price > 0 &&
        Number.isInteger(candidate.qty) &&
        (candidate.qty as number) >= 1 &&
        (candidate.talle === undefined ||
          typeof candidate.talle === "string") &&
        (candidate.maxStock === undefined ||
          (typeof candidate.maxStock === "number" &&
            candidate.maxStock >= 1))
      )
    })
  } catch {
    return []
  }
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>")
  return ctx
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const id = window.setTimeout(() => {
      setItems(loadStoredCart())
      setHydrated(true)
    }, 0)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // storage lleno o bloqueado: el carrito vive solo en memoria
    }
  }, [items, hydrated])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 1800)
    return () => window.clearTimeout(t)
  }, [toast])

  const notify = useCallback((message: string) => setToast(message), [])

  const addItem = useCallback((item: Omit<CartItem, "key" | "qty">) => {
    const key = `${item.productId}:${item.talle ?? "unico"}`
    setItems((prev) => {
      const existing = prev.find((entry) => entry.key === key)
      if (existing) {
        if (
          existing.maxStock !== undefined &&
          existing.qty >= existing.maxStock
        ) {
          setToast("No queda más stock de esa variante")
          return prev
        }
        return prev.map((entry) =>
          entry.key === key ? { ...entry, qty: entry.qty + 1 } : entry,
        )
      }
      return [...prev, { ...item, key, qty: 1 }]
    })
  }, [])

  const removeItem = useCallback((key: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.key !== key)
      if (next.length === 0) setOpen(false)
      return next
    })
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) => {
      const target = prev.find((item) => item.key === key)
      const capped =
        target?.maxStock !== undefined ? Math.min(qty, target.maxStock) : qty
      const next =
        capped <= 0
          ? prev.filter((item) => item.key !== key)
          : prev.map((item) => (item.key === key ? { ...item, qty: capped } : item))
      if (next.length === 0) setOpen(false)
      return next
    })
  }, [])

  const { count, total } = useMemo(() => {
    return {
      count: items.reduce((sum, item) => sum + item.qty, 0),
      total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
    }
  }, [items])

  const whatsappHref = useMemo(() => {
    if (!WHATSAPP_READY) return null
    const lines = items.map(
      (item) =>
        `- ${item.qty}× ${item.name}${item.talle ? ` (talle ${item.talle})` : ""} — ${formatPrice(item.price * item.qty)}`,
    )
    const message = `¡Hola! Quiero hacer este pedido:\n${lines.join("\n")}\nTotal: ${formatPrice(total)}`
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  }, [items, total])

  const value = useMemo(
    () => ({
      items,
      count,
      total,
      open,
      setOpen,
      addItem,
      removeItem,
      setQty,
      notify,
    }),
    [items, count, total, open, addItem, removeItem, setQty, notify],
  )

  return (
    <CartContext.Provider value={value}>
      {children}

      {toast && (
        <div
          role="status"
          className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg"
        >
          {toast}
        </div>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="mx-auto max-h-[86dvh] w-full max-w-xl rounded-t-[var(--radius-sheet)] border-t border-border pb-[env(safe-area-inset-bottom)]"
        >
          <SheetHeader className="p-4 pb-0">
            <SheetTitle className="font-heading text-xl font-extrabold tracking-tight">
              Tu pedido
            </SheetTitle>
            <SheetDescription>
              Revisá el detalle y enviá el pedido por WhatsApp.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4">
            {items.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                Todavía no agregaste nada.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li
                    key={item.key}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-snug">
                        {item.name}
                      </p>
                      {item.talle && (
                        <p className="text-xs text-muted-foreground">
                          Talle {item.talle}
                        </p>
                      )}
                      <p className="mt-0.5 text-sm font-semibold tabular-nums">
                        {formatPrice(item.price * item.qty)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <div
                        className="flex items-center rounded-[var(--radius-md)] border border-border"
                        role="group"
                        aria-label={`Cantidad de ${item.name}`}
                      >
                        <button
                          type="button"
                          onClick={() => setQty(item.key, item.qty - 1)}
                          aria-label="Quitar uno"
                          className="flex size-8 items-center justify-center rounded-l-[var(--radius-md)] transition-colors hover:bg-muted focus-visible:outline-3 focus-visible:outline-ring"
                        >
                          <Minus aria-hidden className="size-4" />
                        </button>
                        <span
                          aria-live="polite"
                          className="w-8 text-center text-sm font-semibold tabular-nums"
                        >
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(item.key, item.qty + 1)}
                          disabled={
                            item.maxStock !== undefined &&
                            item.qty >= item.maxStock
                          }
                          aria-label="Agregar uno"
                          className="flex size-8 items-center justify-center rounded-r-[var(--radius-md)] transition-colors hover:bg-muted focus-visible:outline-3 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus aria-hidden className="size-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        aria-label={`Quitar ${item.name} del pedido`}
                        className="rounded-md p-1.5 text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-3 focus-visible:outline-ring"
                      >
                        <Trash2 aria-hidden className="size-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <SheetFooter className="border-t border-border p-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span className="font-heading tabular-nums">
                {formatPrice(total)}
              </span>
            </div>
            {WHATSAPP_READY ? (
              <a
                href={items.length > 0 ? (whatsappHref ?? undefined) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={items.length === 0}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 w-full rounded-xl text-base font-bold",
                  items.length === 0 && "pointer-events-none opacity-45",
                )}
              >
                <ShoppingCart aria-hidden />
                Enviar pedido por WhatsApp
              </a>
            ) : (
              <p
                role="alert"
                className="rounded-xl border border-dashed border-destructive/40 bg-destructive/5 p-3 text-center text-sm text-destructive"
              >
                Los pedidos por WhatsApp todavía no están configurados.
                Falta definir NEXT_PUBLIC_WHATSAPP_NUMBER.
              </p>
            )}
            <Button
              variant="outline"
              size="lg"
              className="h-11 w-full rounded-xl"
              onClick={() => setOpen(false)}
            >
              Seguir mirando
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </CartContext.Provider>
  )
}
