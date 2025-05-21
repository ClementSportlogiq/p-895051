
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FlagIssue } from "./types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck, Shield, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface FlagRepairProps {
  flagIssues: FlagIssue[];
  isLoading: boolean;
  onFixAll: () => Promise<void>;
}

export const FlagRepair: React.FC<FlagRepairProps> = ({ flagIssues, isLoading, onFixAll }) => {
  const [isRepairing, setIsRepairing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleFixAll = async () => {
    try {
      setIsRepairing(true);
      await onFixAll();
      toast({
        title: "Repair completed",
        description: "All flag issues have been fixed successfully.",
      });
    } catch (error) {
      console.error("Error fixing flag issues:", error);
      toast({
        title: "Repair failed",
        description: "There was an error fixing the flag issues. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRepairing(false);
      setShowConfirmDialog(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Flag Repair</CardTitle>
          <CardDescription>Loading available repair operations...</CardDescription>
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
          No issues to repair. The database is in good health.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Flag Repair Tools</CardTitle>
              <CardDescription>
                Fix issues with flags and their relationships
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowConfirmDialog(true)} 
              disabled={isLoading || isRepairing}
            >
              <Shield className="mr-2 h-4 w-4" />
              Fix All Issues
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flagIssues.map((issue, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Badge variant={issue.severity === 'high' ? 'destructive' : 'default'} className="mr-2">
                        {issue.severity}
                      </Badge>
                      {issue.type}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {issue.description}
                      <div className="mt-1">
                        {issue.affectedItems.slice(0, 2).map((item, i) => (
                          <div key={i} className="text-xs text-gray-500">
                            • {item.name} {item.id && <span className="text-xs text-gray-400">({item.id.substring(0, 8)}...)</span>}
                          </div>
                        ))}
                        {issue.affectedItems.length > 2 && (
                          <div className="text-xs text-gray-500">
                            • And {issue.affectedItems.length - 2} more...
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" disabled={isRepairing}>
                      Fix Issue
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="text-sm text-gray-500">
            {flagIssues.length} issue{flagIssues.length !== 1 ? 's' : ''} found
          </div>
          <Button variant="outline" disabled={isLoading || isRepairing} size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Repair</DialogTitle>
            <DialogDescription>
              This will attempt to fix all {flagIssues.length} detected flag issues. This operation updates data in the database and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-amber-600 text-sm font-medium">
              Warning: It's recommended to backup your data before proceeding.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleFixAll} 
              disabled={isRepairing}
            >
              {isRepairing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Repairing...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Proceed with Repair
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FlagRepair;
