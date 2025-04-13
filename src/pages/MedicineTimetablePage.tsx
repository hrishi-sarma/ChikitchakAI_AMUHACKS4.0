
import { useState, useEffect } from "react";
import FeatureLayout from "@/components/FeatureLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, 
  Calendar, 
  Plus, 
  AlarmClock, 
  Check, 
  X, 
  Edit2, 
  Trash2 
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

// Types for medications
type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  timeSlots: string[];
  notes: string;
  color: string;
  takenToday?: boolean;
};

// Get medications from localStorage or use initial data
const getInitialMedications = (): Medication[] => {
  const saved = localStorage.getItem('medications');
  if (saved) {
    return JSON.parse(saved);
  }
  
  return [
    {
      id: "1",
      name: "Amoxicillin",
      dosage: "500mg",
      frequency: "3x daily",
      startDate: "2023-04-01",
      endDate: "2023-04-14",
      timeSlots: ["08:00", "13:00", "20:00"],
      notes: "Take with food",
      color: "bg-red-500"
    },
    {
      id: "2",
      name: "Vitamin D",
      dosage: "1000 IU",
      frequency: "1x daily",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      timeSlots: ["09:00"],
      notes: "Take with breakfast",
      color: "bg-yellow-500"
    },
    {
      id: "3",
      name: "Ibuprofen",
      dosage: "200mg",
      frequency: "As needed",
      startDate: "2023-04-01",
      endDate: "2023-04-30",
      timeSlots: ["08:00", "20:00"],
      notes: "Take for headaches",
      color: "bg-blue-500"
    },
    {
      id: "4",
      name: "Metformin",
      dosage: "500mg",
      frequency: "2x daily",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      timeSlots: ["07:30", "19:30"],
      notes: "Take with meals",
      color: "bg-green-500"
    }
  ];
};

