"use client"

import * as React from "react"
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Cell, Bar, BarChart, CartesianGrid, XAxis, YAxis, Label, Pie, PieChart, LabelList } from "recharts"
import { ClientCard } from "@/components/ClientCard";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export default function AdminPage() {
  const { firstName, userRole } = useUser();
  const router = useRouter();

  // Add role-based access control
  React.useEffect(() => {
    // If user is not an admin, redirect to user page
    if (userRole !== 'admin') {
      router.push('/user');
    }
  }, [userRole, router]);

  // If still checking permissions or redirecting, show loading
  if (userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Verificando permisos...</p>
      </div>
    );
  }


  // Track selected client for histogram
  const [selectedClient, setSelectedClient] = React.useState<keyof typeof chartConfig | null>(null);

  // Helper to get the correct key for ClientCard title
  const clientKeyMap: Record<string, keyof typeof chartConfig> = {
    "CEMEX": "Cemex",
    "Tec de Monterrey": "TecDeMonterrey",
    "Microsoft": "Microsoft",
    "Canva": "Canva",
  };

  const activeChart = selectedClient || "Cemex";

  const chartData = [
    { date: "2024-04-01", Cemex: 22, TecDeMonterrey: 15, Microsoft: 10, Canva: 8 },
    { date: "2024-04-02", Cemex: 9, TecDeMonterrey: 18, Microsoft: 12, Canva: 7 },
    { date: "2024-04-03", Cemex: 16, TecDeMonterrey: 12, Microsoft: 14, Canva: 6 },
    { date: "2024-04-04", Cemex: 24, TecDeMonterrey: 26, Microsoft: 11, Canva: 9 },
    { date: "2024-04-05", Cemex: 37, TecDeMonterrey: 29, Microsoft: 13, Canva: 10 },
    { date: "2024-04-06", Cemex: 30, TecDeMonterrey: 34, Microsoft: 15, Canva: 12 },
    { date: "2024-04-07", Cemex: 24, TecDeMonterrey: 18, Microsoft: 10, Canva: 8 },
    { date: "2024-04-08", Cemex: 40, TecDeMonterrey: 32, Microsoft: 17, Canva: 11 },
    { date: "2024-04-09", Cemex: 5, TecDeMonterrey: 11, Microsoft: 8, Canva: 4 },
    { date: "2024-04-10", Cemex: 26, TecDeMonterrey: 19, Microsoft: 14, Canva: 7 },
    { date: "2024-04-11", Cemex: 18, TecDeMonterrey: 22, Microsoft: 12, Canva: 9 },
    { date: "2024-04-12", Cemex: 20, TecDeMonterrey: 25, Microsoft: 15, Canva: 10 },
    { date: "2024-04-13", Cemex: 28, TecDeMonterrey: 30, Microsoft: 20, Canva: 14 },
    { date: "2024-04-14", Cemex: 35, TecDeMonterrey: 28, Microsoft: 18, Canva: 12 },
    { date: "2024-04-15", Cemex: 40, TecDeMonterrey: 35, Microsoft: 25, Canva: 15 },

  ];

  const pieChartData = [
    { browser: "Cemex", visitors: 30, fill: "#f87a7a" },
    { browser: "Tec de Monterrey", visitors: 20, fill: "#8facf6" },
    { browser: "Microsoft", visitors: 34, fill: "#40a02d" },
    { browser: "Canva", visitors: 12, fill: "#2da084" },
  ]

  const chartConfig = {
    Cemex: {
      label: "Cemex",
      color: "#f87a7a",
    },
    TecDeMonterrey: {
      label: "Tec de Monterrey",
      color: "#8facf6",
    },
    Microsoft: {
      label: "Microsoft",
      color: "#40a02d",
    },
    Canva: {
      label: "Canva",
      color: "#2da084",
    },
  } satisfies ChartConfig;

  const pieChartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
    edge: {
      label: "Edge",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig


  const customBarChartData = [
    { month: "CEMEX", desktop: 75, mobile: 80, fill: "#f87a7a" },
    { month: "Tec De Monterrey", desktop: 50, mobile: 200, fill: "#8facf6" },
    { month: "Microsoft", desktop: 60, mobile: 120, fill: "#40a02d" },
    { month: "Canva", desktop: 73, mobile: 190, fill: "#2da084" },
  ];


  const customBarChartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
    label: {
      color: "hsl(var(--background))",
    },
  } satisfies ChartConfig;


  const total = React.useMemo(
    () => ({
      Cemex: chartData.reduce((acc, curr) => acc + (curr.Cemex || 0), 0),
      TecDeMonterrey: chartData.reduce((acc, curr) => acc + (curr.TecDeMonterrey || 0), 0),
      Microsoft: chartData.reduce((acc, curr) => acc + (curr.Microsoft || 0), 0),
      Canva: chartData.reduce((acc, curr) => acc + (curr.Canva || 0), 0),
    }),
    [chartData]
  );


  const totalVisitors = React.useMemo(() => {
    return pieChartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])


  const clients = [
    {
      title: "CEMEX",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Cemex_logo.svg/1200px-Cemex_logo.svg.png",
    },
    {
      title: "Tec de Monterrey",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/Logo_del_ITESM.svg",
    },
    {
      title: "Microsoft",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/480px-Microsoft_logo.svg.png",
    },
    {
      title: "Canva",
      imageUrl: "https://logos-world.net/wp-content/uploads/2020/02/Canva-Logo.png",
    },
    {
      title: "Github",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    },
    {
      title: "Apple",
      imageUrl: "https://1000logos.net/wp-content/uploads/2017/02/Apple-Logosu.png",
    },
    {
      title: "Softtek",
      imageUrl: "https://store-images.s-microsoft.com/image/apps.46108.e6eef51b-0a08-447d-8f6f-f38f64c33991.89e68949-5a8c-4be0-8616-0c5725d075df.ca89b243-2a09-458a-b706-733fa84f8227",
    },
    // ...add more if needed
  ];

  // Carousel logic
  const CARDS_PER_VIEW = 6;
  const [carouselIndex, setCarouselIndex] = React.useState(0);

  const totalCarousels = Math.ceil(clients.length / CARDS_PER_VIEW);

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev === 0 ? totalCarousels - 1 : prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev === totalCarousels - 1 ? 0 : prev + 1));
  };

  const visibleClients = clients.slice(
    carouselIndex * CARDS_PER_VIEW,
    carouselIndex * CARDS_PER_VIEW + CARDS_PER_VIEW
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-4xl font-bold">Bienvenido, {firstName} 👋</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10">
          {/* Columna Izquierda (Histograma + Clientes) */}
          <div className="lg:col-span-2 space-y-8">





            {/* Clientes */}
            <div className="w-full">
              <p className="text-3xl mb-4">Clientes</p>
              <div className="flex justify-between items-center">
                <ChevronLeft
                  className="cursor-pointer"
                  onClick={handlePrev}
                />
                <div className="flex flex-wrap gap-4 justify-start flex-1">
                  {visibleClients.map((client) => {
                    const key = clientKeyMap[client.title];
                    const isSelected = selectedClient === key;
                    return (
                      <button
                        key={`${client.title}-${carouselIndex}`}
                        onClick={() => {
                          if (isSelected) {
                            router.push("/user");
                          } else {
                            setSelectedClient(key);
                          }
                        }}
                        className="relative rounded-xl transition-transform"
                        style={{
                          transform: isSelected ? "translateY(2px) scale(0.98)" : "none",
                        }}
                      >
                        <ClientCard
                          imageUrl={client.imageUrl}
                          title={client.title}
                        />
                        {isSelected && (
                          <span
                            className="absolute inset-0 bg-black/10 rounded-xl pointer-events-none"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
                <ChevronRight
                  className="cursor-pointer"
                  onClick={handleNext}
                />
              </div>
              {totalCarousels > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  {Array.from({ length: totalCarousels }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCarouselIndex(index)}
                      className={`w-2 h-2 rounded-full ${index === carouselIndex ? "bg-primary" : "bg-gray-300"
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Histograma */}
            <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-0 border shadow-sm w-full">
              <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                  <CardTitle>Histograma</CardTitle>
                  <CardDescription>
                    Histograma de llamadas atendidas por cliente en Abril.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-2 sm:p-6">
                <ChartContainer
                  config={chartConfig}
                  className="aspect-auto h-[100px] w-full"
                >
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    margin={{ left: 12, right: 12 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          className="w-[150px]"
                          nameKey={activeChart}
                          labelFormatter={(value) =>
                            new Date(value).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          }
                        />
                      }
                    />
                    <Bar
                      dataKey={activeChart}
                      fill={chartConfig[activeChart].color}
                      name={chartConfig[activeChart].label}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>






          {/* Columna Derecha (Gráficas) */}
          <div className="space-y-8">
            {/* Gráfica de Barras */}
            <Card className="gap-5 bg-card text-card-foreground flex flex-col rounded-xl border py-3 shadow-sm w-full">
              <CardHeader>
                <CardTitle>Atención de clientes</CardTitle>
                <CardDescription>
                  Nivel de atención requerido por clientes en Abril.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={customBarChartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={customBarChartData}
                    layout="vertical"
                    margin={{ right: 16 }}
                    width={260}
                    height={180}
                  >
                    <CartesianGrid horizontal={false} />
                    <YAxis
                      dataKey="month"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                      hide
                    />
                    <XAxis dataKey="desktop" type="number" hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Bar dataKey="desktop" layout="vertical" radius={4}>
                      <LabelList
                        dataKey="month"
                        position="insideLeft"
                        offset={8}
                        className="fill-foreground"
                        fontSize={12}
                      />
                      <LabelList
                        dataKey="desktop"
                        position="right"
                        offset={8}
                        className="fill-foreground"
                        fontSize={12}
                      />
                      {customBarChartData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>





            {/* Gráfica Pie */}
            <Card className="gap-0 bg-card text-card-foreground flex flex-col rounded-xl border py-3 shadow-sm w-full">
              <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center px-6 py-4">
                  <CardTitle>Llamadas totales analizadas</CardTitle>
                  <CardDescription>
                    Numero de llamadas analizadas en Abril.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="flex justify-center items-center sm:p-6">
                <ChartContainer
                  config={pieChartConfig}
                  className="aspect-square w-[180px] h-[180px]"
                >
                  <PieChart width={180} height={180}>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={pieChartData}
                      dataKey="visitors"
                      nameKey="browser"
                      innerRadius={50}
                      outerRadius={75}
                      strokeWidth={3}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-lg font-bold"
                                >
                                  {totalVisitors.toLocaleString()}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 18}
                                  className="fill-muted-foreground text-sm"
                                />
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}