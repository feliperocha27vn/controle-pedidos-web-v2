import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { api } from "@/services/api";
import { eachDayOfInterval, endOfWeek, format, getDay, startOfWeek, subWeeks } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig: ChartConfig = {
    desktop: {
        label: "Vendas",
        color: "var(--chart-7)",
    },
};

interface ResponseArray {
    count: number;
    day: string;
}

interface ChartDataItem {
    dayIndex: number;
    dayName: string;
    desktop: number;
}

export function ChartAreaDefault() {
    const [countOrdersDay, setCountOrdersDay] = useState<ResponseArray[]>([]);

    useEffect(() => {
        api.get("/orders/lastWeek").then((response) => {
            setCountOrdersDay(response.data);
        });
    }, []);

    const lastWeekStart = startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 });

    const allDays = eachDayOfInterval({ start: lastWeekStart, end: lastWeekEnd });

    const chartData: ChartDataItem[] = allDays
        .map((day) => {
            const found = countOrdersDay.find((item) => {
                const itemDate = new Date(item.day);
                return itemDate.toDateString() === day.toDateString();
            });

            return {
                dayIndex: getDay(day) === 0 ? 7 : getDay(day),
                dayName: format(day, "EEEE", { locale: ptBR }),
                desktop: found ? found.count : 0,
            };
        })
        .sort((a, b) => a.dayIndex - b.dayIndex);

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
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="dayIndex"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => {
                                const day = chartData.find((d) => d.dayIndex === value);
                                return day ? day.dayName.slice(0, 3).toUpperCase() : "";
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Area
                            dataKey="desktop"
                            type="monotone"
                            fill="var(--color-desktop)"
                            fillOpacity={0.4}
                            stroke="var(--color-desktop)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}