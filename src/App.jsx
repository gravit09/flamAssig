import { useState } from "react";
import moment from "moment";
import { useEventTools } from "./hooks/useEventManager";
import { CalendarHeader } from "./components/CalendarHeader";
import { CalendarGrid } from "./components/CalendarGrid";
import { SearchBar } from "./components/SearchBar";
import { SearchResults } from "./components/SearchResults";
import { Instructions } from "./components/Instructions";
import {
  RecurringEventModal,
  DialogBox,
} from "./components/RecurringEventModal";

function App() {
  const [currentDate, setCurrentDate] = useState(moment());
  const [searchResults, setSearchResults] = useState([]);
  const {
    events,
    recurringEvents,
    recurringModalOpen,
    targetDate,
    addEvent,
    addRecurring,
    createRecurring,
    removeEvent,
    editEvent,
    moveEvent,
    getAllEventsForDate,
    closeRecurringModal,
    dialogState,
    dialogDispatch,
  } = useEventTools();

  const goPrevMonth = () =>
    setCurrentDate(currentDate.clone().subtract(1, "month"));
  const goNextMonth = () => setCurrentDate(currentDate.clone().add(1, "month"));
  const goToday = () => setCurrentDate(moment());

  const handleSearchResults = (results) => setSearchResults(results);
  const handleDelete = (id) => {
    removeEvent(id);
    setSearchResults((list) => list.filter((ev) => ev.id !== id));
  };
  const handleEdit = (id, name) => {
    editEvent(id, name, true);
    setSearchResults((list) => list);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <CalendarHeader onGoToToday={goToday} />
        <SearchBar
          events={events}
          recurringEvents={recurringEvents}
          onSearchResults={handleSearchResults}
        />
        <SearchResults
          searchResults={searchResults}
          onDeleteEvent={handleDelete}
          onEditEvent={handleEdit}
        />
        <CalendarGrid
          currentDate={currentDate}
          events={events}
          getEventsForDate={getAllEventsForDate}
          onAddEvent={addEvent}
          onAddRecurringEvent={addRecurring}
          onDeleteEvent={removeEvent}
          onEditEvent={handleEdit}
          onMoveEvent={moveEvent}
          onPreviousMonth={goPrevMonth}
          onNextMonth={goNextMonth}
        />
        <Instructions />
        <RecurringEventModal
          isOpen={recurringModalOpen}
          onClose={closeRecurringModal}
          onSubmit={createRecurring}
          targetDate={targetDate}
        />
        <DialogBox
          isOpen={dialogState.open}
          onClose={() => dialogDispatch({ type: "CLOSE" })}
          title={dialogState.mode === "input" ? "Input" : "Warning"}
        >
          <DialogContent
            dialogState={dialogState}
            dialogDispatch={dialogDispatch}
          />
        </DialogBox>
      </div>
    </div>
  );
}

function DialogContent({ dialogState, dialogDispatch }) {
  const [val, setVal] = useState(dialogState.defaultValue || "");
  if (dialogState.mode === "input") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dialogState.onConfirm(val);
        }}
      >
        <div className="mb-4">{dialogState.text}</div>
        <input
          autoFocus
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={() => dialogDispatch({ type: "CLOSE" })}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            OK
          </button>
        </div>
      </form>
    );
  }
  return (
    <div>
      <div className="mb-4 whitespace-pre-line">{dialogState.text}</div>
      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => {
            dialogState.onConfirm && dialogState.onConfirm();
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default App;
