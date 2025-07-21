import { useState } from "react";
import moment from "moment";
import { useEventManager } from "./hooks/useEventManager";
import { CalendarHeader } from "./components/CalendarHeader";
import { CalendarGrid } from "./components/CalendarGrid";
import { SearchBar } from "./components/SearchBar";
import { SearchResults } from "./components/SearchResults";
import { Instructions } from "./components/Instructions";
import { RecurringEventModal } from "./components/RecurringEventModal";

function App() {
  const [currentDate, setCurrentDate] = useState(moment());
  const [searchResults, setSearchResults] = useState([]);

  const {
    events,
    recurringEvents,
    recurringModalOpen,
    targetDate,
    addEvent,
    addRecurringEvent,
    createRecurringEvent,
    deleteEvent,
    editEvent,
    moveEvent,
    getAllEventsForDate,
    closeRecurringModal,
  } = useEventManager();

  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, "month"));
  };

  const goToToday = () => {
    setCurrentDate(moment());
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const handleDeleteEvent = (eventId) => {
    deleteEvent(eventId);
    setSearchResults((prevResults) =>
      prevResults.filter((event) => event.id !== eventId)
    );
  };

  const handleEditEvent = (eventId, currentName) => {
    const newName = prompt("Edit event name:", currentName);
    if (newName !== null && newName.trim()) {
      editEvent(eventId, newName);
      setSearchResults((prevResults) =>
        prevResults.map((event) =>
          event.id === eventId ? { ...event, name: newName.trim() } : event
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <CalendarHeader onGoToToday={goToToday} />

        <SearchBar
          events={events}
          recurringEvents={recurringEvents}
          onSearchResults={handleSearchResults}
        />

        <SearchResults
          searchResults={searchResults}
          onDeleteEvent={handleDeleteEvent}
          onEditEvent={handleEditEvent}
        />

        <CalendarGrid
          currentDate={currentDate}
          events={events}
          getEventsForDate={getAllEventsForDate}
          onAddEvent={addEvent}
          onAddRecurringEvent={addRecurringEvent}
          onDeleteEvent={deleteEvent}
          onEditEvent={editEvent}
          onMoveEvent={moveEvent}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
        />

        <Instructions />

        <RecurringEventModal
          isOpen={recurringModalOpen}
          onClose={closeRecurringModal}
          onSubmit={createRecurringEvent}
          targetDate={targetDate}
        />
      </div>
    </div>
  );
}

export default App;
