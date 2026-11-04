"use client";

import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export default function VerifyPasswordForm({ slug }: { slug: string }) {
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      await api.post("/api/verify-password", { slug, password });
      window.location.href = `/${slug}`;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("That password isn't right.");
      } else if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Try again.");
      }
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="link-password">Password</Label>
        <Input
          id="link-password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError(null);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "link-password-error" : undefined}
          autoComplete="off"
          autoFocus
          required
        />
        {error && (
          <p id="link-password-error" role="alert" className="text-[13px] text-destructive">
            {error}
          </p>
        )}
      </div>
      <Button type="submit" disabled={pending || !password}>
        {pending ? "Checking…" : "Continue"}
      </Button>
    </form>
  );
}
