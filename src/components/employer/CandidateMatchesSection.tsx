
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, FileText, ExternalLink, Star, Calendar, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

const mockCandidates = [
  {
    id: 1,
    name: "Alex Johnson",
    title: "Senior React Developer",
    matchScore: 94,
    cvScore: 92,
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    experience: "8 years",
    source: "LinkedIn",
    profile: "https://linkedin.com/in/alexjohnson",
    education: "MSc Computer Science",
    selected: false,
  },
  {
    id: 2,
    name: "Priya Sharma",
    title: "Frontend Engineer",
    matchScore: 88,
    cvScore: 85,
    skills: ["React", "JavaScript", "CSS", "UI/UX"],
    experience: "5 years",
    source: "Naukri.com",
    profile: "https://naukri.com/profiles/priyas",
    education: "BTech Information Technology",
    selected: false,
  },
  {
    id: 3,
    name: "Michael Chen",
    title: "Full Stack Developer",
    matchScore: 82,
    cvScore: 79,
    skills: ["React", "MongoDB", "Express", "Node.js"],
    experience: "6 years",
    source: "LinkedIn",
    profile: "https://linkedin.com/in/michaelchen",
    education: "BS Computer Science",
    selected: false,
  },
  {
    id: 4,
    name: "Sarah Wilson",
    title: "JavaScript Developer",
    matchScore: 76,
    cvScore: 72,
    skills: ["JavaScript", "React", "Vue.js", "HTML/CSS"],
    experience: "4 years",
    source: "Indeed",
    profile: "https://indeed.com/r/sarahwilson",
    education: "Self-taught, Bootcamp Graduate",
    selected: false,
  },
];

const CandidateMatchesSection = () => {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isShortlistDialogOpen, setIsShortlistDialogOpen] = useState(false);
  const [isGroupScheduleDialogOpen, setIsGroupScheduleDialogOpen] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState<typeof mockCandidates[0] | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm({
    defaultValues: {
      date: "",
      time: "",
      duration: "",
      position: "",
    },
  });

  const groupScheduleForm = useForm({
    defaultValues: {
      date: "",
      time: "",
      duration: "",
      position: "",
    },
  });

  // Count selected candidates
  const selectedCandidates = candidates.filter(c => c.selected);
  const selectedCount = selectedCandidates.length;
  
  const renderScore = (score: number, label: string) => {
    let colorClass = "";
    if (score >= 90) {
      colorClass = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    } else if (score >= 80) {
      colorClass = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    } else if (score >= 70) {
      colorClass = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    } else {
      colorClass = "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }

    return (
      <div className="flex flex-col items-start">
        <span className="text-xs text-muted-foreground mb-1">{label}</span>
        <div className="flex items-center">
          <Badge variant="outline" className={colorClass}>
            {score}%
          </Badge>
          <div className="ml-2 flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={`${
                  score >= star * 20
                    ? "text-yellow-500 fill-yellow-500"
                    : score >= star * 20 - 10
                    ? "text-yellow-500 fill-yellow-500 opacity-50"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const handleScheduleInterview = (candidate: typeof mockCandidates[0]) => {
    setCurrentCandidate(candidate);
    setIsScheduleDialogOpen(true);
  };

  const handleAddToShortlist = () => {
    if (selectedCount === 0) return;
    setIsShortlistDialogOpen(true);
  };

  const handleScheduleSelectedInterviews = () => {
    if (selectedCount === 0) return;
    setIsGroupScheduleDialogOpen(true);
  };

  const toggleCandidateSelection = (id: number) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === id 
        ? { ...candidate, selected: !candidate.selected } 
        : candidate
    ));
  };
  
  const onSubmitSchedule = form.handleSubmit((data) => {
    toast({
      title: "Interview Scheduled",
      description: `Interview with ${currentCandidate?.name} scheduled for ${data.date} at ${data.time}`,
    });
    setIsScheduleDialogOpen(false);
    form.reset();
  });

  const onSubmitShortlist = () => {
    toast({
      title: "Candidates Added to Shortlist",
      description: `${selectedCount} candidate(s) have been added to the shortlist`,
    });
    
    // Update UI to show candidates have been shortlisted
    setCandidates(candidates.map(candidate => 
      candidate.selected 
        ? { ...candidate, selected: false } 
        : candidate
    ));
    
    setIsShortlistDialogOpen(false);
  };

  const onSubmitGroupSchedule = groupScheduleForm.handleSubmit((data) => {
    toast({
      title: "Group Interviews Scheduled",
      description: `${selectedCount} interview(s) scheduled for ${data.date} at ${data.time}`,
    });
    
    // Reset selection after scheduling
    setCandidates(candidates.map(candidate => 
      candidate.selected 
        ? { ...candidate, selected: false } 
        : candidate
    ));
    
    setIsGroupScheduleDialogOpen(false);
    groupScheduleForm.reset();
  });

  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2" size={20} />
          Candidate Matches
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">Select</TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead>Match Score</TableHead>
                <TableHead>CV Score</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <TableRow key={candidate.id} className="hover:bg-muted/40">
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={candidate.selected}
                        onCheckedChange={() => toggleCandidateSelection(candidate.id)}
                        className="mr-2"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {candidate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{candidate.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {candidate.title}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{renderScore(candidate.matchScore, "Job Match")}</TableCell>
                    <TableCell>{renderScore(candidate.cvScore, "CV Quality")}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 3).map((skill, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs py-0 h-5"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs py-0 h-5 bg-muted/50"
                          >
                            +{candidate.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{candidate.experience}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {candidate.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
                          <a
                            href={candidate.profile}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleScheduleInterview(candidate)}
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No candidate matches found yet. Upload a job description to find matches.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button 
            variant="outline"
            disabled={!candidates.some(c => c.selected)}
            onClick={handleAddToShortlist}
          >
            <Check className="mr-2 h-4 w-4" />
            Add Selected to Shortlist ({selectedCount})
          </Button>
          
          <Button 
            variant="default"
            disabled={!candidates.some(c => c.selected)}
            onClick={handleScheduleSelectedInterviews}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Selected Interviews ({selectedCount})
          </Button>
        </div>
      </CardContent>
      
      {/* Individual Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={onSubmitSchedule} className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Candidate: {currentCandidate?.name}</h3>
                <p className="text-sm text-muted-foreground">{currentCandidate?.title}</p>
              </div>
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="Position title" 
                        defaultValue={currentCandidate?.title || ""}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Schedule Interview</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Shortlist Confirmation Dialog */}
      <Dialog open={isShortlistDialogOpen} onOpenChange={setIsShortlistDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add to Shortlist</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Are you sure you want to add {selectedCount} candidate(s) to the shortlist?</p>
            <div className="mt-4">
              {selectedCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center gap-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>
                      {candidate.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{candidate.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsShortlistDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmitShortlist}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Group Schedule Dialog */}
      <Dialog open={isGroupScheduleDialogOpen} onOpenChange={setIsGroupScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule {selectedCount} Interview(s)</DialogTitle>
          </DialogHeader>
          
          <Form {...groupScheduleForm}>
            <form onSubmit={onSubmitGroupSchedule} className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Selected candidates:</p>
                <div className="max-h-32 overflow-y-auto">
                  {selectedCandidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {candidate.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{candidate.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <FormField
                control={groupScheduleForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={groupScheduleForm.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={groupScheduleForm.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="30" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={groupScheduleForm.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="Position title" 
                        {...field} 
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsGroupScheduleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Schedule All</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CandidateMatchesSection;
