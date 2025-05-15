import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { PaintingDisplay } from "../components/PaintingDisplay";
import { useNavigate } from "react-router-dom";
import { Suspense } from "../components/Suspense";
import Button from "@mui/material/Button";

export function DetailPage({
  painting,
  isLoading,
  error,
  comments = [],
  commentsLoading = false,
  commentsError = null,
  currentUser,
  likesCount,
  userLiked,
  likesLoading,
  onAddComment,
  onDeleteComment,
  onClearComments,
  onToggleLike,
  onClearLikes,
}) {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");

  if (!isLoading && !painting) {
    return <Navigate to="/museum" replace />;
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser || !painting) return;

    onAddComment(
      painting.id,
      currentUser.uid,
      currentUser.displayName || "Anonymous",
      newComment,
    );
    setNewComment("");
  };

  return (
    <section className="font-pixel mx-auto w-full max-h-[calc(100vh-4rem)] px-8 pt-8">
      <button
        onClick={() => {
          onClearComments();
          onClearLikes();
          navigate(-1);
        }}
        className="flex transition transform duration-200 items-center cursor-pointer"
      >
        <img src="/assets/back_arrow.png" className="h-8"></img>
        <div className="pl-4 hover:underline flex text-xl sm:text-3xl">
          Back
        </div>
      </button>
      {isLoading && Suspense("loading", "Loading painting details...")}
      {!isLoading && !error && (
        <div className="flex flex-col md:flex-row gap-8 mt-4">
          <div className="aspect-square w-full md:w-1/2 min-w-[250px] shrink-0 pb-8">
            <PaintingDisplay painting={painting} />
          </div>
          <div className="overflow-y-auto w-full md:w-1/2 md:aspect-square flex flex-col pb-8">
            <div className="w-full h-full">
              <h1 className="text-3xl pb-1">{painting.title}</h1>
              <div className="pb-2">
                <span>"{painting.savedQuote}"</span>
              </div>
              <div>
                <span className="font-bold">Made by: {painting.author}</span>
              </div>
              <div>
                <span>{painting.authorNotes}</span>
              </div>
              <div className="flex items-center gap-2 my-4">
                <button
                  onClick={() =>
                    currentUser?.uid
                      ? onToggleLike(painting.id, currentUser.uid)
                      : null
                  }
                  className={`cursor-pointer text-xl sm:text-3xl transition transform duration-200 ${userLiked ? "scale-110" : "hover:scale-110"}`}
                  disabled={!currentUser || likesLoading}
                >
                  <img
                    src={
                      userLiked
                        ? "/assets/heart.png"
                        : "/assets/heart_empty.png"
                    }
                    className="w-10 h-10"
                    alt={userLiked ? "Unlike" : "Like"}
                  />
                </button>
                <span className="flex items-center text-0.5xl">
                  {likesLoading ? "..." : likesCount}
                </span>
              </div>

              {/* Comments Section */}
              <div className="mt-4">
                <span className="font-bold">Comments</span>
                <div className="pt-2 pb-3">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={
                      currentUser
                        ? "Leave your comment"
                        : "Please login to comment"
                    }
                    className="border border-black rounded-md px-2 pt-1 w-full min-h-15 mb-2"
                    disabled={!currentUser}
                  ></textarea>
                  <Button
                    variant="outlined"
                    onClick={handleAddComment}
                    disabled={
                      !currentUser || !newComment.trim() || commentsLoading
                    }
                  >
                    {commentsLoading ? "Posting..." : "Post Comment"}
                  </Button>
                </div>

                <div className="pb-8">
                  {commentsLoading && comments.length === 0 ? (
                    <div>Loading comments...</div>
                  ) : comments.length > 0 ? (
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <div key={comment.id} className="border-b pb-2">
                          <div className="font-semibold">
                            {comment.authorName}
                          </div>
                          <div>{comment.text}</div>
                          <div className="flex justify-between items-end">
                            <div className="text-xs text-gray-500">
                              {new Date(comment.timestamp).toLocaleString()}
                            </div>
                            {currentUser?.uid === comment.authorId && (
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() =>
                                  onDeleteComment(comment.id, painting.id)
                                }
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">No comments yet</div>
                  )}
                  {commentsError && (
                    <div className="text-red-500 mt-2">
                      Error loading comments: {commentsError}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
