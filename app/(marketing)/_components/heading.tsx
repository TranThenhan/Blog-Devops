"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import "./Heading.css"; // Import CSS file
import Link from "next/link";

const formatCreationTime = (timestamp: string | number | Date) => {
  const date = new Date(timestamp);
  return date.toLocaleString(); // Chuyển đổi sang định dạng ngày tháng năm
};

const Heading = () => {
  const tasks = useQuery(api.documents.get);

  if (!tasks) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {tasks
        .filter(
          (task) =>
            task.isPublished &&
            task.userId === "user_2eQeBWY4pBwNoclOdC2KVtorboL"
        )
        .map((task) => (
          <div className="block" key={task._id} style={{ marginLeft: "25%" }}>
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
                {task.content && (
                  <div>
                    <p>{JSON.parse(task.content)[0]?.content[0]?.text}</p>
                  </div>
                )}
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
  );
};

export default Heading;
