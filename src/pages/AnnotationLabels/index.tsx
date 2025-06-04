import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AnnotationLabel, EventCategory, AnnotationFlag, FlagCondition } from "@/types/annotation";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FlagManagement from "./FlagManagement";
import DefaultWizardConfig from "./DefaultWizardConfig";
import LoadingState from "./LoadingState";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";

const AnnotationLabelsPage = () => {
  const { labels, flags, isLoading, categories, saveLabel, deleteLabel, saveFlag, deleteFlag } = useAnnotationLabels();
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState<{
    name: string;
    category: EventCategory;
    hotkey: string;
    description?: string;
    flags?: string[];
    flag_conditions?: FlagCondition[];
  }>({
    name: "",
    category: "offense",
    hotkey: "",
    description: "",
    flags: [],
    flag_conditions: []
  });
  const [selectedFlags, setSelectedFlags] = useState<string[]>([]);
  const [flagConditions, setFlagConditions] = useState<FlagCondition[]>([]);
  const [activeTab, setActiveTab] = useState<string>("labels");

  // Reset form when closing
  const resetForm = () => {
    setNewLabel({
      name: "",
      category: "offense",
      hotkey: "",
      description: "",
      flags: [],
      flag_conditions: []
    });
    setSelectedFlags([]);
    setFlagConditions([]);
    setIsAddingLabel(false);
    setEditingLabelId(null);
  };

  // Handle editing a label
  const handleEditLabel = (label: AnnotationLabel) => {
    setNewLabel({
      name: label.name,
      category: label.category,
      hotkey: label.hotkey,
      description: label.description || "",
      flags: label.flags?.map(flag => flag.id) || [],
      flag_conditions: label.flag_conditions || []
    });
    setSelectedFlags(label.flags?.map(flag => flag.id) || []);
    setFlagConditions(label.flag_conditions || []);
    setEditingLabelId(label.id);
    setIsAddingLabel(true);
  };

  // Handle editing a flag
  const handleEditFlag = (flag: AnnotationFlag) => {
    // This is handled by the FlagManagement component
  };

  // Handle saving a label
  const handleSaveLabel = async () => {
    if (newLabel.name && newLabel.category && newLabel.hotkey) {
      // Create the label object for saving
      const labelToSave: AnnotationLabel = {
        id: editingLabelId || uuidv4(),
        name: newLabel.name,
        category: newLabel.category,
        hotkey: newLabel.hotkey.toUpperCase(),
        description: newLabel.description,
        flags: selectedFlags.map(id => flags.find(f => f.id === id)).filter(Boolean) as AnnotationFlag[],
        flag_conditions: flagConditions
      };

      const success = await saveLabel(labelToSave);
      
      if (success) {
        toast({
          title: editingLabelId ? "Label updated" : "Label created",
          description: `Successfully ${editingLabelId ? "updated" : "created"} label: ${newLabel.name}`,
        });
        resetForm();
      }
    } else {
      toast({
        title: "Validation error",
        description: "Name, category, and hotkey are required.",
        variant: "destructive"
      });
    }
  };

  // Handle deleting a label
  const handleDeleteLabel = async (id: string) => {
    if (confirm("Are you sure you want to delete this label?")) {
      const success = await deleteLabel(id);
      if (success) {
        toast({
          title: "Label deleted",
          description: "Successfully deleted the label.",
        });
      }
    }
  };

  // Handle flag selection
  const handleFlagSelection = (flagId: string) => {
    setSelectedFlags(prev => {
      if (prev.includes(flagId)) {
        return prev.filter(id => id !== flagId);
      } else {
        return [...prev, flagId];
      }
    });
  };

  // Handle adding a flag condition
  const handleAddFlagCondition = (flagId: string, value: string, flagsToHideIds: string[]) => {
    setFlagConditions(prev => [
      ...prev,
      { flagId, value, flagsToHideIds }
    ]);
  };

  // Handle removing a flag condition
  const handleRemoveFlagCondition = (index: number) => {
    setFlagConditions(prev => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Annotation Labels Management</h1>
      
      {/* Default Wizard Configuration Section */}
      <DefaultWizardConfig labels={labels} flags={flags} />
      
      {/* Flag Management Section */}
      <FlagManagement
        flags={flags}
        onEditFlag={handleEditFlag}
        onDeleteFlag={deleteFlag}
        onSaveFlag={saveFlag}
      />

      {/* Labels Management Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Event Labels</h2>
          {!isAddingLabel && (
            <Button onClick={() => setIsAddingLabel(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Label
            </Button>
          )}
        </div>

        {isAddingLabel ? (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">
              {editingLabelId ? "Edit Label" : "Add New Label"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="label-name">Label Name</Label>
                <Input
                  id="label-name"
                  value={newLabel.name}
                  onChange={(e) => setNewLabel({...newLabel, name: e.target.value})}
                  placeholder="e.g., Pass, Shot, Tackle"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="label-hotkey">Hotkey</Label>
                <Input
                  id="label-hotkey"
                  value={newLabel.hotkey}
                  onChange={(e) => setNewLabel({...newLabel, hotkey: e.target.value})}
                  placeholder="e.g., P, S, T"
                  maxLength={1}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="label-category">Category</Label>
                <Select
                  value={newLabel.category}
                  onValueChange={(value) => setNewLabel({...newLabel, category: value as EventCategory})}
                >
                  <SelectTrigger id="label-category" className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="label-description">Description (Optional)</Label>
                <Textarea
                  id="label-description"
                  value={newLabel.description || ""}
                  onChange={(e) => setNewLabel({...newLabel, description: e.target.value})}
                  placeholder="Brief description of this event type"
                  className="mt-1"
                />
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList>
                <TabsTrigger value="flags">Associated Flags</TabsTrigger>
                <TabsTrigger value="conditions">Flag Conditions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="flags" className="pt-4">
                <div className="text-sm text-gray-500 mb-2">
                  Select flags that should be prompted for when this event is selected:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {flags.map((flag) => (
                    <div key={flag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`flag-${flag.id}`}
                        checked={selectedFlags.includes(flag.id)}
                        onCheckedChange={() => handleFlagSelection(flag.id)}
                      />
                      <Label htmlFor={`flag-${flag.id}`} className="text-sm cursor-pointer">
                        {flag.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="conditions" className="pt-4">
                <div className="text-sm text-gray-500 mb-2">
                  Define conditions for when certain flags should be hidden based on previous selections:
                </div>
                
                {/* Flag conditions UI would go here - simplified for this example */}
                <div className="bg-gray-100 p-3 rounded text-sm">
                  Flag conditions configuration UI would be implemented here.
                  This would allow setting up which flags to hide based on previous flag selections.
                </div>
                
                {flagConditions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Current Conditions:</h4>
                    <div className="space-y-2">
                      {flagConditions.map((condition, index) => {
                        const flag = flags.find(f => f.id === condition.flagId);
                        const hiddenFlags = condition.flagsToHideIds.map(
                          id => flags.find(f => f.id === id)?.name || "Unknown"
                        ).join(", ");
                        
                        return (
                          <div key={index} className="flex justify-between bg-gray-50 p-2 rounded text-sm">
                            <div>
                              When <span className="font-medium">{flag?.name || "Unknown"}</span> is{" "}
                              <span className="font-medium">{condition.value}</span>, hide:{" "}
                              <span className="font-medium">{hiddenFlags || "None"}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFlagCondition(index)}
                              className="h-5 text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSaveLabel}>
                {editingLabelId ? "Update Label" : "Create Label"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hotkey
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {labels.map((label) => {
                  const categoryName = categories.find(c => c.id === label.category)?.name || label.category;
                  
                  return (
                    <tr key={label.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{label.name}</div>
                        {label.description && (
                          <div className="text-xs text-gray-500">{label.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{categoryName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{label.hotkey}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {label.flags?.length || 0} flags
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditLabel(label)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLabel(label.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnotationLabelsPage;
