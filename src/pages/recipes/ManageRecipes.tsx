import { ButtonReturnHome } from "@/components/button-return-home";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface ResponseRecipes {
    title: string
    id: string
    price: number
    isActivite: boolean
}


export function ManageRecipes() {
    const [recipes, setRecipes] = useState<ResponseRecipes[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/recipes')
            .then(response => setRecipes(response.data))
    }, []);


    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })

    async function handleDeleteRecipe(idRecipe: string) {
        try {
            await api.delete(`/recipes/${idRecipe}`);
            setRecipes((prevRecipes) => prevRecipes.filter(recipe => recipe.id !== idRecipe));
        } catch (error) {
            console.error("Error deleting recipe:", error);
        }
    }

    return (
        <div className="p-5 space-y-4">
            <ButtonReturnHome />
            {recipes.map((recipe) => (
                <Card key={recipe.id} className={`@container/card bg-slate-50 ${recipe.isActivite ? 'block' : 'hidden'}`}>
                    <CardHeader>
                        <CardDescription className="text-2xl">{recipe.title}</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {formatter.format(recipe.price)}
                        </CardTitle>
                    </CardHeader>
                    <div className="pl-6 space-x-3 mt-3">
                        <Button variant={'destructive'} onClick={() => handleDeleteRecipe(recipe.id)}>Excluir</Button>
                        <Button variant={'default'} onClick={() => navigate(`/recipes/edit/${recipe.id}`)}>Editar</Button>
                    </div>
                </Card>
            ))}
        </div>
    );
}