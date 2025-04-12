
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const JobDescriptionUploadSection = () => {
  const { toast } = useToast();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [websites, setWebsites] = useState<string[]>(["linkedin.com", "naukri.com"]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate file upload process
    setTimeout(() => {
      setFileName(file.name);
      setIsUploading(false);
      
      // Extract content from file (in a real app, this would parse the file)
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setJobDescription(event.target.result.toString().substring(0, 500));
        }
      };
      reader.readAsText(file);
      
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded.`,
      });
    }, 1500);
  };

  const clearFile = () => {
    setFileName(null);
    setJobDescription("");
  };

  const startCandidateScan = () => {
    if (!jobTitle.trim() && !jobDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a job title or upload/enter a job description.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "Scan completed",
        description: `Found potential candidates from ${websites.join(", ")}. Check the candidates section below.`,
      });
    }, 3000);
  };

  const toggleWebsite = (website: string) => {
    if (websites.includes(website)) {
      setWebsites(websites.filter(site => site !== website));
    } else {
      setWebsites([...websites, website]);
    }
  };

  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2" size={20} />
          Job Description Scanner
        </CardTitle>
        <CardDescription>
          Upload a job description to find matching candidates across platforms
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium mb-1">
            Job Title
          </label>
          <Input
            id="jobTitle"
            placeholder="e.g. Senior Frontend Developer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job Description</label>
          <div className="space-y-2">
            {fileName ? (
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center">
                  <FileText size={16} className="mr-2" />
                  <span className="text-sm truncate max-w-[200px]">{fileName}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={clearFile}>
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <Textarea
                placeholder="Enter job description or upload a file..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[120px]"
              />
            )}

            <div className="flex items-center gap-2">
              <Button variant="outline" className="relative" disabled={isUploading}>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept=".txt,.pdf,.docx"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                {isUploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {isUploading ? "Uploading..." : "Upload Description"}
              </Button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Scan Sources</label>
          <div className="flex flex-wrap gap-2">
            {["linkedin.com", "naukri.com", "indeed.com", "monster.com"].map((site) => (
              <Button
                key={site}
                variant={websites.includes(site) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleWebsite(site)}
                className="text-xs"
              >
                {site}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={startCandidateScan} 
          disabled={isScanning}
          className="w-full"
        >
          {isScanning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Scanning for Candidates...
            </>
          ) : (
            <>Find Matching Candidates</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobDescriptionUploadSection;
