"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ScoringWeightManager({ weights }: { weights: Array<{ id: string; key: string; label: string; group: string; value: number; description: string | null }> }) {
  const [items, setItems] = useState(weights);

  async function save() {
    const response = await fetch("/api/admin/scoring", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weights: items.map((item) => ({ key: item.key, value: Number(item.value) })) })
    });
    if (!response.ok) {
      toast.error("Unable to update scoring weights");
      return;
    }
    toast.success("Scoring weights updated.");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-semibold">Scoring engine weights</h2>
          <p className="text-sm text-muted-foreground">All recommendation scores use transparent weighted logic. Adjust values carefully and keep related groups balanced.</p>
        </CardContent>
      </Card>
      <div className="grid gap-4 xl:grid-cols-2">
        {items.map((item, index) => (
          <Card key={item.id}>
            <CardContent className="space-y-3 p-6">
              <div>
                <p className="text-sm uppercase tracking-wide text-muted-foreground">{item.group}</p>
                <h3 className="text-lg font-semibold">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <Input type="number" max="1" min="0" step="0.01" value={item.value} onChange={(event) => setItems((current) => current.map((currentItem, currentIndex) => currentIndex === index ? { ...currentItem, value: Number(event.target.value) } : currentItem))} />
                <div className="w-20 rounded-2xl bg-muted/30 px-3 py-2 text-center text-sm font-medium">{item.key}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button onClick={save} type="button">
        <Save className="mr-2 h-4 w-4" />
        Save weights
      </Button>
    </div>
  );
}
