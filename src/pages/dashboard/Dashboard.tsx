import { Button } from "@/components/ui/button";
import { Car, ChefHat, LucideShoppingBag, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { CardPaidSales } from "./components/card-paid-sales";
import { CardPedingSales } from "./components/card-pending-sales";
import { CardTotalSales } from "./components/card-total-sales";
import { ChartAreaDefault } from "./components/chart";

export function Dashboard() {
    const navigate = useNavigate()
    return (
        <div className="p-3 space-y-5">
            <div className="grid grid-cols-2 gap-2">
                <Button variant={"outline"} onClick={() => navigate('/new-sale')}><Plus /> Nova venda</Button>
                <Button variant={"outline"} onClick={() => navigate('/manage-sales')}><LucideShoppingBag /> Gerenciar vendas</Button>
                <Button variant={"outline"} onClick={() => navigate('/new-recipe')} ><Plus /> Nova receita</Button>
                <Button variant={"outline"} onClick={() => navigate('/manage-recipes')}><ChefHat /> Gerenciar receitas</Button>
                <Button variant={"outline"} onClick={() => navigate('/manage-delivery')}><Car /> Gerenciar entregas</Button>
            </div>
            <CardTotalSales />
            <CardPedingSales />
            <CardPaidSales />
            <ChartAreaDefault />
        </div>
    );
}