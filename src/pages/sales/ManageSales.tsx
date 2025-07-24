import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/services/api";
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

    useEffect(() => {
        api.get('/orders').then(response => setSales(response.data))
    }, []);

    return (
        <div className="p-5 space-y-4">
            {sales.map((sale) => (
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