
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, FileText, ExternalLink, Star } from "lucide-react";

// Mock data for candidate matches
const mockCandidates = [
  {
    id: 1,
    name: "Alex Johnson",
    title: "Senior React Developer",
    matchScore: 94,
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    experience: "8 years",
    source: "LinkedIn",
    profile: "https://linkedin.com/in/alexjohnson",
    education: "MSc Computer Science",
  },
  {
    id: 2,
    name: "Priya Sharma",
    title: "Frontend Engineer",
    matchScore: 88,
    skills: ["React", "JavaScript", "CSS", "UI/UX"],
    experience: "5 years",
    source: "Naukri.com",
    profile: "https://naukri.com/profiles/priyas",
    education: "BTech Information Technology",
  },
  {
    id: 3,
    name: "Michael Chen",
    title: "Full Stack Developer",
    matchScore: 82,
    skills: ["React", "MongoDB", "Express", "Node.js"],
    experience: "6 years",
    source: "LinkedIn",
    profile: "https://linkedin.com/in/michaelchen",
    education: "BS Computer Science",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    title: "JavaScript Developer",
    matchScore: 76,
    skills: ["JavaScript", "React", "Vue.js", "HTML/CSS"],
    experience: "4 years",
    source: "Indeed",
    profile: "https://indeed.com/r/sarahwilson",
    education: "Self-taught, Bootcamp Graduate",
  },
];

const CandidateMatchesSection = () => {
  // Render match score badge with appropriate color
  const renderMatchScore = (score: number) => {
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
    );
  };

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
                <TableHead>Candidate</TableHead>
                <TableHead>Match Score</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCandidates.length > 0 ? (
                mockCandidates.map((candidate) => (
                  <TableRow key={candidate.id} className="hover:bg-muted/40">
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
                    <TableCell>{renderMatchScore(candidate.matchScore)}</TableCell>
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No candidate matches found yet. Upload a job description to find matches.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateMatchesSection;
