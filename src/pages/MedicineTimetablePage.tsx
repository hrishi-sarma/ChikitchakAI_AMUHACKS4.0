
import { useState } from "react";
import FeatureLayout from "@/components/FeatureLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// Mock data
const initialMedications = [
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

export default function MedicineTimetablePage() {
  const [medications, setMedications] = useState(initialMedications);
  const [formOpen, setFormOpen] = useState(false);
  const [editingMedicationId, setEditingMedicationId] = useState<string | null>(null);
  
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
  
  const getEditingMedication = () => {
    if (!editingMedicationId) return null;
    return medications.find(med => med.id === editingMedicationId) || null;
  };
  
  const handleDeleteMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
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
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Check className="h-4 w-4 text-medgreen-500" />
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
                      onClick={() => {
                        setEditingMedicationId(med.id);
                        setFormOpen(true);
                      }}
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
                      {new Date(med.startDate).toLocaleDateString()} - {new Date(med.endDate).toLocaleDateString()}
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
              onClick={() => setEditingMedicationId(null)}
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
                  defaultValue={getEditingMedication()?.name || ""}
                  placeholder="Enter medication name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="dosage" className="text-sm font-medium">Dosage</label>
                  <Input
                    id="dosage"
                    defaultValue={getEditingMedication()?.dosage || ""}
                    placeholder="e.g., 500mg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="frequency" className="text-sm font-medium">Frequency</label>
                  <Input
                    id="frequency"
                    defaultValue={getEditingMedication()?.frequency || ""}
                    placeholder="e.g., 3x daily"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
                  <Input
                    id="startDate"
                    type="date"
                    defaultValue={getEditingMedication()?.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="endDate" className="text-sm font-medium">End Date</label>
                  <Input
                    id="endDate"
                    type="date"
                    defaultValue={getEditingMedication()?.endDate || ""}
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
                          defaultChecked={getEditingMedication()?.timeSlots.includes(time)}
                        />
                        <label htmlFor={`time-${time}`}>{time}</label>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Custom Time
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                <Input
                  id="notes"
                  defaultValue={getEditingMedication()?.notes || ""}
                  placeholder="Additional instructions or notes"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Color Label</label>
                <div className="flex space-x-2">
                  {["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"].map(color => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded-full ${color} ${
                        getEditingMedication()?.color === color ? "ring-2 ring-offset-2 ring-medease-500" : ""
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
              <Button className="bg-medease-500 hover:bg-medease-600" onClick={() => setFormOpen(false)}>
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
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                <div>
                  <span className="font-medium">Amoxicillin</span>
                  <span className="text-sm text-muted-foreground ml-2">500mg</span>
                </div>
              </div>
              <div className="text-sm font-medium text-medease-600">
                In 25 minutes
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <div>
                  <span className="font-medium">Ibuprofen</span>
                  <span className="text-sm text-muted-foreground ml-2">200mg</span>
                </div>
              </div>
              <div className="text-sm font-medium text-medease-600">
                Today, 8:00 PM
              </div>
            </div>
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
