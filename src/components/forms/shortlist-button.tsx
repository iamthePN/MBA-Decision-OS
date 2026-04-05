"use client";

import { useState } from "react";
import { Heart, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function ShortlistButton({ collegeId, initialShortlisted = false }: { collegeId: string; initialShortlisted?: boolean }) {
  const [shortlisted, setShortlisted] = useState(initialShortlisted);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/shortlist${shortlisted ? `/${collegeId}` : ""}`, {
        method: shortlisted ? "DELETE" : "POST",
        headers: shortlisted ? undefined : { "Content-Type": "application/json" },
        body: shortlisted ? undefined : JSON.stringify({ collegeId })
      });

      if (!response.ok) {
        throw new Error("Unable to update shortlist");
      }

      setShortlisted((current) => !current);
      toast.success(shortlisted ? "Removed from shortlist" : "Added to shortlist");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update shortlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={toggle} type="button" variant={shortlisted ? "secondary" : "outline"}>
      {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Heart className="mr-2 h-4 w-4" />}
      {shortlisted ? "Shortlisted" : "Add to shortlist"}
    </Button>
  );
}
