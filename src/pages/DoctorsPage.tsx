
import FeatureLayout from "@/components/FeatureLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Search, Star, MapPin, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for doctors
const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 127,
    location: "New York, NY",
    image: "https://i.pravatar.cc/150?img=1",
    availability: "Next available: Today"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Dermatologist",
    rating: 4.7,
    reviews: 84,
    location: "Boston, MA",
    image: "https://i.pravatar.cc/150?img=3",
    availability: "Next available: Tomorrow"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    rating: 4.8,
    reviews: 105,
    location: "Chicago, IL",
    image: "https://i.pravatar.cc/150?img=5",
    availability: "Next available: Thursday"
  },
  {
    id: 4,
    name: "Dr. Robert Williams",
    specialty: "Neurologist",
    rating: 4.6,
    reviews: 73,
    location: "Austin, TX",
    image: "https://i.pravatar.cc/150?img=7",
    availability: "Next available: Friday"
  },
  {
    id: 5,
    name: "Dr. Sophia Lee",
    specialty: "Psychiatrist",
    rating: 4.9,
    reviews: 91,
    location: "San Francisco, CA",
    image: "https://i.pravatar.cc/150?img=9",
    availability: "Next available: Wednesday"
  }
];

export default function DoctorsPage() {
  const DoctorsList = () => (
    <div className="p-4">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input 
          placeholder="Search for doctors by name or specialty" 
          className="pl-10"
        />
      </div>
      
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 flex flex-col sm:flex-row items-start gap-4">
                <Avatar className="h-16 w-16 rounded-full">
                  <img src={doctor.image} alt={doctor.name} />
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{doctor.name}</h3>
                  <p className="text-medease-600 dark:text-medease-400">{doctor.specialty}</p>
                  
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{doctor.rating}</span>
                    <span className="text-sm text-muted-foreground ml-1">({doctor.reviews} reviews)</span>
                  </div>
                  
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{doctor.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-medgreen-600 dark:text-medgreen-400 font-medium">
                      {doctor.availability}
                    </span>
                    <Button size="sm" className="bg-medease-500 hover:bg-medease-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      Book
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const FilterPanel = () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Find Your Doctor</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Specialties</h3>
          <div className="space-y-2">
            {["Cardiologist", "Dermatologist", "Pediatrician", "Neurologist", "Psychiatrist"].map((specialty) => (
              <div key={specialty} className="flex items-center">
                <input type="checkbox" id={specialty} className="mr-2" />
                <label htmlFor={specialty}>{specialty}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Availability</h3>
          <div className="space-y-2">
            {["Today", "Tomorrow", "This Week", "Next Week"].map((time) => (
              <div key={time} className="flex items-center">
                <input type="checkbox" id={time} className="mr-2" />
                <label htmlFor={time}>{time}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Insurance</h3>
          <div className="space-y-2">
            {["Medicare", "Blue Cross", "Aetna", "United Healthcare"].map((insurance) => (
              <div key={insurance} className="flex items-center">
                <input type="checkbox" id={insurance} className="mr-2" />
                <label htmlFor={insurance}>{insurance}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Distance</h3>
          <select className="w-full p-2 border rounded-md">
            <option>Within 5 miles</option>
            <option>Within 10 miles</option>
            <option>Within 25 miles</option>
            <option>Any distance</option>
          </select>
        </div>
        
        <Button className="w-full bg-medease-500 hover:bg-medease-600">
          Apply Filters
        </Button>
      </div>
    </div>
  );

  return (
    <FeatureLayout
      title="Find Doctors Near You"
      leftPanel={<DoctorsList />}
      rightPanel={<FilterPanel />}
    />
  );
}
