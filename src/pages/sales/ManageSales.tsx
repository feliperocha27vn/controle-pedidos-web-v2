import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { api } from "@/services/api";
import { format } from 'date-fns';
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
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
    const [totalPages, setTotalPages] = useState<number>(0)
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        api.get(`/orders/${page}`).then(response => setSales(response.data.orders))
        api.get(`/orders/${page}`).then(response => setTotalPages(response.data.totalPages))
    }, [page]);

    async function handleSearch(search: string) {
        const response = await api.get('/orders/search', {
            params: { search }
        })

        setSales(response.data)
    }

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
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch(search)}
                    />
                    <button type="button" onClick={() => handleSearch(search)} className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-2">
                        <Search size={16} />
                    </button>
                </div>
            </div>
            {sales.filter(sale => sale.customerName.toLowerCase().includes(search.toLowerCase())).map((sale) => (
                <Card key={sale.id} className="@container/card bg-slate-50" onClick={() => navigate(`/sale/${sale.id}`)}>
                    <CardHeader>
                        <div className="w-full flex justify-between items-center">
                            <CardDescription className="text-2xl">{sale.customerName}</CardDescription>
                            <CardDescription className="text-lg">{format(sale.createdAt, 'dd/MM')}</CardDescription>
                        </div>
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
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={() => setPage(page - 1)} />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink href="#" onClick={() => setPage(index + 1)}>
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext onClick={() => setPage(page + 1)} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}