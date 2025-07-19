import { useState } from "react";
import moment from "moment";
import { useEventManager } from "./hooks/useEventManager";
import { CalendarHeader } from "./components/CalendarHeader";
import { CalendarGrid } from "./components/CalendarGrid";
import { Instructions } from "./components/Instructions";

function App() {
  const [currentDate, setCurrentDate] = useState(moment());

  const { events, addEvent, deleteEvent, moveEvent, getEventsForDate } =
    useEventManager();

  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, "month"));
  };

  const goToToday = () => {
    setCurrentDate(moment());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <CalendarHeader onGoToToday={goToToday} />

        <CalendarGrid
          currentDate={currentDate}
          events={events}
          getEventsForDate={getEventsForDate}
          onAddEvent={addEvent}
          onDeleteEvent={deleteEvent}
          onMoveEvent={moveEvent}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
        />

        <Instructions />
      </div>
    </div>
  );
}

export default App;
