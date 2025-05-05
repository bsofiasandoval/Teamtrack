'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import Cookies from 'js-cookie';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface Insight {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
}

export default function CallInsightsPage() {
  const { id } = useParams();

  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const userIdFromCookie = Cookies.get('userId');
        setLoading(true);
        const response = await fetch(`https://teamtrackbackend-production.up.railway.app/project/call/insight?user_id=${userIdFromCookie}&call_id=${id}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setInsights(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch insights');
        console.error('Error fetching insights:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchInsights();
    }
  }, [id]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <h1 className="text-2xl font-bold">Call Insights</h1>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Call Insights</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Call Insights</h1>
      
      {insights.length === 0 ? (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>No insights found</AlertTitle>
          <AlertDescription>
            There are no insights available for this call yet.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => (
            <Card key={insight.id} className="w-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{insight.title}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(insight.severity)}`}>
                    {insight.severity.charAt(0).toUpperCase() + insight.severity.slice(1)}
                  </span>
                </div>
                <CardDescription>Category: {insight.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{insight.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(insight.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}