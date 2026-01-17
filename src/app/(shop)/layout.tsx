import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <CartProvider>
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </CartProvider>
        </div>
    );
}
