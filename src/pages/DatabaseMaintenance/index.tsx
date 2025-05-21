
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Database, RefreshCw, Shield, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { FlagDiagnostics } from "./FlagDiagnostics";
import { FlagRepair } from "./FlagRepair";
import { DatabaseStats } from "./DatabaseStats";
import { useDatabaseMaintenance } from "./useDatabaseMaintenance";

const DatabaseMaintenance: React.FC = () => {
  const {
    stats,
    flagIssues,
    isLoading,
    runDiagnostics,
    fixAllFlagIssues
  } = useDatabaseMaintenance();

  return (
    <div className="bg-white min-h-screen">
      <div className="p-5">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" asChild>
            <Link to="/labels">
              <ArrowLeft className="mr-1" size={16} />
              Back to Labels
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Database Maintenance</h1>
        </div>

        <div className="mb-6">
          <Card>
            <CardHeader className="bg-slate-50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Database Health</CardTitle>
                  <CardDescription>
                    System status and data integrity checks
                  </CardDescription>
                </div>
                <Button 
                  onClick={runDiagnostics} 
                  variant="outline" 
                  disabled={isLoading}
                >
                  <RefreshCw size={16} className="mr-1" />
                  Run Diagnostics
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <DatabaseStats stats={stats} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="diagnostics">
          <TabsList className="mb-4">
            <TabsTrigger value="diagnostics">
              <Shield className="mr-2 h-4 w-4" />
              Diagnostics
            </TabsTrigger>
            <TabsTrigger value="repair">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Repair Tools
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="diagnostics">
            <FlagDiagnostics 
              flagIssues={flagIssues} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="repair">
            <FlagRepair 
              flagIssues={flagIssues} 
              isLoading={isLoading} 
              onFixAll={fixAllFlagIssues} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DatabaseMaintenance;
