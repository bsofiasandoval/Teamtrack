"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Clock,
  Download,
  Calendar,
  ChevronLeft,
  Share2,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Radio,
  FileText,
  CalendarClock,
  Clipboard,
  Bookmark,
  MoreHorizontal,
  Star,
  TrendingUp,
} from "lucide-react";

export default function CallReport() {
  const [activeTab, setActiveTab] = useState("overview");

  // Datos de la llamada
  const callData = {
    id: "call-2024-04-01-01",
    client: "Acme Corporation",
    project: "Proyecto de Rediseño de Sitio Web",
    date: "1 de Abril, 2025",
    startTime: "10:00 AM",
    duration: "45 minutos",
    participants: [
      { name: "Jane Doe", role: "Gerente de Producto", company: "Tu Empresa" },
      { name: "John Smith", role: "Director de Diseño", company: "Acme Corp" },
      { name: "Alice Johnson", role: "Líder de Proyecto", company: "Acme Corp" },
    ],
    overallSentiment: 85,
    clientSentiment: 82,
    yourTeamSentiment: 88,
    keyTopics: [
      { name: "Cronograma", mentions: 14, sentiment: 72 },
      { name: "Presupuesto", mentions: 9, sentiment: 65 },
      { name: "Diseño", mentions: 22, sentiment: 91 },
      { name: "Funcionalidades", mentions: 18, sentiment: 88 },
      { name: "Pruebas de Usuario", mentions: 7, sentiment: 79 },
    ],
    speakingRatio: {
      client: 42,
      yourTeam: 58,
    },
  };

  // Función para obtener el color del sentimiento
  const getSentimentColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getBgSentimentColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-amber-100";
    return "bg-red-100";
  };

  // Traduce el nivel de sentimiento
  const getSentimentLevel = (score: number) => {
    if (score >= 80) return "Positivo";
    if (score >= 60) return "Neutral";
    return "Negativo";
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb]">

      {/* Content Area */}
      <main className="container mx-auto px-6 py-8">
        {/* Back navigation and actions */}
        <div className="flex justify-between items-center mb-6">
            <Button asChild variant="ghost" className="text-[#545454] hover:text-[#000000] hover:bg-gray-100">
            <a href="/user">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Regresar al Dashboard
            </a>
            </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-gray-200 text-[#000000] hover:bg-gray-100"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Compartir
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-gray-200 text-[#000000] hover:bg-gray-100"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-white border-gray-200 text-[#000000]"
                >
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white border-gray-200 text-[#000000]"
              >
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Guardar como Plantilla
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Programar Seguimiento
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                  <FileText className="mr-2 h-4 w-4" />
                  Imprimir Informe
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Call Header */}
        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#000000] mb-1">
                  {callData.client}: {callData.project}
                </h1>
                <div className="flex items-center space-x-5 text-[#545454] text-sm">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {callData.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {callData.startTime} ({callData.duration})
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border-blue-200 bg-blue-50 text-blue-700"
                  >
                    <Radio className="h-3 w-3 text-blue-500 mr-1" />
                    Grabada
                  </Badge>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-[#545454] mb-1">
                  Sentimiento General
                </div>
                <div className="flex items-center justify-end">
                  <div className="text-2xl font-bold text-[#000000] mr-2">
                    {callData.overallSentiment}%
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getBgSentimentColor(
                      callData.overallSentiment
                    )} ${getSentimentColor(callData.overallSentiment)}`}
                  >
                    {getSentimentLevel(callData.overallSentiment)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Participants */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="text-sm text-[#545454] mr-2">Participantes:</div>
          {callData.participants.map((participant, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-7 w-7 mr-1">
                <AvatarFallback
                  className={
                    participant.company === "Tu Empresa"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-[#545454]"
                  }
                >
                  {participant.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm text-[#000000]">{participant.name}</div>
              {index < callData.participants.length - 1 && (
                <div className="mx-2 text-gray-300">•</div>
              )}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-white border-b border-gray-200 w-full justify-start rounded-none p-0 h-auto">
            <TabsTrigger
              value="overview"
              className="px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-[#000000] rounded-none"
            >
              Resumen
            </TabsTrigger>
            <TabsTrigger
              value="transcript"
              className="px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-[#000000] rounded-none"
            >
              Transcripción
            </TabsTrigger>
            <TabsTrigger
              value="insights"
              className="px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-[#000000] rounded-none"
            >
              Análisis IA
            </TabsTrigger>
            <TabsTrigger
              value="actions"
              className="px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-[#000000] rounded-none"
            >
              Acciones
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Key Metrics */}
              <div className="lg:col-span-2 space-y-6">
                {/* Sentiment Analysis Card */}
                <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-[#000000]">
                      Análisis de Sentimiento
                    </CardTitle>
                    <CardDescription className="text-[#545454]">
                      Tono emocional detectado durante la conversación
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="text-[#545454]">
                            Cliente
                          </span>
                          <span
                            className={getSentimentColor(
                              callData.clientSentiment
                            )}
                          >
                            {callData.clientSentiment}% - {getSentimentLevel(callData.clientSentiment)}
                          </span>
                        </div>
                        <Progress
                          value={callData.clientSentiment}
                          className="h-2 bg-gray-100"
                        >
                          <div
                            className={`h-full transition-all ${
                              callData.clientSentiment >= 80
                                ? "bg-green-500"
                                : callData.clientSentiment >= 60
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${callData.clientSentiment}%` }}
                          />
                        </Progress>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="text-[#545454]">
                            Tu Equipo
                          </span>
                          <span
                            className={getSentimentColor(
                              callData.yourTeamSentiment
                            )}
                          >
                            {callData.yourTeamSentiment}% - {getSentimentLevel(callData.yourTeamSentiment)}
                          </span>
                        </div>
                        <Progress
                          value={callData.yourTeamSentiment}
                          className="h-2 bg-gray-100"
                        >
                          <div
                            className={`h-full transition-all ${
                              callData.yourTeamSentiment >= 80
                                ? "bg-green-500"
                                : callData.yourTeamSentiment >= 60
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${callData.yourTeamSentiment}%` }}
                          />
                        </Progress>
                      </div>

                      <h3 className="font-medium text-[#000000] mt-4 mb-2">Emociones Detectadas</h3>
                      
                      <div className="grid grid-cols-5 gap-3">
                        {[
                          {
                            emotion: "Entusiasmo",
                            description: "Emoción positiva, interés elevado",
                            intensity: "Alta", // Alta, Media, Baja
                            value: 83, // Porcentaje de intensidad
                            icon: <Heart className="h-4 w-4" />,
                          },
                          {
                            emotion: "Acuerdo",
                            description: "Conformidad con las propuestas",
                            intensity: "Alta",
                            value: 75,
                            icon: <ThumbsUp className="h-4 w-4" />,
                          },
                          {
                            emotion: "Confusión",
                            description: "Dudas sobre aspectos técnicos",
                            intensity: "Baja",
                            value: 24,
                            icon: <AlertTriangle className="h-4 w-4" />,
                          },
                          {
                            emotion: "Incertidumbre",
                            description: "Sobre plazos y cronograma",
                            intensity: "Muy Baja",
                            value: 10,
                            icon: <Clock3 className="h-4 w-4" />,
                          },
                          {
                            emotion: "Frustración",
                            description: "Momentos puntuales",
                            intensity: "Mínima",
                            value: 5,
                            icon: <ThumbsDown className="h-4 w-4" />,
                          },
                        ].map((emotion, index) => (
                          <div
                            key={index}
                            className="text-center p-3 rounded-lg bg-gray-50 border border-gray-100"
                          >
                            <div
                              className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                                emotion.emotion === "Confusión" || 
                                emotion.emotion === "Incertidumbre" || 
                                emotion.emotion === "Frustración"
                                  ? getBgSentimentColor(100 - emotion.value)
                                  : getBgSentimentColor(emotion.value)
                              }`}
                            >
                              {emotion.icon}
                            </div>
                            <div className="text-xs font-medium text-[#000000] mb-1">
                              {emotion.emotion}
                            </div>
                            <div className="text-xs mb-1 text-[#545454]">
                              {emotion.intensity}
                            </div>
                            <div
                              className={`text-sm font-medium ${
                                emotion.emotion === "Confusión" || 
                                emotion.emotion === "Incertidumbre" || 
                                emotion.emotion === "Frustración"
                                  ? getSentimentColor(100 - emotion.value)
                                  : getSentimentColor(emotion.value)
                              }`}
                            >
                              {emotion.value}%
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 text-sm text-[#545454]">
                        <p>
                          <span className="font-medium text-[#000000]">
                            Análisis:
                          </span>{" "}
                          La llamada mantuvo un sentimiento positivo durante toda la
                          conversación, con altos niveles de entusiasmo y acuerdo.
                          Se detectó una ligera confusión durante las discusiones
                          técnicas (13:22 - 15:04), pero se resolvió rápidamente.
                          La incertidumbre sobre los plazos fue mínima y no representó
                          un obstáculo para la comunicación general.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Topics Card */}
                <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-[#000000]">Temas Principales</CardTitle>
                    <CardDescription className="text-[#545454]">
                      Asuntos más discutidos y su sentimiento asociado
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {callData.keyTopics.map((topic, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                        >
                          <div className="flex justify-between mb-2">
                            <div className="font-medium text-[#000000]">
                              {topic.name}
                            </div>
                            <div className="text-sm text-[#545454]">
                              {topic.mentions} menciones
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-1">
                            <div className="w-full mr-4">
                              <Progress
                                value={topic.sentiment}
                                className="h-2 bg-gray-200"
                              >
                                <div
                                  className={`h-full transition-all ${
                                    topic.sentiment >= 80
                                      ? "bg-green-500"
                                      : topic.sentiment >= 60
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${topic.sentiment}%` }}
                                />
                              </Progress>
                            </div>
                            <div
                              className={`text-sm ${getSentimentColor(
                                topic.sentiment
                              )}`}
                            >
                              {topic.sentiment}%
                            </div>
                          </div>

                          {/* Notas contextuales para cada tema */}
                          <div className="text-xs text-[#545454] mt-1">
                            {topic.name === "Cronograma" &&
                              "El cliente expresó cierta preocupación sobre los plazos del proyecto (17:05)"}
                            {topic.name === "Presupuesto" &&
                              "Discusión sobre restricciones presupuestarias y asignaciones"}
                            {topic.name === "Diseño" &&
                              "Recepción muy positiva a las maquetas de diseño presentadas"}
                            {topic.name === "Funcionalidades" &&
                              "Acuerdo sobre las funciones principales y su priorización"}
                            {topic.name === "Pruebas de Usuario" &&
                              "Breve discusión sobre el calendario de pruebas"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Speaking Patterns & Insights */}
              <div className="lg:col-span-1 space-y-6">
                {/* Speaking Patterns */}
                <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-[#000000]">
                      Patrones de Conversación
                    </CardTitle>
                    <CardDescription className="text-[#545454]">
                      Análisis de participación en la conversación
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-44 h-44 mx-auto mb-4 relative">
                      <div className="w-full h-full rounded-full bg-gray-200">
                        <div
                          className="absolute top-0 left-0 bg-blue-500 rounded-full overflow-hidden"
                          style={{
                            width: "100%",
                            height: "100%",
                            clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, 50% 50%, 50% 50%, 50% 50%)`,
                            transform: `rotate(${callData.speakingRatio.yourTeam}deg)`,
                          }}
                        ></div>
                        <div
                          className="absolute top-0 left-0 bg-purple-500 rounded-full overflow-hidden"
                          style={{
                            width: "100%",
                            height: "100%",
                            clipPath: `polygon(50% 50%, 50% 0, ${
                              callData.speakingRatio.client > 50
                                ? "100% 0, 100% 100%, 0 100%, 0 0"
                                : "100% 0"
                            }, 50% 50%)`,
                          }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-white border border-gray-100 flex items-center justify-center text-center">
                            <div>
                              <div className="text-xs text-[#545454]">
                                Proporción
                              </div>
                              <div className="text-lg font-bold text-[#000000]">
                                {callData.speakingRatio.yourTeam}:
                                {callData.speakingRatio.client}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <div className="text-sm text-[#000000]">Tu Equipo</div>
                      </div>
                      <div className="text-sm font-medium text-[#000000]">
                        {callData.speakingRatio.yourTeam}%
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                        <div className="text-sm text-[#000000]">Cliente</div>
                      </div>
                      <div className="text-sm font-medium text-[#000000]">
                        {callData.speakingRatio.client}%
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-[#545454] bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <p>
                        Tu equipo tuvo un tiempo de habla ligeramente mayor, pero
                        mantuvo un buen equilibrio con la participación del cliente.
                        No se detectaron interrupciones significativas.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Quick Insights */}
                <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-[#000000] flex items-center">
                      <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
                      Perspectivas Rápidas
                    </CardTitle>
                    <CardDescription className="text-[#545454]">
                      Patrones y recomendaciones detectados por IA
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                      <div className="text-sm font-medium text-green-600 mb-1 flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Fortaleza
                      </div>
                      <div className="text-xs text-[#000000]">
                        Excelente explicación de conceptos técnicos utilizando ayudas
                        visuales. El interés del cliente aumentó un 37% durante las demostraciones.
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                      <div className="text-sm font-medium text-amber-600 mb-1 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Oportunidad
                      </div>
                      <div className="text-xs text-[#000000]">
                        El cliente preguntó sobre el cronograma dos veces (12:05, 29:17) 
                        con creciente preocupación. Considera proporcionar un documento 
                        detallado de cronograma.
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                      <div className="text-sm font-medium text-blue-600 mb-1 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Patrón Detectado
                      </div>
                      <div className="text-xs text-[#000000]">
                        El cliente usa la frase "necesitamos" para indicar requisitos
                        de alta prioridad. Este patrón apareció 7 veces.
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                      <div className="text-sm font-medium text-purple-600 mb-1 flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        Preferencia del Cliente
                      </div>
                      <div className="text-xs text-[#000000]">
                        El cliente mostró las reacciones más positivas a los ejemplos
                        de diseño minimalista (21:15-23:40).
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="w-full text-blue-600 hover:text-blue-700 hover:bg-gray-50"
                    >
                      Ver Análisis Detallado
                    </Button>
                  </CardFooter>
                </Card>

                {/* Next Steps */}
                <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-[#000000]">
                      Próximos Pasos Recomendados
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                        </div>
                      </div>
                      <div className="text-sm text-[#545454]">
                        Programar taller de pruebas de usuario para la{" "}
                        <span className="text-[#000000] font-medium">semana 2</span>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                        </div>
                      </div>
                      <div className="text-sm text-[#545454]">
                        Preparar desglose de presupuesto para las funcionalidades de la fase 2
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-[#000000] hover:bg-[#333333] text-white">
                      <Clipboard className="mr-2 h-4 w-4" />
                      Añadir a Tareas
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Placeholder content for other tabs */}
          <TabsContent value="transcript" className="mt-6">
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-[#000000]">
                  Transcripción Completa
                </CardTitle>
                <CardDescription className="text-[#545454]">
                  Texto completo con análisis de sentimiento y destacados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-[#545454]">
                  [El contenido de la transcripción aparecería aquí con puntos destacados y marcas de tiempo]
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-[#000000]">
                  Análisis Detallado de IA
                </CardTitle>
                <CardDescription className="text-[#545454]">
                  Perspectivas en profundidad de patrones de comunicación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-[#545454]">
                  [El análisis detallado de IA aparecería aquí]
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="mt-6">
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-[#000000]">
                  Elementos de Acción y Seguimiento
                </CardTitle>
                <CardDescription className="text-[#545454]">
                  Tareas y compromisos de la llamada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-[#545454]">
                  [Los elementos de acción y tareas de seguimiento aparecerían aquí]
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}