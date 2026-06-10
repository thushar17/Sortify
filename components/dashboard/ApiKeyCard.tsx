"use client"

import { api } from "@/lib/api"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function ApiKeyCard(){
    const [hasApiKey, setHasApiKey]= useState(false)
    const [loading, setLoading] = useState(false)
    const [apiKey, setApiKey] =
  useState("");

const [showKey, setShowKey] =
  useState(false);
    
    useEffect(()=>{
        fetchStatus()
    },[])
    async function fetchStatus(){
      try {
        const {data} = await api.get(
            '/api/api-key-status'
        )
        setHasApiKey(data.hasApiKey)
      } catch (error) {
        console.log(error)
      }
    }

    async function generateKeY() {
        try {
            setLoading(true)
            const {data} = await api.post(
                "/api/create-api-key"
            )
            setApiKey(data.apiKey);

    setShowKey(true);

    setHasApiKey(true);

    toast.success(
      "API Key generated"
    );
        } catch (error) {
            console.log(error);

    toast.error(
      "Failed to generate API key"
    );
        }
        finally{
            setLoading(false)
        }
    }

    return (
    <section className="glass-card section-shell">
      <div className="space-y-4">
        <span className="eyebrow">
          API Access
        </span>

        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Manage API access
        </h2>

        <p className="text-sm text-slate-600">
          Generate API keys to use
          Sortify programmatically.
        </p>

        <div className="surface-muted p-4">
          <p>
            Status:
            {hasApiKey
              ? " Active ✅"
              : " Not Generated ❌"}
          </p>
          <button
  onClick={generateKeY}
  disabled={loading}
  className="primary-button"
>
  {loading
    ? "Generating..."
    : hasApiKey
    ? "Regenerate API Key"
    : "Generate API Key"}
</button>
        </div>
        {showKey && (
  <div className="surface-muted mt-4 space-y-3 p-4">
    <p className="font-semibold text-amber-600">
      ⚠ Save this API key now. You won't be able to see it again.
    </p>

    <div className="rounded-xl border bg-white p-3 font-mono break-all">
      {apiKey}
    </div>

    <button
      className="secondary-button"
      onClick={() => {
        navigator.clipboard.writeText(apiKey);
        toast.success("API key copied");
      }}
    >
      Copy API Key
    </button>
  </div>
)}
      </div>
    </section>
  );
}