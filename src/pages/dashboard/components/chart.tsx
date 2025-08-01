import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { api } from "@/services/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

export const description = "A simple area chart"

const chartConfig = {
    desktop: {
        label: "Vendas",
        color: "var(--chart-7)",
    },
} satisfies ChartConfig

interface ResponseArray {
    count: number
    day: Date
}


export function ChartAreaDefault() {
    const [countOrdersDay, setCountOrdersDay] = useState<ResponseArray[]>([])

    useEffect(() => {
        api.get('/orders/lastWeek').then(response => {
            setCountOrdersDay(response.data);
        })
    }, []);

    const chartData = [
        ...countOrdersDay.map((item) => ({
            month: format(new Date(item.day), 'EEEE', { locale: ptBR }).toUpperCase(),
            desktop: item.count
        }))
    ]

    return (
        <Card className="bg-slate-50">
            <CardHeader>
                <CardTitle>Vendas da semana passada</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value: string) => value.slice(0, 3).toUpperCase()}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="var(--color-desktop)"
                            fillOpacity={0.4}
                            stroke="var(--color-desktop)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
