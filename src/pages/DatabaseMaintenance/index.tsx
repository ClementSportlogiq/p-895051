
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import DatabaseStats from "./DatabaseStats";
import FlagDiagnostics from "./FlagDiagnostics";
import FlagRepair from "./FlagRepair";
import { useDatabaseMaintenance } from "./useDatabaseMaintenance";
import { Skeleton } from "@/components/ui/skeleton";

const DatabaseMaintenance: React.FC = () => {
  const { labels, flags, isLoading } = useAnnotationLabels();
  const { databaseStats, flagIssues, analyzeDatabase } = useDatabaseMaintenance();
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    // Run diagnostics when component mounts and data is loaded
    if (!isLoading && labels && flags) {
      analyzeDatabase(labels, flags);
    }
  }, [isLoading, labels, flags]);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen p-5">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="mr-1" size={16} />
              Back to Main
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Database Maintenance</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Loading Database Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-5">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" asChild>
          <Link to="/labels">
            <ArrowLeft className="mr-1" size={16} />
            Back to Labels
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Database Maintenance</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
          <TabsTrigger value="repair">Repair</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <DatabaseStats stats={databaseStats} />
        </TabsContent>
        
        <TabsContent value="diagnostics">
          <FlagDiagnostics issues={flagIssues} />
        </TabsContent>
        
        <TabsContent value="repair">
          <FlagRepair issues={flagIssues} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseMaintenance;
