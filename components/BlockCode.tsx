import React, { useState, useRef, useEffect } from 'react';
import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { MdCancel, MdCheckCircle, MdError, MdInfo } from "react-icons/md";
import "./styles.css";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const codeTypes = [
  {
    title: "Java",
    value: "java",
  },
  {
    title: "Python",
    value: "python",
  },
  {
    title: "Javascript",
    value: "javascript",
  },
  {
    title: "Bash",
    value: "bash",
  },
] as const;

export const CodeBlock = createReactBlockSpec(
  {
    type: "codeBlock",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "java",
        values: ["java", "python", "javascript", "bash"],
      },
      content: { default: "", type: "string" },
    },
    content: "none",
  },
  {
    render: (props) => {
      const [showTextarea, setShowTextarea] = useState(props.block.props.content === "" && !window.location.pathname.includes("/preview"));
      const [outputHidden, setOutputHidden] = useState(showTextarea); // Ẩn output khi showTextarea = true
      const textareaRef = useRef<HTMLTextAreaElement>(null);
      const outputRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (!window.location.pathname.includes("/preview") && textareaRef.current && !textareaRef.current.contains(event.target as Node)) {
            if (props.block.props.content === "") {
              setShowTextarea(true);
              setOutputHidden(true);
            } else {
              setShowTextarea(false);
              setOutputHidden(false);
            }
          }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [props.block.props.content]);

      const handleSyntaxHighlighterClick = () => {
        if (!window.location.pathname.includes("/preview")) {
          setShowTextarea(true);
          setOutputHidden(true);
        }
      };

      return (
        <div className={"block-code"} data-alert-type={props.block.props.type}>
          {!window.location.pathname.includes("/preview") && showTextarea && (
            <textarea
              rows={5}
              placeholder="Press to add code"
              className="textarea"
              ref={textareaRef}
              value={props.block.props.content}
              onChange={(e) =>
                props.editor.updateBlock(props.block, {
                  type: "codeBlock",
                  props: { ...props.block.props, content: e.target.value },
                })
              }
            />
          )}
          {(props.block.props.content || !window.location.pathname.includes("/preview")) && (
            <div
              className="custom-syntax-highlighter"
              onClick={handleSyntaxHighlighterClick}
              ref={outputRef}
              style={{ display: outputHidden ? 'none' : 'block' }}
            >
              <SyntaxHighlighter style={github} language="javascript" showLineNumbers={true}
               className="custom-syntax-highlighter">
                {props.block.props.content}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      );
    },
  }
);
