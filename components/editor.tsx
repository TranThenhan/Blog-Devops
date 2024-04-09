import { Block, BlockNoteSchema, defaultBlockSpecs, filterSuggestionItems, insertOrUpdateBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, SuggestionMenuController, getDefaultReactSlashMenuItems, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { useState } from "react";
import "./styles.css";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";
import "@mantine/core/styles.css";
import { RiAlertFill } from "react-icons/ri";
import { Alert } from "./Alert";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // Adds the Alert block.
    alert: Alert,
  },
});

// Slash menu item to insert an Alert block
const insertAlert = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Alert",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "alert",
    });
  },
  aliases: [
    "alert",
    "notification",
    "emphasize",
    "warning",
    "error",
    "info",
    "success",
  ],
  group: "Other",
  icon: <RiAlertFill />,
});

export default function Editor({
  onChange,
  initialContent,
}: EditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ 
      file
    });

    return response.url;
  }
 
  const editor = useCreateBlockNote({
    schema,
    initialContent: 
      initialContent 
      ? JSON.parse(initialContent) as Block[] 
      : undefined,
    uploadFile: handleUpload
  });
 
  // Renders the editor instance.
  return (
    <BlockNoteView editor={editor} slashMenu={false}
    theme={resolvedTheme === "dark" ? "dark" : "light"}
    onChange={() => {
      // Call the onChange prop with the updated blocks JSON
      onChange(JSON.stringify(editor.document, null, 2));
  
    }}>
      {/* Replaces the default Slash Menu. */}
      <SuggestionMenuController
        triggerCharacter={"/"}
        getItems={async (query) =>
          // Gets all default slash menu items and `insertAlert` item.
          filterSuggestionItems(
            [...getDefaultReactSlashMenuItems(editor), insertAlert(editor)],
            query
          )
        }
      />
    </BlockNoteView>
  );
}
