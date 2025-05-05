'use client'

import { BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function SentimentChart() {
  const data = [
    { segment: "Inicio", positive: 35, negative: 65 },
    { segment: "Medio", positive: 60, negative: 40 },
    { segment: "Final", positive: 82, negative: 18 },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data} layout="vertical">
        <XAxis type="number" />
        <YAxis dataKey="segment" type="category" />
        <Tooltip />
        <Bar dataKey="positive" stackId="a" fill="#0088FE" />
        <Bar dataKey="negative" stackId="a" fill="#FF8042" />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export function DurationChart() {
  const data = [
    { segment: "Introducción", duration: 1.5 },
    { segment: "Problema", duration: 4.2 },
    { segment: "Solución", duration: 5.8 },
    { segment: "Cierre", duration: 2.3 },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data} layout="vertical">
        <XAxis type="number" />
        <YAxis dataKey="segment" type="category" />
        <Tooltip />
        <Bar dataKey="duration" fill="#00C49F" />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export function TopicsChart() {
  const data = [
    { name: "Facturación", value: 45 },
    { name: "Soporte Técnico", value: 25 },
    { name: "Información", value: 15 },
    { name: "Quejas", value: 10 },
    { name: "Otros", value: 5 },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function KeywordsCloud() {
  const data = [
    { keyword: "factura", count: 18 },
    { keyword: "descuento", count: 16 },
    { keyword: "servicio", count: 15 },
    { keyword: "problema", count: 14 },
    { keyword: "resolución", count: 14 },
    { keyword: "cliente", count: 13 },
    { keyword: "soporte", count: 12 },
    { keyword: "contrato", count: 12 },
    { keyword: "técnico", count: 11 },
    { keyword: "pago", count: 11 },
  ].sort((a, b) => b.count - a.count)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data} layout="vertical">
        <XAxis type="number" />
        <YAxis dataKey="keyword" type="category" width={100} />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
