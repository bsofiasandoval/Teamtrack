import { BarChart2, Users, Calendar, FileText } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: <BarChart2 className="h-10 w-10 text-[#000000]" />,
      title: "Información Valiosa",
      description: "Obtén información valiosa sobre el progreso de tu proyecto y toma decisiones informadas con facilidad."
    },
    {
      icon: <Users className="h-10 w-10 text-[#000000]" />,
      title: "Transcripciones con 1 Click",
      description: "Transcribe tus reuniones desde cualquier plataforma de videoconferencia y hazlas accesibles para todo tu equipo."
    },
    {
      icon: <Calendar className="h-10 w-10 text-[#000000]" />,
      title: "Gestión de Proyectos",
      description: "Separa tus proyectos por áreas o clientes y visualiza el progreso de cada uno de ellos."
    },
    {
      icon: <FileText className="h-10 w-10 text-[#000000]" />,
      title: "Seguimiento Intuitivo",
      description: "Haz seguimiento de las reuniones con tus clientes de la forma más intuitiva y sencilla."
    }
  ]

  return (
    <section id="features" className="py-20 px-4 md:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#000000] mb-4">
            Funcionalidad potenciada por IA
          </h2>
          <p className="text-lg text-[#545454] max-w-2xl mx-auto">
            TeamTrack proporciona todas las herramientas que necesitas para mejorar el servicio al cliente de tu empresa.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-[#fbfbfb] p-6 rounded-lg border border-[#a9a9a9] hover:shadow-md transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-[#000000] mb-2">{feature.title}</h3>
              <p className="text-[#545454]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
