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
import { Card } from "@/components/ui/card";
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
import { useEffect, useState } from "react";
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
}

export function NewSale() {
    const { handleSubmit, register, control } = useForm<CreateNewOrder>()
    const [recipes, setRecipes] = useState<RecipesResponse[]>([])
    const [showAlertDialog, setShowAlertDialog] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/recipes').then(response => setRecipes(response.data))
    }, []);

    async function handleSubmitForm(data: CreateNewOrder) {
        const response = await api.post('/orders', data);
        if (response.status === 201) {
            setShowAlertDialog(true)
        }
    }

    return (
        <div className="h-screen flex justify-center items-center p-4">
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
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o status da venda" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="pending">Pendente</SelectItem>
                                    <SelectItem value="paid">Pago</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
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
                                <AlertDialogAction className="bg-transparent text-black border-2" onClick={() => navigate('/dashboard')}>
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