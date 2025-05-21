
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import { DatabaseStats } from "./DatabaseStats";
import { FlagDiagnostics } from "./FlagDiagnostics";
import { FlagRepair } from "./FlagRepair";
import { useDatabaseMaintenance } from "./hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MAX_RETRY_COUNT = 3;

const DatabaseMaintenance: React.FC = () => {
  const { labels, flags, isLoading: isLabelsLoading } = useAnnotationLabels();
  const { 
    stats, 
    flagIssues, 
    isLoading: isDiagnosticsLoading, 
    runDiagnostics, 
    fixAllFlagIssues,
    lastError
  } = useDatabaseMaintenance();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [retryCount, setRetryCount] = useState(0);
  const [hasCriticalError, setHasCriticalError] = useState(false);
  
  const isLoading = isLabelsLoading || isDiagnosticsLoading;
  
  // Run diagnostics when component mounts and data is loaded
  useEffect(() => {
    if (!isLabelsLoading && labels && flags) {
      console.log('Data loaded, running diagnostics...');
      runDiagnostics().catch(error => {
        console.error('Failed to run diagnostics:', error);
        
        // Increment retry count if there's an error
        setRetryCount(prev => {
          const newCount = prev + 1;
          
          // Mark as critical error if we've exceeded max retries
          if (newCount >= MAX_RETRY_COUNT) {
            setHasCriticalError(true);
            toast({
              title: "Critical Error",
              description: "Database diagnostics failed after multiple attempts. Please refresh the page.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Diagnostics Error",
              description: "Failed to run database diagnostics. Retrying...",
              variant: "destructive"
            });
          }
          
          return newCount;
        });
      });
    }
  }, [isLabelsLoading, labels, flags, runDiagnostics]);

  const handleRefresh = () => {
    // Reset error states
    setRetryCount(0);
    setHasCriticalError(false);
    
    runDiagnostics().catch(error => {
      console.error('Error refreshing diagnostics:', error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh database diagnostics. Please try again.",
        variant: "destructive"
      });
    });
  };

  if (isLoading && !hasCriticalError) {
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

  // Critical error state
  if (hasCriticalError) {
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
        
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Critical Error</AlertTitle>
          <AlertDescription>
            The database diagnostics have failed after multiple attempts. This may indicate a problem with the database connection or data integrity.
            <div className="mt-4">
              <Button onClick={handleRefresh}>Try Again</Button>
            </div>
          </AlertDescription>
        </Alert>
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
        
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          className="ml-auto"
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>
      
      {lastError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            An error occurred: {lastError.message}
            <div className="mt-2 text-sm">
              The system will continue to function with potentially incomplete data. You can try refreshing to resolve this issue.
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
          <TabsTrigger value="repair">Repair</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <DatabaseStats stats={stats} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="diagnostics">
          <FlagDiagnostics flagIssues={flagIssues} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="repair">
          <FlagRepair flagIssues={flagIssues} isLoading={isLoading} onFixAll={fixAllFlagIssues} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseMaintenance;
