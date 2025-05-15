import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { PaintingDisplay } from "../components/PaintingDisplay";
import { useNavigate } from "react-router-dom";
import { Suspense } from "../components/Suspense";
import Button from "@mui/material/Button";
import { NavBar } from "../components/NavBar";
import { ConfirmationDialog } from "../components/ConfirmationDialog";

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
  onDeletePainting,
}) {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

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

  const handleDeleteComment = (commentId) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Comment",
      message:
        "Are you sure you want to delete this comment? This action cannot be undone.",
      isLoading: false,
      onConfirm: () => {
        // Set loading state
        setConfirmDialog((prev) => ({
          ...prev,
          isLoading: true,
        }));

        onDeleteComment(commentId, painting.id)
          .then(() => {
            // Close dialog
            setConfirmDialog((prev) => ({
              ...prev,
              isOpen: false,
              isLoading: false,
            }));
          })
          .catch((error) => {
            // Reset loading state
            setConfirmDialog((prev) => ({
              ...prev,
              isLoading: false,
              isOpen: false,
            }));
            // Show error dialog
            setErrorDialog({
              isOpen: true,
              title: "Error",
              message: `Error deleting comment: ${error}`,
            });
          });
      },
    });
  };

  const handleDeletePainting = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Painting",
      message:
        "Are you sure you want to delete this painting? This action cannot be undone.",
      isLoading: false,
      onConfirm: () => {
        console.log("Deleting painting with ID:", painting.id);

        // Set loading state
        setConfirmDialog((prev) => ({
          ...prev,
          isLoading: true,
        }));

        onDeletePainting(painting.id, currentUser.uid)
          .unwrap()
          .then(() => {
            // Close dialog
            setConfirmDialog((prev) => ({
              ...prev,
              isOpen: false,
              isLoading: false,
            }));
            // Navigate away
            navigate("/museum");
          })
          .catch((error) => {
            // Reset loading state
            setConfirmDialog((prev) => ({
              ...prev,
              isLoading: false,
              isOpen: false,
            }));
            // Show error dialog
            setErrorDialog({
              isOpen: true,
              title: "Error",
              message: `Error deleting painting: ${error}`,
            });
          });
      },
    });
  };

  return (
    <section className="font-pixel mx-auto w-full max-h-[calc(100vh-4rem)] px-8 pt-8">
      <NavBar
        beforeNavigate={() => {
          onClearComments();
          onClearLikes();
        }}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        isLoading={confirmDialog.isLoading}
      />

      {/* Error Dialog */}
      <ConfirmationDialog
        isOpen={errorDialog.isOpen}
        title={errorDialog.title}
        message={errorDialog.message}
        confirmText="OK"
        confirmColor="primary"
        onConfirm={() => setErrorDialog({ ...errorDialog, isOpen: false })}
        onCancel={() => setErrorDialog({ ...errorDialog, isOpen: false })}
      />

      {isLoading && Suspense("loading", "Loading painting details...")}
      {!isLoading && !error && (
        <div className="flex flex-col md:flex-row gap-8 mt-4">
          <div className="aspect-square w-full md:w-1/2 min-w-[250px] shrink-0 pb-8">
            <PaintingDisplay painting={painting} />
          </div>
          <div className="overflow-y-auto w-full md:w-1/2 md:aspect-square flex flex-col pb-8">
            <div className="w-full h-full">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h1 className="text-3xl mb-4">{painting.title}</h1>

                {painting.savedQuote && (
                  <div className="mb-4">
                    <p className="mb-2 font-semibold">Inspired by quote:</p>
                    <p className="mb-2 italic bg-gray-300 p-2 rounded">
                      {painting.savedQuote}
                    </p>
                  </div>
                )}
                {painting.authorNotes && (
                  <div className="mb-4">
                    <p className="mb-2 font-semibold">Author notes:</p>
                    <p className="mb-2 italic bg-gray-100 p-2 rounded">
                      {painting.authorNotes}
                    </p>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div>
                    <span>Made by: </span>
                    <span className="font-bold">
                      {painting.authorName}
                      {currentUser?.uid === painting.userId ? " [You]" : ""}
                    </span>
                  </div>
                  {currentUser?.uid === painting.userId && (
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={handleDeletePainting}
                    >
                      Delete Painting
                    </Button>
                  )}
                </div>
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
                                onClick={() => handleDeleteComment(comment.id)}
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
