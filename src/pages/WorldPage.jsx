import { ReactP5Wrapper } from "@p5-wrapper/react";
import { sketch } from "../components/sketch";
import { PixelEditorComponent } from "../components/PixelEditorComponent";
import { WeatherDashboard } from "../components/WeatherDashboard";
import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import { SubmitModal } from "../components/SubmitModal";
import { Button, ButtonGroup } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { QuoteBoard } from "../components/QuoteBoard";
import { PANEL_STATES } from "../app/slices/worldSlice";

export function WorldPage({
  quote,
  quotesRemaining,
  quoteStatus,
  quoteError,
  selectedColor,
  painting,
  weather,
  user,
  currentPanelState,
  onPanelStateChange,
  onGetWeather,
  onGetQuote,
  onCheckQuoteData,
  onSaveQuoteToPainting,
  onSelectQuote,
  onDeleteQuote,
  onDrawPixel,
  onSelectColor,
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
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    onGetWeather();
  }, []);

  useEffect(() => {
    // Check the user's quote data when component mounts
    if (user && user.uid) {
      onCheckQuoteData(user.uid);
    }
  }, [user, onCheckQuoteData]);

  // Renders the appropriate panel based on current state
  const renderCurrentPanel = () => {
    switch (currentPanelState) {
      case PANEL_STATES.WEATHER:
        return <WeatherDashboard weather={weather} />;
      case PANEL_STATES.EDITOR:
        return (
          <div className="flex flex-col items-center justify-center h-full w-full bg-gray-300 pb-2">
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
            />
            <Button
              variant="contained"
              color="success"
              endIcon={<SendIcon />}
              onClick={() => setIsModalOpen(true)}
            >
              Submit Painting
            </Button>
          </div>
        );
      case PANEL_STATES.QUOTE:
        return (
          <QuoteBoard
            user={user}
            quote={quote}
            onGetNewQuote={getNewQuote}
            quotesRemaining={quotesRemaining}
            quoteStatus={quoteStatus}
            quoteError={quoteError}
            includeQuote={playerPainting.savedQuote === quote} // Default value, or use state if you implement this
            onSaveQuoteToPainting={onSaveQuoteToPainting}
          />
        );
      default:
        return <div>Invalid panel state</div>;
    }
  };

  return (
    <div className="font-pixel mx-auto w-full max-h-[calc(100vh-4rem)] px-8 pt-8">
      <NavBar enableBack={false} title="Pixel World" />
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
            />
          </div>
          <div className="border-4 rounded-xl flex-1 flex flex-shrink-0 flex-col w-264 items-center justify-center overflow-hidden">
            {/* Dynamic panel content */}
            {renderCurrentPanel()}
          </div>
        </div>
      </div>
      <div className="text-red-500">Debug UI for panel switching</div>
      {/* // Debug panel for switching between states */}
      <div className="mb-4">
        <ButtonGroup variant="contained" aria-label="Panel switcher">
          <Button
            color={
              currentPanelState === PANEL_STATES.WEATHER ? "primary" : "inherit"
            }
            onClick={() => onPanelStateChange(PANEL_STATES.WEATHER)}
          >
            Weather
          </Button>
          <Button
            color={
              currentPanelState === PANEL_STATES.EDITOR ? "primary" : "inherit"
            }
            onClick={() => onPanelStateChange(PANEL_STATES.EDITOR)}
          >
            Editor
          </Button>
          <Button
            color={
              currentPanelState === PANEL_STATES.QUOTE ? "primary" : "inherit"
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
