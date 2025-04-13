
import { useState, useEffect } from "react";
import FeatureLayout from "@/components/FeatureLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Search, Star, MapPin, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

// Types for doctors
interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  availability: string;
  insurance?: string[];
  distance?: number;
}

// Mock data for doctors
const allDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 127,
    location: "New York, NY",
    image: "https://i.pravatar.cc/150?img=1",
    availability: "Today",
    insurance: ["Medicare", "Blue Cross"],
    distance: 3.2
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Dermatologist",
    rating: 4.7,
    reviews: 84,
    location: "Boston, MA",
    image: "https://i.pravatar.cc/150?img=3",
    availability: "Tomorrow",
    insurance: ["Aetna", "United Healthcare"],
    distance: 5.7
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    rating: 4.8,
    reviews: 105,
    location: "Chicago, IL",
    image: "https://i.pravatar.cc/150?img=5",
    availability: "Thursday",
    insurance: ["Blue Cross", "United Healthcare"],
    distance: 2.3
  },
  {
    id: 4,
    name: "Dr. Robert Williams",
    specialty: "Neurologist",
    rating: 4.6,
    reviews: 73,
    location: "Austin, TX",
    image: "https://i.pravatar.cc/150?img=7",
    availability: "Friday",
    insurance: ["Medicare", "Cigna"],
    distance: 7.8
  },
  {
    id: 5,
    name: "Dr. Sophia Lee",
    specialty: "Psychiatrist",
    rating: 4.9,
    reviews: 91,
    location: "San Francisco, CA",
    image: "https://i.pravatar.cc/150?img=9",
    availability: "Wednesday",
    insurance: ["Aetna", "Blue Cross"],
    distance: 4.5
  },
  {
    id: 6,
    name: "Dr. James Wilson",
    specialty: "Orthopedist",
    rating: 4.8,
    reviews: 112,
    location: "Seattle, WA",
    image: "https://i.pravatar.cc/150?img=11",
    availability: "Today",
    insurance: ["Medicare", "United Healthcare"],
    distance: 3.9
  },
  {
    id: 7,
    name: "Dr. Olivia Martinez",
    specialty: "Ophthalmologist",
    rating: 4.7,
    reviews: 88,
    location: "Miami, FL",
    image: "https://i.pravatar.cc/150?img=13",
    availability: "Tomorrow",
    insurance: ["Blue Cross", "Cigna"],
    distance: 6.1
  },
  {
    id: 8,
    name: "Dr. William Thompson",
    specialty: "Cardiologist",
    rating: 4.5,
    reviews: 79,
    location: "Denver, CO",
    image: "https://i.pravatar.cc/150?img=15",
    availability: "Friday",
    insurance: ["Medicare", "United Healthcare"],
    distance: 8.3
  },
  {
    id: 9,
    name: "Dr. Ava Clark",
    specialty: "Dermatologist",
    rating: 4.9,
    reviews: 136,
    location: "Los Angeles, CA",
    image: "https://i.pravatar.cc/150?img=17",
    availability: "Thursday",
    insurance: ["Aetna", "Blue Cross"],
    distance: 1.8
  },
  {
    id: 10,
    name: "Dr. Benjamin Moore",
    specialty: "Pediatrician",
    rating: 4.8,
    reviews: 95,
    location: "Portland, OR",
    image: "https://i.pravatar.cc/150?img=19",
    availability: "Monday",
    insurance: ["Medicare", "Cigna"],
    distance: 5.4
  }
];

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>(allDoctors);
  const [specialtyFilters, setSpecialtyFilters] = useState<string[]>([]);
  const [availabilityFilters, setAvailabilityFilters] = useState<string[]>([]);
  const [insuranceFilters, setInsuranceFilters] = useState<string[]>([]);
  const [distanceFilter, setDistanceFilter] = useState<string>("Any distance");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const { toast } = useToast();

  // Get unique specialties from the doctors data
  const specialties = Array.from(new Set(allDoctors.map(doctor => doctor.specialty)));
  
  // Get unique availability options from the doctors data
  const availabilities = Array.from(new Set(allDoctors.map(doctor => doctor.availability)));
  
  // Get unique insurance options from the doctors data
  const insuranceOptions = Array.from(
    new Set(allDoctors.flatMap(doctor => doctor.insurance || []))
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleSpecialtyFilter = (specialty: string) => {
    setSpecialtyFilters(prev => 
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const toggleAvailabilityFilter = (availability: string) => {
    setAvailabilityFilters(prev => 
      prev.includes(availability)
        ? prev.filter(a => a !== availability)
        : [...prev, availability]
    );
  };

  const toggleInsuranceFilter = (insurance: string) => {
    setInsuranceFilters(prev => 
      prev.includes(insurance)
        ? prev.filter(i => i !== insurance)
        : [...prev, insurance]
    );
  };

  const handleDistanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistanceFilter(e.target.value);
  };

  const applyFilters = () => {
    let filtered = allDoctors;
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchLower) || 
        doctor.specialty.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply specialty filters
    if (specialtyFilters.length > 0) {
      filtered = filtered.filter(doctor => specialtyFilters.includes(doctor.specialty));
    }
    
    // Apply availability filters
    if (availabilityFilters.length > 0) {
      filtered = filtered.filter(doctor => availabilityFilters.includes(doctor.availability));
    }
    
    // Apply insurance filters
    if (insuranceFilters.length > 0) {
      filtered = filtered.filter(doctor => 
        doctor.insurance?.some(ins => insuranceFilters.includes(ins))
      );
    }
    
    // Apply distance filter
    if (distanceFilter !== "Any distance") {
      const maxDistance = parseInt(distanceFilter.split(' ')[1]);
      filtered = filtered.filter(doctor => (doctor.distance || 0) <= maxDistance);
    }
    
    setDoctors(filtered);
    setFiltersApplied(true);
    
    toast({
      title: `Found ${filtered.length} doctors`,
      description: filtered.length > 0 
        ? "Displaying matching doctors based on your filters." 
        : "Try adjusting your filters to see more results."
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSpecialtyFilters([]);
    setAvailabilityFilters([]);
    setInsuranceFilters([]);
    setDistanceFilter("Any distance");
    setDoctors(allDoctors);
    setFiltersApplied(false);
    
    toast({
      title: "Filters reset",
      description: "All filters have been cleared."
    });
  };

  // Apply search filter on search term change
  useEffect(() => {
    if (searchTerm.trim() === "") {
      if (!filtersApplied) {
        setDoctors(allDoctors);
      } else {
        applyFilters();
      }
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = allDoctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchLower) || 
        doctor.specialty.toLowerCase().includes(searchLower)
      );
      setDoctors(filtered);
    }
  }, [searchTerm]);

  const handleBookAppointment = (doctor: Doctor) => {
    toast({
      title: "Appointment request sent",
      description: `Your appointment request with ${doctor.name} has been submitted.`
    });
  };

  const DoctorsList = () => (
    <div className="p-4">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input 
          placeholder="Search for doctors by name or specialty" 
          className="pl-10"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      
      {doctors.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground">No doctors found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
          <Button variant="outline" onClick={resetFilters}>Reset All Filters</Button>
        </div>
      ) : (
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
                      {doctor.distance && (
                        <span className="ml-2">({doctor.distance} miles away)</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-medgreen-600 dark:text-medgreen-400 font-medium">
                        Next available: {doctor.availability}
                      </span>
                      <Button 
                        size="sm" 
                        className="bg-medease-500 hover:bg-medease-600"
                        onClick={() => handleBookAppointment(doctor)}
                      >
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
      )}
    </div>
  );

  const FilterPanel = () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Find Your Doctor</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Specialties</h3>
          <div className="space-y-2">
            {specialties.map((specialty) => (
              <div key={specialty} className="flex items-center space-x-2">
                <Checkbox 
                  id={`specialty-${specialty}`} 
                  checked={specialtyFilters.includes(specialty)}
                  onCheckedChange={() => toggleSpecialtyFilter(specialty)}
                />
                <label htmlFor={`specialty-${specialty}`} className="text-sm">{specialty}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Availability</h3>
          <div className="space-y-2">
            {availabilities.map((availability) => (
              <div key={availability} className="flex items-center space-x-2">
                <Checkbox 
                  id={`availability-${availability}`} 
                  checked={availabilityFilters.includes(availability)}
                  onCheckedChange={() => toggleAvailabilityFilter(availability)}
                />
                <label htmlFor={`availability-${availability}`} className="text-sm">{availability}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Insurance</h3>
          <div className="space-y-2">
            {insuranceOptions.map((insurance) => (
              <div key={insurance} className="flex items-center space-x-2">
                <Checkbox 
                  id={`insurance-${insurance}`} 
                  checked={insuranceFilters.includes(insurance)}
                  onCheckedChange={() => toggleInsuranceFilter(insurance)}
                />
                <label htmlFor={`insurance-${insurance}`} className="text-sm">{insurance}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Distance</h3>
          <select 
            className="w-full p-2 border rounded-md"
            value={distanceFilter}
            onChange={handleDistanceChange}
          >
            <option>Within 5 miles</option>
            <option>Within 10 miles</option>
            <option>Within 25 miles</option>
            <option>Any distance</option>
          </select>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            className="flex-1 bg-medease-500 hover:bg-medease-600"
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={resetFilters}
          >
            Reset
          </Button>
        </div>
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
