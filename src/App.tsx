import { Label } from "@radix-ui/react-label";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router";
import logoUmDoce from './assets/logo-um-doce.png';
import { Button } from "./components/ui/button";
import { Card, CardContent, CardFooter } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { api } from "./services/api";

interface AuthFormData {
  name: string;
  password: string;
}


export function App() {
  const { handleSubmit, register } = useForm<AuthFormData>()
  const navigate = useNavigate()

  async function handleLogin(data: AuthFormData) {
    const response = await api.post('/auth', data)
    const { message } = response.data
    if (message === 'Authenticated') {
      navigate('/dashboard')
    }
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-slate-800 gap-y-5 p-4">
      <img src={logoUmDoce} width={150} alt="Logo Um Doce" />
      <Card className="w-full max-w-sm bg-white">
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  {...register('name')}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label>Senha</Label>
                </div>
                <Input id="password" type="password" required {...register('password')} />
              </div>
            </div>
            <CardFooter className="flex-col gap-2">
              <Button variant={"outline"} className="w-6/12 mt-6">
                Entrar
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
