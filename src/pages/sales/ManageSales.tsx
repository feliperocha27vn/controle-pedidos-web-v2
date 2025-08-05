import { ButtonReturnHome } from "@/components/button-return-home";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar-rac";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { format } from 'date-fns';
import { ChevronDownIcon, ClockAlert, Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { DateValue } from "react-aria-components";
import { useNavigate } from "react-router";

interface Order {
    id: string;
    customerName: string;
    quantity: number;
    totalAmount: number;
    status: "pending" | "paid";
    createdAt: string;
    recipe: {
        title: string
    }
}

export function ManageSales() {
    const [sales, setSales] = useState<Order[]>([])
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [date, setDate] = useState<DateValue | null>()

    useEffect(() => {
        api.get('/orders').then(response => setSales(response.data.orders))
    }, []);

    useEffect(() => {
        if (!date) return
        const dateFormated = new Date(date.year, date.month - 1, date.day)
        const dateOnly = dateFormated.toISOString().split('T')[0];
        api.get('/orders-by-date', { params: { date: dateOnly } }).then(response => setSales(response.data.orders))
    }, [date])

    async function handleSearch(search: string) {
        const response = await api.get('/orders/search', {
            params: { search }
        })

        setSales(response.data)
    }

    async function handleFiltered() {
        const response = await api.get('/orders/pending-filter')
        setSales(response.data)
    }

    const formatterMoney = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return (
        <div className="p-5 space-y-4">
            <ButtonReturnHome />
            <div className="*:not-first:mt-2">
                <div className="flex flex-col space-y-0.5">
                    <Label>Pesquise o cliente desejado</Label>
                    <Label className="font-light">Ultimas 10 vendas</Label>
                </div>
                <div className="relative">
                    <Input
                        className="pe-11"
                        placeholder="Pesquisar..."
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch(search)}
                    />
                    <button type="button" onClick={() => handleSearch(search)} className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-2">
                        <Search size={16} />
                    </button>
                </div>
            </div>
            <div>
                <div className="flex items-center space-x-2">
                    <Button variant={'outline'} onClick={() => handleFiltered()}>
                        <ClockAlert />
                        Pendentes
                    </Button>
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
            </div>
            {sales?.map((sale) => (
                <Card key={sale.id} className="@container/card bg-slate-50" onClick={() => navigate(`/sale/${sale.id}`)}>
                    <CardHeader>
                        <div className="w-full flex justify-between items-center">
                            <CardDescription className="text-2xl">{sale.customerName}</CardDescription>
                            <CardDescription className="text-lg">{format(sale.createdAt, 'dd/MM')}</CardDescription>
                        </div>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {formatterMoney.format(sale.totalAmount)}
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