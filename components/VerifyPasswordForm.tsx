"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/api";

type Props = {
  slug: string;
};

export default function VerifyPasswordForm({ slug }: Props) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/verify-password", {
        slug,
        password,
      });

      toast.success("Password verified");
      window.location.href = `/${slug}`;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Verification failed");
        return;
      }
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="field-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field-input"
          placeholder="Enter password"
        />
      </div>

      <button type="submit" className="primary-button w-full" disabled={loading}>
        {loading ? "Verifying..." : "Continue"}
      </button>
    </form>
  );
}
