
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const LoadingState: React.FC = () => {
  return (
    <div className="bg-white min-h-screen p-5">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" asChild>
          <Link to="/">
            <ArrowLeft className="mr-1" size={16} />
            Back to Main
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Annotation Labels</h1>
      </div>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading labels and flags...</p>
        </div>
      </div>
    </div>
  );
};
