"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  isPending?: boolean;
};

export default function SearchButton({ isPending }: Props) {
  const status = useFormStatus();
  const pending = isPending ?? status.pending;

  return (
    <Button
        type="submit"
        disabled={pending}
        className="w-20"
        >
            {pending ? (
                <LoaderCircle className="animate-spin" />
            ) : "Search"}
        </Button>
  )
}
