import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";


interface ResponseSales {
    id: string;
    customerName: string;
    quantity: number;
    totalAmount: number;
    status: "pending" | "paid";
    recipe: {
        title: string
    }
}

export function ManageSales() {
    const [sales, setSales] = useState<ResponseSales[]>([])
    const navigate = useNavigate()
    const [search, setSearch] = useState('')

    useEffect(() => {
        api.get('/orders').then(response => setSales(response.data))
    }, []);

    return (
        <div className="p-5 space-y-4">
            <div className="*:not-first:mt-2">
                <Label>Pesquise o cliente desejado</Label>
                <div className="relative">
                    <Input
                        className="pe-11"
                        placeholder="Pesquisar..."
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-2">
                        <Search size={16} />
                    </div>
                </div>
            </div>
            {sales.filter((sale) => sale.customerName.toLowerCase().includes(search.toLowerCase())).map((sale) => (
                <Card key={sale.id} className="@container/card bg-slate-50" onClick={() => navigate(`/sale/${sale.id}`)}>
                    <CardHeader>
                        <CardDescription className="text-2xl">{sale.customerName}</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            R$ {sale.totalAmount},00
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="text-muted-foreground">
                            {sale.status === "pending" ? "Pendente" : "Pago"}
                            <p>{sale.quantity} - {sale.recipe.title}</p>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}