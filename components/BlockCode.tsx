import React, { useState, useRef, useEffect } from 'react';
import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { MdCancel, MdCheckCircle, MdError, MdInfo } from "react-icons/md";
import { toast } from "sonner";
import "./styles.css";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodeBlockProps {
  block: {
    props: {
      type: string;
      content: string;
    };
  };
  editor: {
    updateBlock: (block: any, props: any) => void;
  };
}

const CodeBlock = createReactBlockSpec(
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
    render: CodeBlockRender,
  }
);

function CodeBlockRender(props: CodeBlockProps) {
  const [showTextarea, setShowTextarea] = useState(props.block.props.content === "" && !window.location.pathname.includes("/preview"));
  const [outputHidden, setOutputHidden] = useState(showTextarea);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [copyText, setCopyText] = useState("Copy");


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
  const handleCopy = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation(); // Prevent the click event from propagating
    navigator.clipboard.writeText(props.block.props.content)
      .then(() => {
        setCopyText("Copied!");
        setTimeout(() => setCopyText("Copy"), 2000); // Reset the text after 5 seconds
        toast.success("Code copied to clipboard!");
      })
      .catch((error) => {
        toast.error("Failed to copy code to clipboard.");
        console.error("Error copying code:", error);
      });
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
          <SyntaxHighlighter style={github} language="bash" showLineNumbers={true} className="custom-syntax-highlighter">
            {props.block.props.content}
          </SyntaxHighlighter>
          <button className="copy-button" onClick={handleCopy}>{copyText}</button>
        </div>
        
      )}
    </div>
  );
}

export default CodeBlock;
