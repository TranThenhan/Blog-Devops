"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import "./Heading.css"; // Import CSS file
import { useConvexAuth } from "convex/react";
import { SignInButton } from "@clerk/clerk-react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
const formatCreationTime = (timestamp: string | number | Date) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const tasks = useQuery(api.documents.get);

  if (!tasks) {
    return (
      <div className="loading-container">
        <div className="loading-animation"></div>
        <p>Please wait...</p>
      </div>
    );
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.isPublished &&
      task.userId === "user_2eQeBWY4pBwNoclOdC2KVtorboL" &&
      (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.content &&
          (() => {
            const parsedContent = JSON.parse(task.content);
            let result = "";
            for (let i = 0; i < parsedContent.length; i++) {
              if (parsedContent[i]?.content && parsedContent[i]?.content[0]?.text) {
                result = parsedContent[i]?.content[0]?.text;
                break;
              }
            }
            return result.toLowerCase().includes(searchTerm.toLowerCase());
          })()
        )
      )
  );


  return (
    <div className="main-markerting">
          <div className="heading-container">
              <div className="search-container">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.1 11.06a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0zm6.94-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .8-.79l-3.74-3.73A8.05 8.05 0 0 0 11.04 3v.01z" fill="currentColor"></path></svg>
              </div>
            {filteredTasks.map((task) => (
              <div className="block" key={task._id} style={{ marginLeft: "10%" }}>
                <div className="top-row">
                  <div className="user-info">
                    <img src={task.userImg} alt="image" className="user-img" />
                    <p>{task.userEdit}</p>
                  </div>
                  <p className="time">{formatCreationTime(task._creationTime)}</p>
                </div>

                <div className="task-container">
                  <Link href={`/preview/${task._id}`}>
                    <div className="info">
                      <h1>{task.title}</h1>
                      <p>
                        {task.content && (
                          (() => {
                            const parsedContent = JSON.parse(task.content);
                            let result = "";
                            for (let i = 0; i < parsedContent.length; i++) {
                              if (parsedContent[i]?.content && parsedContent[i]?.content[0]?.text) {
                                result = parsedContent[i]?.content[0]?.text;
                                break; 
                              }
                            }
                            return result;
                          })()
                        )}
                      </p>
                    </div>
                  </Link>

                  <div className="image">
                    <img
                      src={task.coverImage}
                      alt="image"
                      className={
                        task.coverImage
                          ? "existing-image"
                          : "non-existing-image"
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
      </div>
      <div className="additional-container">
          <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl font-bold sm:text-5xl md:text-4xl right-container">
            Welcome to the <br />
            DevOps Blog
          </h1>
          <div className="image-container">
            <img src="./devops.png" alt="DevOps"  />
          </div>
          <h5 className="text-base  sm:text-xl md:text-xl">
            Discover the latest insights, best practices, and trends in DevOps. <br />
            Explore topics like automation, CI/CD, cloud infrastructure, and more.
          </h5>


          {isLoading && (
            <div className="flex w-full items-center justify-center">
              <Spinner size="lg" />
            </div>
          )}
          {isAuthenticated && !isLoading && (
            <Button asChild>
              <Link href="/documents">
                Enter Blog Devops
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
          {!isAuthenticated && !isLoading && (
            <SignInButton mode="modal">
              <Button>
                Get Blog 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </SignInButton>
          )}
        </div>
          </div>
    </div>


  );
};

export default Heading;
