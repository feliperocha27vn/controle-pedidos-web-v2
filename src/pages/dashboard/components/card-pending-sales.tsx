import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/services/api";
import { formatterMoney } from "@/utils/format-money";
import { useEffect, useState } from "react";

interface ResponseTotalOrders {
    totalAmount: number;
}

export function CardPedingSales() {
    const [totalOrdesPending, setTotalOrdersPending] = useState<ResponseTotalOrders>()

    useEffect(() => {
        api.get('/orders/pending').then(response => setTotalOrdersPending(response.data))
    }, []);


    return (
        <Card className="@container/card bg-slate-50">
            <CardHeader>
                <CardDescription>Vendas a receber</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {totalOrdesPending?.totalAmount ? formatterMoney.format(totalOrdesPending.totalAmount) : "0"}
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">
                    Total que temos a receber nesse mês
                </div>
            </CardFooter>
        </Card>
    )
}