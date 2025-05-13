
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { heygenService } from "@/services/HeygenService";
import { toast } from "@/hooks/use-toast";

interface HeygenApiKeySetupProps {
  onSuccess: () => void;
}

export const HeygenApiKeySetup: React.FC<HeygenApiKeySetupProps> = ({ onSuccess }) => {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Set the API key in the service
      heygenService.setApiKey(apiKey);
      
      toast({
        title: "Success",
        description: "Heygen API key configured successfully",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error setting API key:", error);
      toast({
        title: "Error",
        description: "Failed to configure Heygen API key",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Configure Heygen API</CardTitle>
        <CardDescription>
          Enter your Heygen API key to enable AI avatar functionality
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Heygen API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-xxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>You can get your API key from the Heygen dashboard.</p>
              <a 
                href="https://www.heygen.com/app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Visit Heygen Dashboard →
              </a>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Configuring..." : "Configure API Key"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default HeygenApiKeySetup;
