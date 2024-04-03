"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Check, Copy, Globe } from "lucide-react";

import { Doc } from "@/convex/_generated/dataModel";
import {
  PopoverTrigger,
  Popover,
  PopoverContent
} from "@/components/ui/popover"
import { useOrigin } from "@/hooks/use-origin";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { UserItem } from "./user-item"
import { useUser } from "@clerk/clerk-react";


interface PublishProps {
  initialData: Doc<"documents">
};

export const Publish = ({
  
  initialData
}: PublishProps) => {
  const origin = useOrigin();
  const update = useMutation(api.documents.update);

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/preview/${initialData._id}`;
  const { user } = useUser();

  const saveToLocalStorage = (data: any) => {
    const existingDataString: string | null = localStorage.getItem('initialData');
    let existingData: any[] = [];

    if (existingDataString !== null) {
        existingData = JSON.parse(existingDataString);
    }

    existingData.push(data);
    localStorage.setItem('initialData', JSON.stringify(existingData));
    console.log("Print localStorage:", existingData);
};

  const removeFromLocalStorage = (idToRemove: string) => {
    const existingDataString: string | null = localStorage.getItem('initialData');
    
    if (existingDataString !== null) {
        let existingData: any[] = JSON.parse(existingDataString);
        
        existingData = existingData.filter(item => item._id !== idToRemove);
        
        localStorage.setItem('initialData', JSON.stringify(existingData));
    }
};
  
const userFullName = user?.fullName;
const userEmail = user?.emailAddresses[0]?.emailAddress;



  const onPublish = () => {
      setIsSubmitting(true);
  // Xác định giá trị cho trường name
      let name;
      if (userFullName !== null && userFullName !== undefined) {
          name = userFullName;
      } else if (userEmail !== null && userEmail !== undefined) {
          name = userEmail;
      } else {
          name = ""; // hoặc giá trị mặc định khác nếu cần
      }
      const dataToSave = {
          _id: initialData._id,
          title: initialData.title,
          user: initialData.userId,
          url: url,
          image: initialData.coverImage,
          name: name
      };
  
      const promise = update({
          id: initialData._id,
          isPublished: true,
      })
      .finally(() => setIsSubmitting(false))
      .then(() => {
          // Lưu initialData vào localStorage khi publish
          saveToLocalStorage(dataToSave);
      });
  
      toast.promise(promise, {
          loading: "Publishing...",
          success: "Note published",
          error: "Failed to publish note.",
      });
  };
  
  const onUnpublish = () => {
      setIsSubmitting(true);
  
      const promise = update({
          id: initialData._id,
          isPublished: false,
      })
      .finally(() => setIsSubmitting(false))
      .then(() => {
          // Xóa initialData khỏi localStorage khi unpublish
          removeFromLocalStorage(initialData._id);
        });
  
      toast.promise(promise, {
          loading: "Unpublishing...",
          success: "Note unpublished",
          error: "Failed to unpublish note.",
      });
  };
  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          Publish 
          {initialData.isPublished && (
            <Globe
              className="text-sky-500 w-4 h-4 ml-2"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-72" 
        align="end"
        alignOffset={8}
        forceMount
      >
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="text-sky-500 animate-pulse h-4 w-4" />
              <p className="text-xs font-medium text-sky-500">
                This note is live on web.
              </p>
            </div>
            <div className="flex items-center">
              <input 
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                value={url}
                disabled
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full text-xs"
              disabled={isSubmitting}
              onClick={onUnpublish}
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe
              className="h-8 w-8 text-muted-foreground mb-2"
            />
            <p className="text-sm font-medium mb-2">
              Publish this note
            </p>
            <span className="text-xs text-muted-foreground mb-4">
              Share your work with others.
            </span>
            <Button
              disabled={isSubmitting}
              onClick={() => {
                onPublish(); // Gọi hàm onPublish
                console.log(initialData._id);
                console.log(initialData.content);

              }}              className="w-full text-xs"
              size="sm"
            >
              Publish on site
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
