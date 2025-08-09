import { ButtonReturnHome } from "@/components/button-return-home";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar-rac";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { api } from "@/services/api";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { DateValue } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";



interface RecipesResponse {
    title: string;
    id: string;
}

interface CreateNewOrder {
    customerName: string;
    quantity: number;
    status: "pending" | "paid";
    idRecipe: string;
    deliveryDate: Date
}

export function NewSale() {
    const { handleSubmit, register, control } = useForm<CreateNewOrder>()
    const [recipes, setRecipes] = useState<RecipesResponse[]>([])
    const [showAlertDialog, setShowAlertDialog] = useState(false)
    const [date, setDate] = useState<DateValue | null>()
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/recipes').then(response => setRecipes(response.data))
    }, []);

    async function handleSubmitForm(data: CreateNewOrder) {
        const deliveryDate = date ? new Date(date.toString()) : new Date();
        const dataForm = { ...data, deliveryDate }
        const response = await api.post('/orders', dataForm);
        if (response.status === 201) {
            setShowAlertDialog(true)
        }
    }

    return (
        <div className="h-screen flex flex-col items-center p-4 space-y-4">
            <div className="w-full">
                <ButtonReturnHome />
            </div>
            <Card className="bg-slate-50 w-full">
                <form className="p-3 space-y-3" onSubmit={handleSubmit(handleSubmitForm)}>
                    <Label>Nome do cliente</Label>
                    <Input
                        id="customer-name"
                        type="text"
                        {...register('customerName')}
                        required
                    />
                    <Label>Quantidade</Label>
                    <Input
                        id="quantity"
                        type="text"
                        {...register('quantity')}
                        required
                    />
                    <Controller
                        name="idRecipe"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o que foi vendido" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {recipes.map(recipe => {
                                        return (
                                            <SelectItem key={recipe.id} value={recipe.id}>{recipe.title}</SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <div className="w-full grid grid-cols-2 gap-x-2">
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="pending">Pendente</SelectItem>
                                        <SelectItem value="paid">Pago</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="w-full">
                                <Button variant="outline">
                                    Data da entrega
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
                    <Button>
                        Adicionar venda
                    </Button>
                    <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Sucesso!</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Venda realizada com sucesso!
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction onClick={() => setShowAlertDialog(false)}>
                                    Fazer nova venda
                                </AlertDialogAction>
                                <AlertDialogAction className="bg-transparent text-black shadow-2xl" onClick={() => navigate('/dashboard')}>
                                    Voltar para o início
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </form>
            </Card>
        </div >
    );
}