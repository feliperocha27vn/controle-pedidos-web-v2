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
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

interface RecipeFormData {
    title: string;
    price: string;
}

interface ResponseRecipes {
    title: string;
    id: string;
    price: number;
}

export function EditRecipe() {
    const { handleSubmit, register, watch, reset } = useForm<RecipeFormData>({
        defaultValues: {
            title: '',
            price: ''
        }
    })
    const [showAlertDialog, setShowAlertDialog] = useState(false)
    const [recipe, setRecipe] = useState<ResponseRecipes>()
    const navigate = useNavigate()
    const { idRecipe } = useParams()

    useEffect(() => {
        api.get(`/recipe/${idRecipe}`)
            .then(response => setRecipe(response.data))
    }, [idRecipe])

    useEffect(() => {
        if (recipe) {
            reset({
                title: recipe.title,
                price: recipe.price.toString()
            });
        }
    }, [recipe, reset]);

    watch('title');

    async function handleSubmitFormUpdate(data: RecipeFormData) {
        const response = await api.put(`/recipes/${idRecipe}`, data)

        if (response.status === 200) {
            setShowAlertDialog(true)
        }
    }


    return (
        <div className="h-screen flex justify-center items-center p-4">
            <Card className="bg-slate-50 w-full">
                <form className="p-3 space-y-3" onSubmit={handleSubmit(handleSubmitFormUpdate)}>
                    <Label>Nome da receita</Label>
                    <Input
                        id="title"
                        type="text"
                        {...register('title')}
                        required
                    />
                    <Label>Preço</Label>
                    <Input
                        id="price"
                        type="text"
                        {...register('price')}
                        required
                    />
                    <Button>
                        Editar receita
                    </Button>
                    <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Sucesso!</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Receita editada com sucesso!
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction className="bg-transparent text-black shadow-2xl " onClick={() => navigate('/dashboard')}>
                                    Voltar para o início
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </form>
            </Card>
        </div >

    )
}