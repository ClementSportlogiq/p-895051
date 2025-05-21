
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FlagIssue } from "./types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";

interface FlagDiagnosticsProps {
  flagIssues: FlagIssue[];
  isLoading: boolean;
}

export const FlagDiagnostics: React.FC<FlagDiagnosticsProps> = ({ flagIssues, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Flag Diagnostics</CardTitle>
          <CardDescription>Analyzing flag data issues...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (flagIssues.length === 0) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <ShieldCheck className="h-4 w-4 text-green-600" />
        <AlertTitle>All good!</AlertTitle>
        <AlertDescription>
          No flag issues were detected in the database. Everything appears to be in good health.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flag Issues ({flagIssues.length})</CardTitle>
        <CardDescription>
          The following issues were detected with flags in the database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Issue Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Affected Items</TableHead>
              <TableHead>Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flagIssues.map((issue, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{issue.type}</TableCell>
                <TableCell>{issue.description}</TableCell>
                <TableCell>
                  {issue.affectedItems.map((item, i) => (
                    <div key={i} className="text-sm text-gray-500">
                      {item.name} {item.id && <span className="text-xs text-gray-400">({item.id.substring(0, 8)}...)</span>}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <Badge variant={issue.severity === 'high' ? 'destructive' : issue.severity === 'medium' ? 'default' : 'secondary'}>
                    {issue.severity}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
