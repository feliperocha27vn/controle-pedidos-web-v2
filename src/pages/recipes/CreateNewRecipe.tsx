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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

interface RecipeFormData {
    title: string;
    price: string;
}

export function CreateNewRecipe() {
    const { handleSubmit, register } = useForm<RecipeFormData>()
    const [showAlertDialog, setShowAlertDialog] = useState(false)
    const navigate = useNavigate()

    async function handleSubmitForm(data: RecipeFormData) {
        const response = await api.post('/recipes', data)

        if (response.status === 201) {
            setShowAlertDialog(true)
        }
    }


    return (
        <div className="h-screen flex justify-center items-center p-4">
            <Card className="bg-slate-50 w-full">
                <form className="p-3 space-y-3" onSubmit={handleSubmit(handleSubmitForm)}>
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
                        Criar nova receita
                    </Button>
                    <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Sucesso!</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Receita criada com sucesso!
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction onClick={() => setShowAlertDialog(false)}>
                                    Criar nova receita
                                </AlertDialogAction>
                                <AlertDialogAction className="bg-transparent" onClick={() => navigate('/dashboard')}>
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