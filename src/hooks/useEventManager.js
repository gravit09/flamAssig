import { useState } from "react";

export function useEventManager() {
  const [events, setEvents] = useState([]);

  const addEvent = (date) => {
    const eventName = prompt("Enter event name:");
    if (eventName && eventName.trim()) {
      const newEvent = {
        id: Date.now(),
        name: eventName.trim(),
        date: date.format("YYYY-MM-DD"),
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      };
      setEvents([...events, newEvent]);
    }
  };

  const deleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const moveEvent = (eventId, newDate) => {
    const updatedEvents = events.map((event) =>
      event.id === parseInt(eventId) ? { ...event, date: newDate } : event
    );
    setEvents(updatedEvents);
  };

  const getEventsForDate = (date) => {
    return events.filter((event) => event.date === date.format("YYYY-MM-DD"));
  };

  return {
    events,
    addEvent,
    deleteEvent,
    moveEvent,
    getEventsForDate,
  };
}
