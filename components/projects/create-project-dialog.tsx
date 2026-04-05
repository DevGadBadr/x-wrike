"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { ProjectForm } from "@/components/forms/project-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" type="button">
          <Plus className="h-3.5 w-3.5" />
          New project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>Set up a new project workspace with its name, details, and ownership.</DialogDescription>
        </DialogHeader>
        <ProjectForm className="border-0 shadow-none" onSuccess={() => setOpen(false)} title="Project details" />
      </DialogContent>
    </Dialog>
  );
}
