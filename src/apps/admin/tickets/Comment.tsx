import React from "react";

interface CommentProps {
  commentData: string; // Example of comment data
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Comment: React.FC<CommentProps> = ({ commentData, onChange }) => {
  return (
    <div>
      <h2>Comment Section</h2>
      <input
        type="text"
        value={commentData}
        onChange={onChange}
        placeholder="Enter comment"
      />
    </div>
  );
};

export default Comment;
