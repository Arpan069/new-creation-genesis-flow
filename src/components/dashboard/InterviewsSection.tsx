
import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Video, Award, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Interview {
  id: number;
  role: string;
  company: string;
  date: string;
  duration: number;
  status: string;
  score?: number;
}

interface InterviewsSectionProps {
  upcomingInterviews: Interview[];
  pastInterviews: Interview[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const InterviewsSection = ({ upcomingInterviews, pastInterviews }: InterviewsSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Interviews */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingInterviews.length > 0 ? (
              <div className="space-y-4">
                {upcomingInterviews.map((interview) => (
                  <motion.div 
                    key={interview.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 border rounded-lg hover:bg-accent hover:border-accent transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{interview.role}</h3>
                        <p className="text-sm text-muted-foreground">{interview.company}</p>
                      </div>
                      <Badge>{interview.status}</Badge>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(interview.date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{interview.duration} minutes</span>
                      </div>
                    </div>
                    <div className="mt-4 flex">
                      <Button size="sm">Join Interview</Button>
                      <Button variant="outline" size="sm" className="ml-2">Reschedule</Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium mb-1">No Scheduled Interviews</h3>
                <p className="text-sm text-muted-foreground">
                  You don't have any upcoming interviews scheduled.
                </p>
                <Button className="mt-4">Browse Job Opportunities</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Past Interviews Summary */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Past Interviews Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold">{pastInterviews.length}</div>
                <p className="text-sm text-muted-foreground">Completed Interviews</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Average Score</h4>
                <div className="flex items-center">
                  <Progress value={85} className="h-2 flex-1" />
                  <span className="ml-2 text-sm font-medium">85%</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full" onClick={() => {
                document.getElementById("past-interviews")?.scrollIntoView({ behavior: "smooth" });
              }}>
                View All Past Interviews
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Past Interviews Detail */}
        <Card className="lg:col-span-3" id="past-interviews">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Past Interview Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pastInterviews.length > 0 ? (
              <div className="space-y-4">
                {pastInterviews.map((interview) => (
                  <motion.div 
                    key={interview.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 border rounded-lg hover:bg-accent hover:border-accent transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{interview.role}</h3>
                        <p className="text-sm text-muted-foreground">{interview.company}</p>
                      </div>
                      <div className="flex items-center">
                        <Badge variant={interview.score && interview.score >= 80 ? "default" : "outline"}>
                          {interview.score}%
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(interview.date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{interview.duration} minutes</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm mb-1 flex justify-between">
                        <span>Performance</span>
                        <span className={interview.score && interview.score >= 80 ? "text-green-600" : "text-amber-600"}>
                          {interview.score && interview.score >= 90 ? "Excellent" : 
                          interview.score && interview.score >= 80 ? "Good" : 
                          interview.score && interview.score >= 70 ? "Average" : "Needs Improvement"}
                        </span>
                      </div>
                      <Progress 
                        value={interview.score} 
                        className="h-2"
                        style={{
                          background: 'var(--background-muted)',
                        }}
                      />
                    </div>
                    <div className="mt-4">
                      <Button size="sm" variant="outline">
                        <Video className="h-4 w-4 mr-1" />
                        View Recording
                      </Button>
                      <Button size="sm" variant="outline" className="ml-2">
                        <Award className="h-4 w-4 mr-1" />
                        See Feedback
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium mb-1">No Past Interviews</h3>
                <p className="text-sm text-muted-foreground">
                  You haven't completed any interviews yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewsSection;
