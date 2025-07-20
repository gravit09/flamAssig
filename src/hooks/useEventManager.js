import { useState } from "react";
import moment from "moment";

export function useEventManager() {
  const [events, setEvents] = useState([]);

  const addEvent = (date) => {
    const dateString = date.format("YYYY-MM-DD");
    const existingEvent = events.find((event) => event.date === dateString);

    if (existingEvent) {
      alert(
        `Warning: There's already an event on ${date.format(
          "MMMM D, YYYY"
        )}.\nEvent: "${
          existingEvent.name
        }"\n\nOnly one event per day is allowed.`
      );
      return;
    }

    const eventName = prompt("Enter event name:");
    if (eventName && eventName.trim()) {
      const newEvent = {
        id: Date.now(),
        name: eventName.trim(),
        date: dateString,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      };
      setEvents([...events, newEvent]);
    }
  };

  const deleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const editEvent = (eventId, newName) => {
    if (!newName || !newName.trim()) {
      return;
    }

    const updatedEvents = events.map((event) =>
      event.id === eventId ? { ...event, name: newName.trim() } : event
    );
    setEvents(updatedEvents);
  };

  const moveEvent = (eventId, newDate) => {
    const existingEvent = events.find((event) => event.date === newDate);
    if (existingEvent) {
      alert(
        `Warning: Cannot move event to ${moment(newDate).format(
          "MMMM D, YYYY"
        )}.\nThere's already an event: "${
          existingEvent.name
        }"\n\nOnly one event per day is allowed.`
      );
      return;
    }

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
    editEvent,
    moveEvent,
    getEventsForDate,
  };
}