export default function MedicineTimetablePage() {
  const [medications, setMedications] = useState<Medication[]>(getInitialMedications);
  const [formOpen, setFormOpen] = useState(false);
  const [editingMedicationId, setEditingMedicationId] = useState<string | null>(null);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    name: "",
    dosage: "",
    frequency: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    timeSlots: [],
    notes: "",
    color: "bg-blue-500"
  });
  const [customTimeSlot, setCustomTimeSlot] = useState("");
  const { toast } = useToast();
  
  // Save medications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);
  
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      slots.push(`${i.toString().padStart(2, "0")}:00`);
    }
    return slots;
  };
  
  const timeSlots = generateTimeSlots();
  
  const getMedicationsForTimeSlot = (slot: string) => {
    return medications.filter(med => med.timeSlots.includes(slot));
  };
  
  const handleDeleteMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
    toast({
      title: "Medication deleted",
      description: "The medication has been removed from your schedule.",
      variant: "destructive"
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMedication(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeSlotToggle = (time: string) => {
    setNewMedication(prev => {
      const currentSlots = prev.timeSlots || [];
      const updatedSlots = currentSlots.includes(time)
        ? currentSlots.filter(t => t !== time)
        : [...currentSlots, time];
      
      return { ...prev, timeSlots: updatedSlots };
    });
  };

  const handleAddCustomTimeSlot = () => {
    if (!customTimeSlot) return;
    
    // Basic validation for time format
    const isValidTime = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(customTimeSlot);
    
    if (isValidTime) {
      setNewMedication(prev => {
        const currentSlots = prev.timeSlots || [];
        if (!currentSlots.includes(customTimeSlot)) {
          return { ...prev, timeSlots: [...currentSlots, customTimeSlot] };
        }
        return prev;
      });
      setCustomTimeSlot("");
    } else {
      toast({
        title: "Invalid time format",
        description: "Please use the format HH:MM (e.g., 08:30)",
        variant: "destructive"
      });
    }
  };

  const handleColorSelect = (color: string) => {
    setNewMedication(prev => ({ ...prev, color }));
  };
  
  const handleSaveMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.startDate || (newMedication.timeSlots?.length || 0) === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select at least one time slot.",
        variant: "destructive"
      });
      return;
    }
    
    if (editingMedicationId) {
      // Update existing medication
      setMedications(prev => 
        prev.map(med => 
          med.id === editingMedicationId 
            ? { ...med, ...newMedication, id: med.id } as Medication
            : med
        )
      );
      toast({
        title: "Medication updated",
        description: "Your medication has been updated successfully."
      });
    } else {
      // Add new medication
      const newMed: Medication = {
        ...newMedication as Omit<Medication, 'id'>,
        id: Date.now().toString(),
      } as Medication;
      
      setMedications(prev => [...prev, newMed]);
      toast({
        title: "Medication added",
        description: "Your new medication has been added to your schedule."
      });
    }
    
    // Reset form and close dialog
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      timeSlots: [],
      notes: "",
      color: "bg-blue-500"
    });
    setFormOpen(false);
    setEditingMedicationId(null);
  };
  
  const handleMarkTaken = (id: string) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === id 
          ? { ...med, takenToday: !med.takenToday } 
          : med
      )
    );
    
    toast({
      title: "Medication status updated",
      description: "Your medication has been marked as taken."
    });
  };
  
  const handleEditMedication = (id: string) => {
    const medToEdit = medications.find(med => med.id === id);
    if (medToEdit) {
      setNewMedication(medToEdit);
      setEditingMedicationId(id);
      setFormOpen(true);
    }
  };
  
  const TimetablePanel = () => (
    <Tabs defaultValue="schedule" className="w-full h-full">
      <TabsList className="mb-6">
        <TabsTrigger value="schedule">Daily Schedule</TabsTrigger>
        <TabsTrigger value="list">Medications List</TabsTrigger>
      </TabsList>
      
      <TabsContent value="schedule" className="h-[calc(100vh-20rem)]">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {timeSlots.map(slot => {
              const medsForSlot = getMedicationsForTimeSlot(slot);
              if (medsForSlot.length === 0) return null;
              
              return (
                <div key={slot} className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Clock className="h-4 w-4 mr-2 text-medease-500" />
                    <span className="font-medium">{slot}</span>
                  </div>
                  
                  <div className="space-y-2">
                    {medsForSlot.map(med => (
                      <div key={med.id} className="flex items-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <div className={`w-3 h-3 rounded-full mr-3 ${med.color}`}></div>
                        <div className="flex-1">
                          <div className="font-medium">{med.name}</div>
                          <div className="text-sm text-muted-foreground">{med.dosage}</div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-8 w-8 p-0 ${med.takenToday ? 'text-medgreen-500' : ''}`}
                          onClick={() => handleMarkTaken(med.id)}
                        >
                          {med.takenToday ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <div className="h-4 w-4 border rounded-full" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="list" className="h-[calc(100vh-20rem)]">
        <ScrollArea className="h-full">
          <div className="space-y-4">
            {medications.map(med => (
              <div key={med.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${med.color}`}></div>
                      <h3 className="font-medium">{med.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{med.dosage} • {med.frequency}</p>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditMedication(med.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteMedication(med.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-3 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-2 text-medease-500" />
                    <span>
                      {new Date(med.startDate).toLocaleDateString()} - 
                      {med.endDate ? new Date(med.endDate).toLocaleDateString() : "Ongoing"}
                    </span>
                  </div>
                  
                  <div className="flex items-center mt-1">
                    <AlarmClock className="h-3 w-3 mr-2 text-medease-500" />
                    <span>{med.timeSlots.join(", ")}</span>
                  </div>
                  
                  {med.notes && (
                    <p className="mt-2 bg-gray-50 dark:bg-gray-800 p-2 rounded">{med.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
  
  const AddMedicationPanel = () => (
    <div className="p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Medication Management</h2>
        
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingMedicationId(null);
                setNewMedication({
                  name: "",
                  dosage: "",
                  frequency: "",
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: "",
                  timeSlots: [],
                  notes: "",
                  color: "bg-blue-500"
                });
              }}
              className="bg-medease-500 hover:bg-medease-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px]">
            <DialogTitle>
              {editingMedicationId ? "Edit Medication" : "Add New Medication"}
            </DialogTitle>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Medication Name</label>
                <Input
                  id="name"
                  name="name"
                  value={newMedication.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter medication name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="dosage" className="text-sm font-medium">Dosage</label>
                  <Input
                    id="dosage"
                    name="dosage"
                    value={newMedication.dosage || ""}
                    onChange={handleInputChange}
                    placeholder="e.g., 500mg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="frequency" className="text-sm font-medium">Frequency</label>
                  <Input
                    id="frequency"
                    name="frequency"
                    value={newMedication.frequency || ""}
                    onChange={handleInputChange}
                    placeholder="e.g., 3x daily"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={newMedication.startDate || ""}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="endDate" className="text-sm font-medium">End Date</label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={newMedication.endDate || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Slots</label>
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground mb-2">
                    Select times to take this medication:
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {["08:00", "12:00", "15:00", "20:00"].map(time => (
                      <div key={time} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`time-${time}`}
                          checked={newMedication.timeSlots?.includes(time) || false}
                          onChange={() => handleTimeSlotToggle(time)}
                        />
                        <label htmlFor={`time-${time}`}>{time}</label>
                      </div>
                    ))}
                  </div>
                  <div className="flex mt-2">
                    <Input
                      value={customTimeSlot}
                      onChange={(e) => setCustomTimeSlot(e.target.value)}
                      placeholder="HH:MM"
                      className="mr-2"
                    />
                    <Button variant="outline" size="sm" onClick={handleAddCustomTimeSlot}>
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {(newMedication.timeSlots?.length || 0) > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">Selected times:</p>
                      <div className="flex flex-wrap gap-1">
                        {newMedication.timeSlots?.map(time => (
                          <div key={time} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm flex items-center">
                            {time}
                            <X 
                              className="h-3 w-3 ml-1 cursor-pointer" 
                              onClick={() => handleTimeSlotToggle(time)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={newMedication.notes || ""}
                  onChange={handleInputChange}
                  placeholder="Additional instructions or notes"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Color Label</label>
                <div className="flex space-x-2">
                  {["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`w-6 h-6 rounded-full ${color} ${
                        newMedication.color === color ? "ring-2 ring-offset-2 ring-medease-500" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-medease-500 hover:bg-medease-600" onClick={handleSaveMedication}>
                {editingMedicationId ? "Update" : "Add"} Medication
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-6">
        <div className="bg-medease-50 dark:bg-medease-900/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center">
            <AlarmClock className="h-4 w-4 mr-2 text-medease-500" />
            Upcoming Medications
          </h3>
          
          <div className="space-y-3">
            {medications.slice(0, 2).map(med => (
              <div key={med.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                <div className="flex items-center">
                  <div className={`w-2 h-2 ${med.color} rounded-full mr-2`}></div>
                  <div>
                    <span className="font-medium">{med.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">{med.dosage}</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-medease-600">
                  {med.timeSlots[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Reminders Settings</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
              <span>Enable notifications</span>
              <div className="relative inline-block w-10 h-6 rounded-full bg-medease-500">
                <span className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
              <span>Sound alerts</span>
              <div className="relative inline-block w-10 h-6 rounded-full bg-medease-500">
                <span className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
              <span>Reminder time</span>
              <select className="text-sm bg-transparent">
                <option>15 minutes before</option>
                <option>30 minutes before</option>
                <option>1 hour before</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Track your medication adherence and get insights on your health patterns.
          </p>
          <Button variant="outline" className="w-full">View Medication Reports</Button>
        </div>
      </div>
    </div>
  );

  return (
    <FeatureLayout
      title="Medicine Timetable"
      leftPanel={<TimetablePanel />}
      rightPanel={<AddMedicationPanel />}
    />
  );
}
