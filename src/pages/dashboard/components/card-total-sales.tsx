import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/services/api";
import { useEffect, useState } from "react";

interface ResponseTotalOrders {
    totalAmount: number;
}

export function CardTotalSales() {
    const [totalOrdes, setTotalOrders] = useState<ResponseTotalOrders>()

    useEffect(() => {
        api.get('/orders/total').then(response => setTotalOrders(response.data))
    }, []);

    return (
        <Card className="@container/card bg-slate-50">
            <CardHeader>
                <CardDescription>Vendas</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    R$ {totalOrdes?.totalAmount ? totalOrdes.totalAmount : "0"},00
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">
                    Total de vendas até agora
                </div>
            </CardFooter>
        </Card>
    )
}