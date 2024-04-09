"use client";


import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const Heading = () => {
  const tasks = useQuery(api.documents.get);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      {JSON.stringify(tasks, null, 2)}

    </div>
  );
}
export default Heading;