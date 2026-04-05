"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsPanels({ name, email }: { name: string; email: string }) {
  const [account, setAccount] = useState({ name, email });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "" });

  async function saveAccount() {
    const response = await fetch("/api/settings/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(account)
    });

    if (!response.ok) {
      toast.error("Unable to update account");
      return;
    }

    toast.success("Account updated.");
  }

  async function savePassword() {
    const response = await fetch("/api/settings/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(password)
    });

    if (!response.ok) {
      toast.error("Unable to update password");
      return;
    }

    setPassword({ currentPassword: "", newPassword: "" });
    toast.success("Password updated.");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardContent className="space-y-5 p-6">
          <div>
            <h2 className="text-xl font-semibold">Account</h2>
            <p className="text-sm text-muted-foreground">Update your profile details used throughout the portal.</p>
          </div>
          <div>
            <Label htmlFor="settings-name">Full name</Label>
            <Input id="settings-name" value={account.name} onChange={(event) => setAccount((current) => ({ ...current, name: event.target.value }))} />
          </div>
          <div>
            <Label htmlFor="settings-email">Email</Label>
            <Input id="settings-email" value={account.email} onChange={(event) => setAccount((current) => ({ ...current, email: event.target.value }))} />
          </div>
          <Button onClick={saveAccount} type="button">Save account</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-5 p-6">
          <div>
            <h2 className="text-xl font-semibold">Password</h2>
            <p className="text-sm text-muted-foreground">Use a strong password if you convert the demo environment into a real deployment.</p>
          </div>
          <div>
            <Label htmlFor="current-password">Current password</Label>
            <Input id="current-password" type="password" value={password.currentPassword} onChange={(event) => setPassword((current) => ({ ...current, currentPassword: event.target.value }))} />
          </div>
          <div>
            <Label htmlFor="new-password">New password</Label>
            <Input id="new-password" type="password" value={password.newPassword} onChange={(event) => setPassword((current) => ({ ...current, newPassword: event.target.value }))} />
          </div>
          <Button onClick={savePassword} type="button" variant="outline">Change password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
