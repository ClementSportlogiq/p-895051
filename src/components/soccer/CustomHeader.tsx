
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CustomHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-2 absolute top-5 right-5 z-10">
      <Button variant="outline" className="text-sm">
        Hotkeys
      </Button>
      <Button variant="outline" className="text-sm" asChild>
        <Link to="/labels">Annotation Labels</Link>
      </Button>
    </div>
  );
};

export default CustomHeader;
