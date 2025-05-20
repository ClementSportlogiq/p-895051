
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash, Pencil, X, Tag } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { AnnotationLabel, EventCategory, AnnotationFlag } from "@/types/annotation";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

const initialFlags: AnnotationFlag[] = [
  { id: "outcome", name: "Outcome", description: "Result of the action", values: ["Successful", "Unsuccessful"] },
  { id: "direction", name: "Direction", description: "Direction of movement", values: ["Forward", "Backward", "Sideways"] },
];

const AnnotationLabels: React.FC = () => {
  const [labels, setLabels] = useState<AnnotationLabel[]>([]);
  const [flags, setFlags] = useState<AnnotationFlag[]>([]);
  const [newLabel, setNewLabel] = useState<Partial<AnnotationLabel>>({
    name: "",
    category: "offense",
    hotkey: "",
    description: "",
    flags: []
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Flag management states
  const [isAddingFlag, setIsAddingFlag] = useState(false);
  const [newFlag, setNewFlag] = useState<Partial<AnnotationFlag>>({ 
    name: "", 
    description: "", 
    values: [] 
  });
  const [newFlagValue, setNewFlagValue] = useState("");
  const [editingFlagId, setEditingFlagId] = useState<string | null>(null);
  const [showFlagsPanel, setShowFlagsPanel] = useState(false);

  useEffect(() => {
    // Load labels from localStorage if available, otherwise use initial data
    const savedLabels = localStorage.getItem("annotationLabels");
    if (savedLabels) {
      setLabels(JSON.parse(savedLabels));
    } else {
      setLabels(initialLabels);
      localStorage.setItem("annotationLabels", JSON.stringify(initialLabels));
    }

    // Load flags from localStorage if available, otherwise use initial data
    const savedFlags = localStorage.getItem("annotationFlags");
    if (savedFlags) {
      setFlags(JSON.parse(savedFlags));
    } else {
      setFlags(initialFlags);
      localStorage.setItem("annotationFlags", JSON.stringify(initialFlags));
    }
  }, []);

  // Save labels to localStorage whenever they change
  useEffect(() => {
    if (labels.length > 0) {
      localStorage.setItem("annotationLabels", JSON.stringify(labels));
    }
  }, [labels]);

  // Save flags to localStorage whenever they change
  useEffect(() => {
    if (flags.length > 0) {
      localStorage.setItem("annotationFlags", JSON.stringify(flags));
    }
  }, [flags]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        description: "",
        flags: []
      });
    }
  };

  const handleEditLabel = (label: AnnotationLabel) => {
    setNewLabel({
      ...label,
      flags: label.flags || []
    });
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
        description: "",
        flags: []
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewLabel({
      name: "",
      category: "offense",
      hotkey: "",
      description: "",
      flags: []
    });
  };

  // Flag management functions
  const handleAddNewFlag = () => {
    if (newFlag.name) {
      if (editingFlagId) {
        // Update existing flag
        setFlags(flags.map(flag => 
          flag.id === editingFlagId ? { ...flag, ...newFlag, id: editingFlagId } as AnnotationFlag : flag
        ));
        setEditingFlagId(null);
      } else {
        // Add new flag
        const newFlagWithId = { ...newFlag, id: uuidv4() } as AnnotationFlag;
        setFlags([...flags, newFlagWithId]);
      }
      
      // Reset form
      setNewFlag({ name: "", description: "", values: [] });
      setNewFlagValue("");
      setIsAddingFlag(false);
    }
  };

  const handleEditFlag = (flag: AnnotationFlag) => {
    setNewFlag(flag);
    setEditingFlagId(flag.id);
    setIsAddingFlag(true);
  };

  const handleDeleteFlag = (id: string) => {
    // First remove this flag from any labels that use it
    const updatedLabels = labels.map(label => {
      if (label.flags?.some(flag => flag.id === id)) {
        return {
          ...label,
          flags: label.flags.filter(flag => flag.id !== id)
        };
      }
      return label;
    });
    
    setLabels(updatedLabels);
    setFlags(flags.filter(flag => flag.id !== id));
    
    if (editingFlagId === id) {
      setEditingFlagId(null);
      setNewFlag({ name: "", description: "", values: [] });
      setIsAddingFlag(false);
    }
  };

  const handleAddFlagValue = () => {
    if (newFlagValue && !newFlag.values?.includes(newFlagValue)) {
      setNewFlag(prev => ({ 
        ...prev, 
        values: [...(prev.values || []), newFlagValue] 
      }));
      setNewFlagValue("");
    }
  };

  const handleRemoveFlagValue = (value: string) => {
    setNewFlag(prev => ({ 
      ...prev, 
      values: prev.values?.filter(v => v !== value) || [] 
    }));
  };

  const handleFlagCheckboxChange = (flagId: string, checked: boolean) => {
    if (checked) {
      // Add flag to label
      const flagToAdd = flags.find(f => f.id === flagId);
      if (flagToAdd) {
        setNewLabel(prev => ({
          ...prev,
          flags: [...(prev.flags || []), flagToAdd]
        }));
      }
    } else {
      // Remove flag from label
      setNewLabel(prev => ({
        ...prev,
        flags: prev.flags?.filter(f => f.id !== flagId) || []
      }));
    }
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <Textarea 
                  name="description" 
                  value={newLabel.description || ""} 
                  onChange={handleInputChange} 
                  placeholder="Brief description of the label"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Associated Flags</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Tag className="mr-2 h-4 w-4" />
                      <span>
                        {newLabel.flags && newLabel.flags.length > 0
                          ? `${newLabel.flags.length} flag${newLabel.flags.length > 1 ? 's' : ''} selected`
                          : 'Select flags'}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <div className="p-2">
                      {flags.length === 0 ? (
                        <p className="text-sm text-gray-500 p-2">No flags available. Create flags first.</p>
                      ) : (
                        <div className="space-y-2">
                          {flags.map((flag) => {
                            const isSelected = newLabel.flags?.some(f => f.id === flag.id);
                            return (
                              <div key={flag.id} className="flex items-start space-x-2">
                                <Checkbox 
                                  id={`flag-${flag.id}`} 
                                  checked={isSelected}
                                  onCheckedChange={(checked) => 
                                    handleFlagCheckboxChange(flag.id, checked === true)
                                  }
                                />
                                <div className="grid gap-1.5 leading-none">
                                  <label
                                    htmlFor={`flag-${flag.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {flag.name}
                                  </label>
                                  {flag.description && (
                                    <p className="text-xs text-muted-foreground">
                                      {flag.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                
                {newLabel.flags && newLabel.flags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newLabel.flags.map(flag => (
                      <Badge key={flag.id} variant="secondary" className="flex items-center gap-1">
                        {flag.name}
                        <button
                          type="button"
                          onClick={() => handleFlagCheckboxChange(flag.id, false)}
                          className="hover:bg-muted rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
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
                    className="flex flex-col bg-white p-3 border rounded-md"
                  >
                    <div className="flex items-center justify-between">
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
                    
                    {label.flags && label.flags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {label.flags.map(flag => (
                          <Badge key={flag.id} variant="outline" className="text-xs">
                            {flag.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Flags management */}
          <div>
            <Collapsible
              open={showFlagsPanel}
              onOpenChange={setShowFlagsPanel}
              className="bg-gray-50 p-4 rounded-md"
            >
              <div className="flex items-center justify-between">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="flex gap-2 p-0">
                    <h2 className="text-lg font-semibold">Flag Management</h2>
                    {showFlagsPanel ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 10L8 6L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </Button>
                </CollapsibleTrigger>
                {!isAddingFlag && (
                  <Button onClick={() => setIsAddingFlag(true)} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Flag
                  </Button>
                )}
              </div>
              
              <CollapsibleContent className="mt-4">
                {isAddingFlag ? (
                  <div className="space-y-4 mb-4 border-b pb-4">
                    <h3 className="font-medium">{editingFlagId ? "Edit Flag" : "Add New Flag"}</h3>
                    <div>
                      <label className="block text-sm font-medium mb-1">Flag Name</label>
                      <Input 
                        value={newFlag.name} 
                        onChange={(e) => setNewFlag({...newFlag, name: e.target.value})}
                        placeholder="e.g., Outcome, Direction"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                      <Textarea 
                        value={newFlag.description || ""} 
                        onChange={(e) => setNewFlag({...newFlag, description: e.target.value})}
                        placeholder="Brief description of what this flag represents"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Flag Values</label>
                      <div className="flex gap-2">
                        <Input 
                          value={newFlagValue} 
                          onChange={(e) => setNewFlagValue(e.target.value)}
                          placeholder="Add a value"
                        />
                        <Button type="button" onClick={handleAddFlagValue}>Add</Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {newFlag.values?.map((value) => (
                          <Badge key={value} variant="secondary" className="flex items-center gap-1">
                            {value}
                            <button
                              type="button"
                              onClick={() => handleRemoveFlagValue(value)}
                              className="hover:bg-muted rounded-full p-1"
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleAddNewFlag}>
                        {editingFlagId ? "Update" : "Save"} Flag
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          setIsAddingFlag(false);
                          setNewFlag({ name: "", description: "", values: [] });
                          setEditingFlagId(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : null}
                
                <div className="space-y-2">
                  <h3 className="font-medium mb-2">Existing Flags</h3>
                  {flags.length === 0 ? (
                    <p className="text-gray-500">No flags created yet.</p>
                  ) : (
                    flags.map(flag => (
                      <div 
                        key={flag.id} 
                        className="flex flex-col bg-white p-3 border rounded-md"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{flag.name}</div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEditFlag(flag)}>
                              <Pencil size={16} />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteFlag(flag.id)}>
                              <Trash size={16} />
                            </Button>
                          </div>
                        </div>
                        
                        {flag.description && (
                          <div className="text-sm text-gray-500 mt-1">{flag.description}</div>
                        )}
                        
                        <div className="mt-2">
                          <div className="text-xs font-medium text-gray-500">Values:</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {flag.values.map(value => (
                              <Badge key={value} variant="outline" className="text-xs">
                                {value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnotationLabels;
