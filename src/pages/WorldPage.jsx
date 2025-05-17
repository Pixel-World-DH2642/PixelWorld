import { ReactP5Wrapper } from "@p5-wrapper/react";
import { sketch } from "../components/Sketch";
import { PixelEditorComponent } from "../components/PixelEditorComponent";
import { WeatherDashboard } from "../components/WeatherDashboard";
import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import { SubmitModal } from "../components/SubmitModal";
import { Link } from "react-router-dom";
import { Button, ButtonGroup } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { QuoteBoard } from "../components/QuoteBoard";
import { PANEL_STATES } from "../app/slices/worldSlice";

export function WorldPage({
  quote,
  selectedColor,
  painting,
  weather,
  user,
  currentPanelState,
  onPanelStateChange,
  onGetWeather,
  onGetQuote,
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
  //Image funcs later, make different slice...
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  function getNewQuote() {
    onGetQuote();
  }

  useEffect(() => {
    onGetWeather();
  }, []);

  // Renders the appropriate panel based on current state
  const renderCurrentPanel = () => {
    switch (currentPanelState) {
      case PANEL_STATES.WEATHER:
        return <WeatherDashboard weather={weather} />;
      case PANEL_STATES.EDITOR:
        return (
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
          />
        );
      case PANEL_STATES.QUOTE:
        return <QuoteBoard quote={quote} onGetNewQuote={getNewQuote} />;
      default:
        return <div>Invalid panel state</div>;
    }
  };

  // Debug panel for switching between states
  const PanelSwitcher = () => {
    return (
      <div className="mb-8">
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
    );
  };

  // Rest of your painting data setup...
  painting = {
    colorMatrix: [
      // ...existing long array of colors
    ],
  };

  const NavigationPanel = () => {
    // ...existing NavigationPanel code
  };

  return (
    <div className="font-pixel mx-auto w-full max-h-[calc(100vh-4rem)] px-8 pt-8">
      <NavBar enableBack={false} title="Pixel World" />
      <div className="flex flex-col items-center justify-center text-center gap-4 pb-8 pt-4">
        <div className="flex w-full items-stretch justify-between gap-4 h-auto">
          <div className="border-4 rounded-xl overflow-auto flex-shrink-0 flex-grow-0">
            <ReactP5Wrapper
              sketch={sketch}
              weather={weather}
              currentColor={currentColor}
              currentTool={currentTool}
            />
          </div>
          <div className="border-4 rounded-xl flex-1 flex flex-shrink-0 flex-col w-264 items-center justify-center overflow-hidden">
            {/* Dynamic panel content */}
            {renderCurrentPanel()}
          </div>
        </div>
      </div>
      <div className="text-red-500">Debug UI for panel switching</div>
      <PanelSwitcher />

      <SubmitModal
        quote={quote}
        painting={painting}
        user={user}
        onSubmitPainting={onSubmitPainting}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paintingSubmission={paintingSubmission}
      />
    </div>
  );
}
