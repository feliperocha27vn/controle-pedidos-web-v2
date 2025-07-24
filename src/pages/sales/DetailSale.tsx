import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";

interface ResponseSaleById {
    id: string;
    customerName: string;
    quantity: number;
    totalAmount: number;
    status: "pending" | "paid";
    recipe: {
        title: string
    }
}

interface RequestSaleChangeStatus {
    status: "pending" | "paid";
}



export function DetailSale() {
    const { idSale } = useParams()
    const [sale, setSale] = useState<ResponseSaleById | null>(null)
    const { register, handleSubmit } = useForm<RequestSaleChangeStatus>()

    useEffect(() => {
        api.get(`/order/${idSale}`).then(response => setSale(response.data))
    }, [idSale])

    async function handleConfirmPayment(data: RequestSaleChangeStatus) {
        await api.patch(`/order/${idSale}/change-status`, data)
        setSale(prevSale => prevSale ? { ...prevSale, status: data.status } : null)
    }

    return (
        <div className="p-5">
            <form onSubmit={handleSubmit(handleConfirmPayment)}>
                <Card className="@container/card bg-slate-50">
                    <CardHeader>
                        <CardDescription className="text-2xl">{sale?.customerName}</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            R$ {sale?.totalAmount},00
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="text-muted-foreground">
                            {sale?.status === "pending" ? "Pendente" : "Pago"}
                            <p>{sale?.quantity} - {sale?.recipe.title}</p>
                        </div>
                    </CardFooter>
                    <div className="w-6/12 pl-2">
                        <Button className="w-full p-5" {...register('status')} value={"paid"}>Confirmar pagamento</Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}