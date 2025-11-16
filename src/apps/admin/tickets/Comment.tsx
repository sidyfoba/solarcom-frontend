import React, { useRef, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Tooltip,
  Divider,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";

// ---- Types ----
export interface CommentAttachment {
  id: string;
  name: string;
  type: string; // mime type string like "image/png", "application/pdf", etc.
  url?: string; // optional if already uploaded / stored
}

export interface CommentMessage {
  id: string;
  author: string;
  text: string;
  createdAt: string; // ISO string
  isOwn?: boolean; // true if message is from current user (for alignment)
  attachments?: CommentAttachment[];
}

interface CommentProps {
  messages: CommentMessage[];
  onSend: (payload: { text: string; files: File[] }) => void;
  loading?: boolean;
}

const Comment: React.FC<CommentProps> = ({ messages, onSend, loading }) => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
    // reset input so same file can be selected again later
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (!text.trim() && files.length === 0) return;
    onSend({ text: text.trim(), files });
    setText("");
    setFiles([]);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderAttachmentChip = (att: CommentAttachment) => {
    const isImage = att.type.startsWith("image/");
    const isVideo = att.type.startsWith("video/");
    const isPdf = att.type === "application/pdf";
    const isExcel =
      att.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      att.type === "application/vnd.ms-excel";
    const isWord =
      att.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      att.type === "application/msword";

    let labelPrefix = "File";
    if (isImage) labelPrefix = "Image";
    else if (isVideo) labelPrefix = "Video";
    else if (isPdf) labelPrefix = "PDF";
    else if (isExcel) labelPrefix = "Excel";
    else if (isWord) labelPrefix = "Word";

    return (
      <Chip
        key={att.id}
        label={`${labelPrefix}: ${att.name}`}
        size="small"
        sx={{ maxWidth: "100%" }}
        component={att.url ? "a" : "div"}
        clickable={!!att.url}
        href={att.url}
        target={att.url ? "_blank" : undefined}
        rel={att.url ? "noopener noreferrer" : undefined}
      />
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={2}>
        {/* Header */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Comments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Discuss this item, share updates, and attach files (images, videos,
            PDFs, Word, Excel, etc.).
          </Typography>
        </Box>

        {/* Chat Card */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            height: 420,
          }}
        >
          {/* Messages list */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              pr: 1,
              mb: 2,
            }}
          >
            {messages.length === 0 ? (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No comments yet. Be the first to comment.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1.5}>
                {messages.map((msg) => {
                  const alignment = msg.isOwn ? "flex-end" : "flex-start";
                  const bubbleColor = (theme: any) =>
                    msg.isOwn
                      ? theme.palette.primary.main
                      : theme.palette.grey[200];
                  const textColor = (theme: any) =>
                    msg.isOwn
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary;

                  return (
                    <Box
                      key={msg.id}
                      sx={{
                        display: "flex",
                        justifyContent: alignment,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          maxWidth: "80%",
                          flexDirection: msg.isOwn ? "row-reverse" : "row",
                        }}
                      >
                        <Avatar sx={{ width: 28, height: 28 }}>
                          {msg.author?.[0]?.toUpperCase() || "U"}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "block",
                              textAlign: msg.isOwn ? "right" : "left",
                              mb: 0.3,
                            }}
                          >
                            {msg.author} · {formatDate(msg.createdAt)}
                          </Typography>
                          <Box
                            sx={(theme) => ({
                              backgroundColor: bubbleColor(theme),
                              color: textColor(theme),
                              borderRadius: 2,
                              px: 1.5,
                              py: 1,
                              wordBreak: "break-word",
                              fontSize: 14,
                            })}
                          >
                            {msg.text}
                          </Box>

                          {msg.attachments && msg.attachments.length > 0 && (
                            <Stack
                              direction="row"
                              spacing={0.5}
                              flexWrap="wrap"
                              sx={{ mt: 0.5 }}
                            >
                              {msg.attachments.map(renderAttachmentChip)}
                            </Stack>
                          )}
                        </Box>
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* Selected files preview */}
          {files.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Attachments:
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" mt={0.5}>
                {files.map((file, index) => (
                  <Chip
                    key={`${file.name}-${index}`}
                    size="small"
                    label={file.name}
                    onDelete={() => handleRemoveFile(index)}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Input + actions */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              gap: 1,
            }}
          >
            <Tooltip title="Attach files">
              <IconButton
                size="small"
                onClick={openFileDialog}
                sx={{ mb: "4px" }}
              >
                <AttachFileIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleSelectFiles}
              // Allow images, videos, PDFs, Word, Excel, etc.
              accept="
                image/*,
                video/*,
                application/pdf,
                application/msword,
                application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                application/vnd.ms-excel,
                application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                .csv
              "
            />

            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Write a comment…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              variant="outlined"
              size="small"
            />

            <Tooltip title="Send">
              <span>
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={loading || (!text.trim() && files.length === 0)}
                  sx={{ mb: "4px" }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
};

export default Comment;
