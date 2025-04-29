
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AnnotationLabels: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="p-5">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="mr-1" size={16} />
              Back to Main
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Annotation Labels</h1>
        </div>
        
        <div className="mt-8">
          {/* Annotation label content will be added here */}
          <p className="text-gray-500">Create and manage annotation labels here.</p>
        </div>
      </div>
    </div>
  );
};

export default AnnotationLabels;
