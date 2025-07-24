import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/services/api";
import { useEffect, useState } from "react";

interface ResponseRecipes {
    title: string;
    id: string;
    price: number;
}


export function ManageRecipes() {
    const [recipes, setRecipes] = useState<ResponseRecipes[]>([])

    useEffect(() => {
        api.get('/recipes')
            .then(response => setRecipes(response.data))
    }, []);
    return (
        <div className="p-5 space-y-4">
            {recipes.map((recipe) => (
                <Card key={recipe.id} className="@container/card bg-slate-50">
                    <CardHeader>
                        <CardDescription className="text-2xl">{recipe.title}</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            R$ {recipe.price},00
                        </CardTitle>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
}