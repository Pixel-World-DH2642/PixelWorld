import { ReactP5Wrapper } from "@p5-wrapper/react";
import { sketch } from "../components/sketch";
import { PixelEditorComponent } from "../components/PixelEditorComponent";
import { WeatherDashboard } from "../components/WeatherDashboard";
import { useEffect, useState, useRef } from "react";
import { NavBar } from "../components/NavBar";
import { SubmitModal } from "../components/SubmitModal";
import { Button, ButtonGroup } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, Navigate } from "react-router-dom";
import { QuoteBoard } from "../components/QuoteBoard";
import { PANEL_STATES } from "../app/slices/worldSlice";
import { Suspense } from "../components/Suspense";

export function WorldPage({
  loading,
  error,
  quote,
  quotesRemaining,
  quoteStatus,
  quoteError,
  includeQuote,
  selectedColor,
  weather,
  weatherStatus,
  weatherError,
  user,
  authStatus,
  currentPanelState,
  onPanelStateChange,
  onGetWeather,
  onGetQuote,
  onCheckQuoteData,
  onSaveQuoteToPainting,
  onRemoveQuoteFromPainting,
  onSubmitPainting,
  onResetPainting,
  paintingSubmission,
  //Pixel Editor Props
  colorPaletteArray,
  currentColor,
  currentTool,
  selectedPaletteSlot,
  //Pixel Editor Funcs
  onToolSelect,
  onColorSelect,
  onPaletteUpdated,
  onPaletteInitialize,
  onSlotSelected,
  //Painting Funcs
  onPlayerPaintingUpdate,
  onUndoEdit,
  onRedoEdit,
  onGetUndoStateHint,
  onClearPlayerPainting,
  //Painting Props
  playerPainting,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(loading ? 0 : 1);
  const prevLoadingRef = useRef(loading);
  const [isSketchReady, setIsSketchReady] = useState(false);

  const navigate = useNavigate();

  function getNewQuote() {
    if (user && user.uid) {
      onGetQuote(user.uid);
    } else {
      // Handle case where user is not logged in
      console.error("User must be logged in to get quotes");
      // Maybe show a login prompt
    }
  }

  useEffect(() => {
    console.log("isSketchReady: ", isSketchReady);
  }, [isSketchReady]);

  useEffect(() => {
    onGetWeather();
  }, []);

  useEffect(() => {
    // Check the user's quote data when component mounts
    if (user && user.uid) {
      onCheckQuoteData(user.uid);
    }
  }, [user, onCheckQuoteData]);

  // Handle loading state transitions
  useEffect(() => {
    // If loading state has changed
    if (prevLoadingRef.current !== loading) {
      if (loading) {
        console.log("Loading started");
        setContentOpacity(0); // Fade out content
      } else {
        console.log("Loading finished");
        // Transitioning from loading to content
        setTimeout(() => {
          setContentOpacity(1); // Fade in content
        }, 50);
      }
      prevLoadingRef.current = loading;
    }
  }, [loading]);

  if (authStatus !== "loading" && !user) {
    console.log("Auth status: ", authStatus);
    return <Navigate to="/welcome" replace />;
  }

  // Renders the appropriate panel based on current state
  const renderCurrentPanel = () => {
    switch (currentPanelState) {
      case PANEL_STATES.WEATHER:
        return (
          <div className="w-full h-full border-4 rounded-xl flex flex-col items-center justify-center bg-gray-300 p-4 overflow-hidden">
            <WeatherDashboard weather={weather} />
          </div>
        );
      case PANEL_STATES.EDITOR:
        return (
          <div className="w-full h-full flex flex-col items-center overflow-hidden gap-4">
            <div className="border-4 rounded-xl flex flex-col items-center justify-center w-full h-[260px] bg-gray-300 pb-2 overflow-hidden">
              <PixelEditorComponent
                colorPaletteArray={colorPaletteArray}
                currentColor={currentColor}
                currentTool={currentTool}
                selectedPaletteSlot={selectedPaletteSlot}
                onToolSelect={onToolSelect}
                onColorSelect={onColorSelect}
                onPaletteUpdated={onPaletteUpdated}
                onPaletteInitialize={onPaletteInitialize}
                onSlotSelected={onSlotSelected}
                //Painting Slice
                onUndoEdit={onUndoEdit}
                onRedoEdit={onRedoEdit}
                onGetUndoStateHint={onGetUndoStateHint}
                onPlayerPaintingUpdate={onPlayerPaintingUpdate}
              />
            </div>
            <div className="flex flex-col h-[132px] items-center justify-between w-full border-4 rounded-xl bg-gray-300 p-2 gap-2">
              <div className="w-full h-full flex flex-col items-start gap-1 rounded-md bg-gray-100 p-2 overflow-y-scroll">
                <p
                  className={`text-sm text-start text-wrap wrap-break-word ${playerPainting.savedQuote ? "" : "italic text-gray-500"}`}
                >
                  {playerPainting.savedQuote?.content ||
                    "No quote saved for this painting yet."}
                </p>
                <p className="text-xs italic text-end self-end">
                  {playerPainting.savedQuote
                    ? "- " + playerPainting.savedQuote?.author
                    : ""}
                </p>
              </div>
              <div className="flex items-center w-full justify-between">
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  endIcon={<DeleteIcon />}
                  onClick={() => {
                    onRemoveQuoteFromPainting();
                  }}
                  disabled={!playerPainting.savedQuote}
                >
                  Remove Quote
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  endIcon={<SendIcon />}
                  onClick={() => setIsModalOpen(true)}
                >
                  Submit Painting
                </Button>
              </div>
            </div>
          </div>
        );
      case PANEL_STATES.QUOTE:
        return (
          <div className="w-full h-full border-4 rounded-xl flex flex-col items-center justify-center overflow-hidden">
            <QuoteBoard
              user={user}
              quote={quote}
              onGetNewQuote={getNewQuote}
              quotesRemaining={quotesRemaining}
              quoteStatus={quoteStatus}
              quoteError={quoteError}
              includeQuote={includeQuote} // Default value, or use state if you implement this
              onSaveQuoteToPainting={onSaveQuoteToPainting}
            />
          </div>
        );
      default:
        return <div>Invalid panel state</div>;
    }
  };

  return (
    <div className="font-pixel mx-auto w-full max-h-[calc(100vh-4rem)] px-8 pt-8">
      <NavBar enableBack={false} title="Pixel World" />

      {/* Loading state with transition */}
      <div
        className={`transition-opacity duration-300 ${loading || weatherStatus === "loading" || !isSketchReady ? "opacity-100" : "opacity-0"} ${loading || weatherStatus === "loading" || !isSketchReady ? "" : "hidden"} flex justify-center items-center h-[50vh]`}
      >
        {Suspense("loading", "Loading pixel world...")}
      </div>

      {/* Main content with transitions */}
      {!loading && !error && weatherStatus === "succeeded" && (
        <div
          className={`transition-opacity duration-300 ${contentOpacity === 0 ? "opacity-0" : "opacity-100"} ${loading || weatherStatus === "loading" || !isSketchReady ? "hidden" : ""}`}
        >
          <div className="flex flex-col items-center justify-center text-center gap-4 pb-8 pt-4">
            <div className="flex w-full items-stretch justify-between gap-4 h-auto">
              <div
                id="viewport-container"
                className="border-4 rounded-xl overflow-auto flex-shrink-0 flex-grow-0"
              >
                <ReactP5Wrapper
                  sketch={sketch}
                  weather={weather}
                  currentColor={currentColor}
                  currentTool={currentTool}
                  onPlayerPaintingUpdate={onPlayerPaintingUpdate}
                  playerPainting={playerPainting}
                  onSketchReady={() => setIsSketchReady(true)}
                  currentPanelState={currentPanelState}
                  onPanelStateChange={onPanelStateChange}
                />
              </div>
              <div className="flex-1 flex flex-shrink-0 flex-col w-264 items-center justify-center overflow-hidden">
                {/* Dynamic panel content */}
                {renderCurrentPanel()}
              </div>
            </div>
          </div>

          <div className="text-red-500">Debug UI for panel switching</div>
          {/* Debug panel for switching between states */}
          <div className="mb-4">
            <ButtonGroup variant="contained" aria-label="Panel switcher">
              <Button
                color={
                  currentPanelState === PANEL_STATES.WEATHER
                    ? "primary"
                    : "inherit"
                }
                onClick={() => onPanelStateChange(PANEL_STATES.WEATHER)}
              >
                Weather
              </Button>
              <Button
                color={
                  currentPanelState === PANEL_STATES.EDITOR
                    ? "primary"
                    : "inherit"
                }
                onClick={() => onPanelStateChange(PANEL_STATES.EDITOR)}
              >
                Editor
              </Button>
              <Button
                color={
                  currentPanelState === PANEL_STATES.QUOTE
                    ? "primary"
                    : "inherit"
                }
                onClick={() => onPanelStateChange(PANEL_STATES.QUOTE)}
              >
                Quote
              </Button>
            </ButtonGroup>
          </div>
          {/* Debug UI for navigate to museum */}
          <div className="mb-4">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/museum")}
            >
              Go to Museum
            </Button>
          </div>
          <div className="mb-4"></div>
        </div>
      )}

      <SubmitModal
        painting={playerPainting}
        user={user}
        onSubmitPainting={onSubmitPainting}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paintingSubmission={paintingSubmission}
      />
    </div>
  );
}
