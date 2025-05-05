'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  ArrowUpRight,
  BarChart3,
  Lightbulb,
  ChevronUp,
} from "lucide-react";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Example: Replace with your real call data for current/past week
const callLineChartData = [
  { day: "Lun", current: 32, past: 20 },
  { day: "Martes", current: 28, past: 28 },
  { day: "Miercoles", current: 35, past: 22 },
  { day: "Jueves", current: 30, past: 25 },
  { day: "Vier", current: 40, past: 5 },
];


const callLineChartConfig = {
  current: {
    label: "Esta semana",
    color: "#3a46cf",
  },
  past: {
    label: "Semana pasada",
    color: "#3b3b3d",
  },
} satisfies ChartConfig;

export default function MainPage() {
  const [loading, setLoading] = useState(true);

  // Obtener información del usuario desde las cookies
  const isAuthenticated = Cookies.get('userAuthenticated') === 'true';
  // const userRole = Cookies.get('userRole');
  // const userId = Cookies.get('userId');
  // const organizationId = Cookies.get('organizationId');
  // const firstName = Cookies.get('firstName') || 'Usuario';

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      redirect('/login');
      return;
    }

    // Cargar datos específicos del usuario
    const loadUserData = async () => {
      try {
        // Obtener datos adicionales necesarios para la página
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
        setLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      {/* Área de contenido */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#000000]">
              Dashboard del cliente: Tec De Monterrey
            </h1>

            <p className="text-[#545454] mt-1">
              Echa un vistazo a las métricas que hemos recopilado para ti de tus ultimas llamadas de la semana.
            </p>
          </div>

          <Link href="/calls/analyze">
            <Button className="bg-[#000000] hover:bg-[#333333] text-white">
              Analizar Transcript
            </Button>
          </Link>
        </div>

        {/* Tarjetas de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#545454]">
                Llamadas de esta semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#000000]">12</div>
              <div className="flex items-center mt-1 text-xs text-green-600">
                <ChevronUp className="h-3 w-3 mr-1" />
                50% más que la semana pasada
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#545454]">
                Duración Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#000000]">28m</div>
              <div className="flex items-center mt-1 text-xs text-red-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                5min más que la semana pasada
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#545454]">
                Satisfacción del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#000000]">85%</div>
              <div className="flex items-center mt-1 text-xs text-green-600">
                <ChevronUp className="h-3 w-3 mr-1" />
                5% más que el mes pasado
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#545454]">
                Tiempo Ahorrado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#000000]">11h</div>
              <div className="flex items-center mt-1 text-xs text-[#545454]">
                Este mes hasta ahora
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actividad Reciente y Destacados */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Línea de Tiempo de Actividad Reciente */}
          <Card className="col-span-2 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-[#000000]">Actividad Reciente</CardTitle>
                <Button
                  variant="ghost"
                  className="text-[#000000] hover:bg-gray-100 text-xs"
                >
                  Ver Todo
                </Button>
              </div>
              <CardDescription className="text-[#545454]">
                Tus actividades de comunicación más recientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {[
                  {
                    type: "call",
                    title: "Llamada Iliana Ramirez",
                    description: "Asesoria en testing de software",
                    time: "Hace 1 hora",
                    insight: "Calificación de satisfacción del cliente: 7/10",
                    icon: <MessageSquare className="h-4 w-4 text-white" />,
                    bgColor: "bg-blue-500",
                  },
                  {
                    type: "report",
                    title: "Revisión BD modelo relacional",
                    description: "Mejora de rendimiento - TeamTrack - Backend",
                    time: "Ayer",
                    insight: "85% de sentimiento positivo detectado",
                    icon: <BarChart3 className="h-4 w-4 text-white" />,
                    bgColor: "bg-purple-500",
                  },
                  {
                    type: "insight",
                    title: "Github Actions Review",
                    description: "Aumento de discusiones técnicas",
                    time: "Hace 2 días",
                    insight: "Sugerencia: usar más ayudas visuales para temas técnicos y CI/CD",
                    icon: <Lightbulb className="h-4 w-4 text-white" />,
                    bgColor: "bg-amber-500",
                  },
                  {
                    type: "call",
                    title: "Weekly Sync con Elvia Rosas",
                    description: "Resolución de dudas sobre el proyecto",
                    time: "Hace 3 días",
                    insight: "Se necesita seguimiento en la migración del servidor",
                    icon: <MessageSquare className="h-4 w-4 text-white" />,
                    bgColor: "bg-blue-500",
                  },

                ].map((activity, index) => (
                  <div key={index} className="flex group">
                    <div className="mr-4 flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center ${activity.bgColor}`}
                      >
                        {activity.icon}
                      </div>
                      {index < 3 && <div className="w-px h-full bg-gray-200 mt-2"></div>}
                    </div>

                    <div className="flex-1">
                      {activity.title === "Llamada con Acme Corp" ? (
                        <Link href="/calls/report" className="block">
                          <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
                            <div className="flex justify-between mb-1">
                              <div className="font-medium text-[#000000]">
                                {activity.title}
                              </div>
                              <div className="text-xs text-[#a9a9a9]">{activity.time}</div>
                            </div>
                            <div className="text-sm text-[#545454] mb-2">
                              {activity.description}
                            </div>
                            <div className="text-xs bg-white text-[#545454] p-2 rounded border border-gray-200">
                              <Lightbulb className="h-3 w-3 text-amber-500 inline mr-1" />
                              {activity.insight}
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
                          <div className="flex justify-between mb-1">
                            <div className="font-medium text-[#000000]">
                              {activity.title}
                            </div>
                            <div className="text-xs text-[#a9a9a9]">{activity.time}</div>
                          </div>
                          <div className="text-sm text-[#545454] mb-2">
                            {activity.description}
                          </div>
                          <div className="text-xs bg-white text-[#545454] p-2 rounded border border-gray-200">
                            <Lightbulb className="h-3 w-3 text-amber-500 inline mr-1" />
                            {activity.insight}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Barras Laterales */}
          <div className="lg:col-span-1 space-y-6">


            {/* Grafica */}
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-[#000000] flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
                  Duración de llamadas por día
                </CardTitle>
                <CardDescription className="text-[#545454]">
                  Comparativo semana actual vs pasada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={callLineChartConfig} className="w-full h-[220px]">
                  <LineChart
                    accessibilityLayer
                    data={callLineChartData}
                    margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
                    width={340}
                    height={180}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      interval={0}
                    />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Line
                      dataKey="current"
                      type="monotone"
                      stroke="var(--color-current)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      dataKey="past"
                      type="monotone"
                      stroke="var(--color-past)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
              <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 font-medium leading-none">
                      La duración de las llamadas total subió un 27% esta semana. <TrendingUp className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>

            {/* Insights Inteligentes */}
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-[#000000] flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
                  Insights Inteligentes
                </CardTitle>
                <CardDescription className="text-[#545454]">
                  Recomendaciones generadas por IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-[#545454]">
                  Las dailys que superan los 10 minutos presentan un 15% menos de sentimiento positivo en comparación con las más cortas. Esto sugiere que extenderse demasiado puede desviar el enfoque y reducir la eficiencia del equipo.
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-[#545454]">
                  Las llamadas realizadas entre las 9 y 11 a.m. muestran un 23% más de sentimiento positivo que las de la tarde, lo que se traduce en un 15% más de *issues* resueltos durante la jornada.
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-[#545454]">
                  Comparando la duración de llamadas entre profesores y estudiantes, se recomienda que los estudiantes aumenten en un 20% el tiempo de conversación con sus profesores. Esto puede mejorar el rendimiento académico y la calidad de la retroalimentación.
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full text-blue-600 hover:bg-gray-50"
                >
                  Ver Todos los Insights
                </Button>
              </CardFooter>
            </Card>

            
          </div>
        </div>

        {/* Acceso Rápido */}
        {/* <div className="mt-8">
        <h2 className="text-xl font-bold text-[#000000] mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-colors cursor-pointer">
              <CardContent className="flex items-center p-6">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                  <PieChart className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-[#000000] mb-1">
                    Generar Informes
                  </h3>
                  <p className="text-sm text-[#545454]">
                    Crea informes analíticos personalizados
                  </p>
                </div>
                <ChevronRight className="ml-auto text-[#a9a9a9]" />
              </CardContent>
            </Card>


            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-colors cursor-pointer">
              <CardContent className="flex items-center p-6">
                <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-medium text-[#000000] mb-1">
                    Gestionar Clientes
                  </h3>
                  <p className="text-sm text-[#545454]">
                    Editar y actualizar información de clientes
                  </p>
                </div>
                <ChevronRight className="ml-auto text-[#a9a9a9]" />
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-colors cursor-pointer">
              <CardContent className="flex items-center p-6">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium text-[#000000] mb-1">Programar Llamada</h3>
                  <p className="text-sm text-[#545454]">
                    Programa una llamada con un cliente
                  </p>
                </div>
                <ChevronRight className="ml-auto text-[#a9a9a9]" />
              </CardContent>
            </Card>
          </div>
        </div> */}
      </main>
    </div>
  );
}