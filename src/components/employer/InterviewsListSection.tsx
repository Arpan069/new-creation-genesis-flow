
import React, { useState } from "react";
import { Search, Filter, ChevronDown, MoreHorizontal, Calendar, User, Clock } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for interviews
const mockInterviews = [
  {
    id: 1,
    candidate: "John Doe",
    position: "Frontend Developer",
    date: "2025-04-08",
    time: "10:30 AM",
    duration: 28,
    status: "completed",
    score: 85,
  },
  {
    id: 2,
    candidate: "Jane Smith",
    position: "UI/UX Designer",
    date: "2025-04-08",
    time: "2:15 PM",
    duration: 32,
    status: "completed",
    score: 92,
  },
  {
    id: 3,
    candidate: "Michael Brown",
    position: "Backend Developer",
    date: "2025-04-09",
    time: "11:00 AM",
    duration: 25,
    status: "upcoming",
    score: null,
  },
  {
    id: 4,
    candidate: "Sarah Wilson",
    position: "Product Manager",
    date: "2025-04-10",
    time: "3:00 PM",
    duration: null,
    status: "scheduled",
    score: null,
  },
  {
    id: 5,
    candidate: "David Lee",
    position: "Full Stack Developer",
    date: "2025-04-07",
    time: "1:30 PM",
    duration: 31,
    status: "completed",
    score: 78,
  },
];

const InterviewsListSection = ({ onSelectInterview }: { onSelectInterview: (id: number) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [interviews, setInterviews] = useState(mockInterviews);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Filter interviews based on search query
  const filteredInterviews = interviews.filter(
    interview => 
      interview.candidate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.position.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Render status badge with appropriate color
  const renderStatus = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Completed</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Upcoming</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <Card className="glass-morphism">
      <CardHeader className="pb-3">
        <CardTitle>All Interviews</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="w-full sm:w-auto relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by candidate or position..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filter
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Interviews</h4>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Status</h5>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="completed" />
                      <label htmlFor="completed" className="text-sm">Completed</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="upcoming" />
                      <label htmlFor="upcoming" className="text-sm">Upcoming</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="scheduled" />
                      <label htmlFor="scheduled" className="text-sm">Scheduled</label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Position</h5>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="frontend" />
                      <label htmlFor="frontend" className="text-sm">Frontend Developer</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="backend" />
                      <label htmlFor="backend" className="text-sm">Backend Developer</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="fullstack" />
                      <label htmlFor="fullstack" className="text-sm">Full Stack Developer</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="ui-ux" />
                      <label htmlFor="ui-ux" className="text-sm">UI/UX Designer</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pm" />
                      <label htmlFor="pm" className="text-sm">Product Manager</label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" size="sm">Clear</Button>
                  <Button size="sm" onClick={() => setFilterOpen(false)}>Apply</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInterviews.length > 0 ? (
                filteredInterviews.map((interview) => (
                  <TableRow 
                    key={interview.id} 
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => onSelectInterview(interview.id)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {interview.candidate.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{interview.candidate}</span>
                      </div>
                    </TableCell>
                    <TableCell>{interview.position}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-sm">{interview.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-sm">{interview.time}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{renderStatus(interview.status)}</TableCell>
                    <TableCell>
                      {interview.score ? (
                        <span className={`font-medium ${
                          interview.score >= 85 ? 'text-green-600 dark:text-green-400' : 
                          interview.score >= 70 ? 'text-amber-600 dark:text-amber-400' : 
                          'text-red-600 dark:text-red-400'
                        }`}>{interview.score}%</span>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onSelectInterview(interview.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No interviews found matching your search
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredInterviews.length} of {interviews.length} interviews
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default InterviewsListSection;
