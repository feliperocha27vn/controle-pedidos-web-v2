import { ButtonReturnHome } from "@/components/button-return-home";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar-rac";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { api } from "@/services/api";
import { formatterMoney } from "@/utils/format-money";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronDownIcon, User } from "lucide-react";
import { useEffect, useState } from "react";
import type { DateValue } from "react-aria-components";



interface FetchOrdersByDelivery {
    id: string
    customerName: string
    deliveryDate: Date
    status: "pending" | "paid"
    totalAmount: number
}

export function ManageDelivery() {
    const [orders, setOrders] = useState<FetchOrdersByDelivery[]>([])
    const [date, setDate] = useState<DateValue | null>()


    useEffect(() => {
        api.get('/orders/delivery').then((response) => {
            setOrders(response.data)
        })
    }, [])

    useEffect(() => {
        if (!date) return
        const dateFormated = new Date(date.year, date.month - 1, date.day)
        const dateOnly = dateFormated.toISOString().split('T')[0];
        api.get('/orders/delivery/by-date', { params: { date: dateOnly } })
            .then(response => {
                setOrders(response.data)
            })
            .catch(error => {
                console.error('API error:', error)
            })
    }, [date])

    async function handleChangeDeliveryStatus(orderId: string) {
        await api.patch(`/order/change-status/${orderId}`)
        const ordersFiltered = orders.filter(order => order.id !== orderId);
        setOrders(ordersFiltered)
    }

    return (
        <div className="p-2 space-y-4">
            <div className="flex flex-col gap-y-2 w-5/12">
                <ButtonReturnHome />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Data das vendas
                            <ChevronDownIcon
                                className="-me-1 opacity-60"
                                size={16}
                                aria-hidden="true"
                            />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
                        <Calendar
                            className="rounded-md border p-2"
                            value={date}
                            onChange={setDate}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {orders?.map((order) => (
                <Card key={order.id} className="gap-2">
                    <CardHeader className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                            <User />
                            <CardTitle>{order.customerName}</CardTitle>
                        </div>
                        <Button onClick={() => handleChangeDeliveryStatus(order.id)}>Confirmar entrega</Button>
                    </CardHeader>
                    <div className="px-6 font-light">
                        <p>{formatterMoney.format(order.totalAmount)}</p>
                    </div>
                    <CardFooter className="flex items-center gap-x-4">
                        <div className="text-sm font-light">
                            <h2 className="font-semibold text-lg">Status</h2>
                            {order.status === 'pending' ? 'Pendente' : 'Pago'}
                        </div>
                        <div className="text-sm font-light">
                            <h2 className="font-semibold text-lg">Data entrega</h2>
                            {format(order.deliveryDate, 'ccc, ', {
                                locale: ptBR
                            })}
                            {format(order.deliveryDate, 'P', {
                                locale: ptBR
                            })}
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}