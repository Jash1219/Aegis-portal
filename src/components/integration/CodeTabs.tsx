"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const nodeSnippet = `const AEGIS_API = "https://api.aegis.dev/v1";

async function requestPilot() {
  const res = await fetch(\`\${AEGIS_API}/pilot/request\`, {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.AEGIS_API_TOKEN}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model_name: "gpt-4o",
      scenario: "customer_support_handoff",
      risk_category: "medium",
      test_cases: [
        {
          input: "I want to speak to a human agent",
          expected: "handoff_to_agent",
          severity: "high",
        },
      ],
    }),
  });

  return res.json();
}

async function pollStatus(pilotId) {
  const res = await fetch(
    \`\${AEGIS_API}/pilot/\${pilotId}/status\`,
    { headers: { Authorization: \`Bearer \${process.env.AEGIS_API_TOKEN}\` } }
  );
  return res.json();
}`;

const pythonSnippet = `import requests

AEGIS_API = "https://api.aegis.dev/v1"
headers = {
    "Authorization": f"Bearer {AEGIS_API_TOKEN}",
    "Content-Type": "application/json",
}

def request_pilot():
    res = requests.post(
        f"{AEGIS_API}/pilot/request",
        headers=headers,
        json={
            "model_name": "gpt-4o",
            "scenario": "customer_support_handoff",
            "risk_category": "medium",
            "test_cases": [
                {
                    "input": "I want to speak to a human agent",
                    "expected": "handoff_to_agent",
                    "severity": "high",
                }
            ],
        },
    )
    return res.json()

def poll_status(pilot_id):
    res = requests.get(
        f"{AEGIS_API}/pilot/{pilot_id}/status",
        headers=headers,
    )
    return res.json()`;

export default function CodeTabs() {
  return (
    <Tabs defaultValue="node" className="w-full">
      <TabsList className="mb-2">
        <TabsTrigger value="node">Node.js</TabsTrigger>
        <TabsTrigger value="python">Python</TabsTrigger>
      </TabsList>
      <TabsContent value="node">
        <pre className="overflow-x-auto rounded-lg border border-[#222222] bg-[#111111] p-4 text-sm leading-relaxed text-[#EDEDED]">
          <code>{nodeSnippet}</code>
        </pre>
      </TabsContent>
      <TabsContent value="python">
        <pre className="overflow-x-auto rounded-lg border border-[#222222] bg-[#111111] p-4 text-sm leading-relaxed text-[#EDEDED]">
          <code>{pythonSnippet}</code>
        </pre>
      </TabsContent>
    </Tabs>
  );
}
