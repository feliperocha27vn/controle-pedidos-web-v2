import { House } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";

export function ButtonReturnHome() {
    const navigate = useNavigate()

    return (
        <Button onClick={() => navigate('/dashboard')}>
            <House />
            Início
        </Button>
    );
}