
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DatabaseStats as StatsType } from "./types";

interface DatabaseStatsProps {
  stats: StatsType;
  isLoading: boolean;
}

export const DatabaseStats: React.FC<DatabaseStatsProps> = ({ stats, isLoading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard 
        title="Labels" 
        count={stats.labelCount} 
        status={stats.labelIssuesCount > 0 ? 'warning' : 'healthy'} 
        isLoading={isLoading} 
      />
      <StatCard 
        title="Flags" 
        count={stats.flagCount} 
        status={stats.flagIssuesCount > 0 ? 'warning' : 'healthy'} 
        isLoading={isLoading} 
      />
      <StatCard 
        title="Flag Values" 
        count={stats.flagValuesCount} 
        status={stats.flagValueIssuesCount > 0 ? 'warning' : 'healthy'} 
        isLoading={isLoading} 
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  count: number;
  status: 'healthy' | 'warning' | 'error';
  isLoading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, status, isLoading }) => {
  const statusColors = {
    healthy: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
            {status === 'healthy' ? 'Healthy' : status === 'warning' ? 'Warning' : 'Error'}
          </div>
        </div>
        {isLoading ? (
          <Skeleton className="h-8 w-16 mt-2" />
        ) : (
          <p className="text-2xl font-bold mt-2">{count}</p>
        )}
      </CardContent>
    </Card>
  );
};
