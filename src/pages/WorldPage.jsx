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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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
  //Painting Props
  playerPainting,
  // Undo state
  undoHint,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(loading ? 0 : 1);
  const prevLoadingRef = useRef(loading);
  const [isSketchReady, setIsSketchReady] = useState(false);
  const [isPaintingLocked, setIsPaintingLocked] = useState(true);
  const [screenTooSmall, setScreenTooSmall] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const navigate = useNavigate();

  // Check screen width on mount and when window resizes
  useEffect(() => {
    function handleResize() {
      setScreenTooSmall(window.innerWidth < 830);
    }

    // Initial check
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    setShowInstructions(false);
    setIsPaintingLocked(true);
    // TODO: set panel state to default (world)
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

  useEffect(
    // check if panel state is editor, if yes unlock painting
    () => {
      if (currentPanelState === PANEL_STATES.EDITOR) {
        setIsPaintingLocked(false);
      } else {
        setIsPaintingLocked(true);
      }
    },
    [currentPanelState],
  );

  useEffect(() => {
    // Check if the modal is open or closed
    if (isModalOpen) {
      // If the modal is open, lock the painting
      setIsPaintingLocked(true);
    } else {
      // If the modal is closed, unlock the painting
      setIsPaintingLocked(false);
    }
  }, [isModalOpen]);

  if (authStatus !== "loading" && !user) {
    console.log("Auth status: ", authStatus);
    return <Navigate to="/welcome" replace />;
  }

  // Show screen size warning when screen is too small
  if (screenTooSmall) {
    return (
      <div className="font-pixel mx-auto w-full max-h-[calc(100vh-4rem)] p-4">
        <NavBar enableBack={false} title="Pixel World" />
        <div className="font-pixel flex flex-col items-center justify-center text-center gap-4 my-8">
          <div className="bg-white max-w-md">
            <h1 className="text-xl text-red-400">Screen Too Small</h1>
            <p className="text-gray-500 pb-16">
              Please use a larger device or resize your browser window to
              continue.
            </p>
            <p>But you can still check out the museum!</p>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/museum")}
            endIcon={<ArrowForwardIcon />}
          >
            Museum
          </Button>
        </div>
      </div>
    );
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
                undoHint={undoHint}
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
                  disabled={!playerPainting.savedQuote ? true : false}
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
    <div className="font-pixel mx-auto w-[760px] xl:w-full max-h-[calc(100vh-4rem)] px-8 pt-8 overflow-y-scroll">
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
          <div className="flex flex-col items-center justify-center text-center gap-4 pb-4 pt-4">
            <div className="flex w-full flex-col xl:flex-row items-stretch justify-between gap-4 h-auto">
              <div
                id="viewport-container"
                className="w-[708px] border-4 rounded-xl overflow-auto flex-shrink-0 flex-grow-0 relative"
              >
                <button
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center z-10 border-2 border-black cursor-pointer"
                  onClick={() => {
                    setShowInstructions(true);
                    setIsPaintingLocked(true);
                  }}
                  title="Help"
                >
                  <span className="text-xl font-bold">?</span>
                </button>

                {/* Instructions popup */}
                {showInstructions && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-20 p-8">
                    <div className="relative border-2 border-black rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 bg-white">
                      <div className="flex items-center justify-between w-full mb-2">
                        <h2 className="font-bold">How to play</h2>
                        <button
                          className="w-6 h-6 rounded-full flex items-center justify-center font-bold border-2 border-black overflow-hidden bg-white cursor-pointer"
                          onClick={() => {
                            setShowInstructions(false);
                            setIsPaintingLocked(false);
                          }}
                        >
                          <img
                            src="/assets/x.png"
                            alt="Close"
                            className="w-4 h-4"
                            style={{ imageRendering: "pixelated" }}
                          />
                        </button>
                      </div>

                      {/* Instructions content */}
                      <p
                        className={` w-full pb-1 mb-1 ${currentPanelState !== PANEL_STATES.WEATHER && currentPanelState !== PANEL_STATES.EDITOR && currentPanelState !== PANEL_STATES.QUOTE ? "" : "border-b-1"}`}
                      >
                        Use the arrow keys ➡️ ⬅️ ⬆️ to move around the world.
                      </p>
                      {currentPanelState === PANEL_STATES.QUOTE && (
                        <div className="text-start">
                          <h2 className="font-bold">About the quote</h2>
                          <p>
                            Are you having a creative block? Generate a quote to
                            inspire your next creation. You can choose to
                            include this quote to your painting.
                          </p>
                        </div>
                      )}
                      {currentPanelState === PANEL_STATES.EDITOR && (
                        <div className="text-start">
                          <h2 className="font-bold">About the editor</h2>
                          <p>
                            Here you can paint your drawing alongside your quote
                            of the day. Missing a quote? Go back to the quote
                            notice board to get one.
                          </p>
                        </div>
                      )}
                      {currentPanelState === PANEL_STATES.WEATHER && (
                        <div className="text-start">
                          <h2 className="font-bold">About the weather</h2>
                          <p>
                            The weather in your location affects your PixelWorld
                            environment. Let the real-world conditions inspire
                            your pixel art creation!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <ReactP5Wrapper
                  sketch={sketch}
                  weather={weather}
                  currentColor={currentColor}
                  currentTool={currentTool}
                  onPlayerPaintingUpdate={onPlayerPaintingUpdate}
                  playerPainting={playerPainting}
                  onSketchReady={() => setIsSketchReady(true)}
                  isPaintingLocked={isPaintingLocked}
                  currentPanelState={currentPanelState}
                  onPanelStateChange={onPanelStateChange}
                />
              </div>
              <div className="flex-1 flex flex-shrink-0 flex-col w-full xl:w-[364px] h-full xl:h-[408px] items-center justify-center overflow-hidden">
                {/* Dynamic panel content */}
                {renderCurrentPanel()}
              </div>
            </div>
          </div>

          {/* <div className="text-red-500">Debug UI for panel switching</div> */}
          {/* Navigation controls container */}
          <div className="flex justify-between items-center mb-8">
            {/* Panel switching buttons */}
            <div className="flex gap-4">
              <Button
                variant="contained"
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
                variant="contained"
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
                variant="contained"
                color={
                  currentPanelState === PANEL_STATES.QUOTE
                    ? "primary"
                    : "inherit"
                }
                onClick={() => onPanelStateChange(PANEL_STATES.QUOTE)}
              >
                Quote
              </Button>
            </div>

            {/* Museum button */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/museum")}
              endIcon={<ArrowForwardIcon />}
            >
              Museum
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
