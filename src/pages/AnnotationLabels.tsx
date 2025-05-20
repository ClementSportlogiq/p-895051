
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash, Pencil } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { AnnotationLabel, EventCategory } from "@/types/annotation";

const categoriesData = [
  { id: "offense", name: "Offense", hotkey: "A" },
  { id: "defense", name: "Defense", hotkey: "S" },
  { id: "reception", name: "Reception/LBR", hotkey: "D" },
  { id: "goalkeeper", name: "Goalkeeper", hotkey: "F" },
  { id: "deadball", name: "Deadball", hotkey: "Z" },
  { id: "playerAction", name: "Player Action", hotkey: "X" },
  { id: "infractions", name: "Infractions", hotkey: "C" },
];

const initialLabels = [
  { id: "pass", name: "Pass", category: "offense" as EventCategory, hotkey: "Q", description: "Standard pass" },
  { id: "cross", name: "Cross", category: "offense" as EventCategory, hotkey: "W", description: "Cross into the box" },
  { id: "shot", name: "Shot", category: "offense" as EventCategory, hotkey: "E", description: "Shot on goal" },
  { id: "reception", name: "Reception", category: "reception" as EventCategory, hotkey: "W", description: "Ball reception" },
];

const AnnotationLabels: React.FC = () => {
  const [labels, setLabels] = useState<AnnotationLabel[]>([]);
  const [newLabel, setNewLabel] = useState<Partial<AnnotationLabel>>({
    name: "",
    category: "offense",
    hotkey: "",
    description: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    // Load labels from localStorage if available, otherwise use initial data
    const savedLabels = localStorage.getItem("annotationLabels");
    if (savedLabels) {
      setLabels(JSON.parse(savedLabels));
    } else {
      setLabels(initialLabels);
      localStorage.setItem("annotationLabels", JSON.stringify(initialLabels));
    }
  }, []);

  // Save labels to localStorage whenever they change
  useEffect(() => {
    if (labels.length > 0) {
      localStorage.setItem("annotationLabels", JSON.stringify(labels));
    }
  }, [labels]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLabel(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setNewLabel(prev => ({ ...prev, category: value as EventCategory }));
  };

  const handleAddLabel = () => {
    if (newLabel.name && newLabel.hotkey) {
      if (editingId) {
        // Update existing label
        setLabels(labels.map(label => 
          label.id === editingId ? { ...label, ...newLabel, id: editingId } as AnnotationLabel : label
        ));
        setEditingId(null);
      } else {
        // Add new label
        setLabels([...labels, { ...newLabel, id: uuidv4() } as AnnotationLabel]);
      }
      
      // Reset form
      setNewLabel({
        name: "",
        category: "offense",
        hotkey: "",
        description: ""
      });
    }
  };

  const handleEditLabel = (label: AnnotationLabel) => {
    setNewLabel(label);
    setEditingId(label.id);
  };

  const handleDeleteLabel = (id: string) => {
    setLabels(labels.filter(label => label.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setNewLabel({
        name: "",
        category: "offense",
        hotkey: "",
        description: ""
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewLabel({
      name: "",
      category: "offense",
      hotkey: "",
      description: ""
    });
  };

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Label form */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Label" : "Add New Label"}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Label Name</label>
                <Input 
                  name="name" 
                  value={newLabel.name || ""} 
                  onChange={handleInputChange} 
                  placeholder="e.g., Pass, Shot, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select 
                  value={newLabel.category} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesData.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hotkey</label>
                <Input 
                  name="hotkey" 
                  value={newLabel.hotkey || ""} 
                  onChange={handleInputChange} 
                  placeholder="e.g., Q, W, E, etc."
                  maxLength={1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                <Input 
                  name="description" 
                  value={newLabel.description || ""} 
                  onChange={handleInputChange} 
                  placeholder="Brief description of the label"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddLabel}>
                  {editingId ? "Update" : "Add"} Label
                </Button>
                {editingId && (
                  <Button variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Labels list */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Label List</h2>
            
            <div className="space-y-2">
              {labels.length === 0 ? (
                <p className="text-gray-500">No labels created yet. Add your first label.</p>
              ) : (
                labels.map(label => (
                  <div 
                    key={label.id} 
                    className="flex items-center justify-between bg-white p-3 border rounded-md"
                  >
                    <div>
                      <div className="font-medium">{label.name} ({label.hotkey})</div>
                      <div className="text-sm text-gray-500">
                        Category: {categoriesData.find(c => c.id === label.category)?.name}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEditLabel(label)}>
                        <Pencil size={16} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteLabel(label.id)}>
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnotationLabels;
