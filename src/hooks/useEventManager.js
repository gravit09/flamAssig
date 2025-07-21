import { useState, useEffect } from "react";
import moment from "moment";

const STORAGE_KEY = "calendar_events";

const loadEventsFromStorage = () => {
  try {
    const savedEvents = localStorage.getItem(STORAGE_KEY);
    if (savedEvents) {
      return JSON.parse(savedEvents);
    }
  } catch (error) {
    console.error("Error loading events from localStorage:", error);
  }
  return [];
};

export function useEventManager() {
  const [events, setEvents] = useState(loadEventsFromStorage);
  const [recurringEvents, setRecurringEvents] = useState([]);
  const [recurringModalOpen, setRecurringModalOpen] = useState(false);
  const [targetDate, setTargetDate] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("recurring_events", JSON.stringify(recurringEvents));
  }, [recurringEvents]);

  useEffect(() => {
    const savedRecurringEvents = localStorage.getItem("recurring_events");
    if (savedRecurringEvents) {
      try {
        setRecurringEvents(JSON.parse(savedRecurringEvents));
      } catch (error) {
        console.error(
          "Error loading recurring events from localStorage:",
          error
        );
      }
    }
  }, []);

  const generateRecurringEventInstances = (recurringEvent) => {
    const instances = [];
    const start = moment(recurringEvent.startDate);
    const end = moment(recurringEvent.endDate);
    let current = start.clone();

    while (current.isSameOrBefore(end)) {
      instances.push({
        id: `${recurringEvent.id}_${current.format("YYYY-MM-DD")}`,
        name: recurringEvent.name,
        date: current.format("YYYY-MM-DD"),
        color: recurringEvent.color,
        recurringEventId: recurringEvent.id,
        isRecurring: true,
      });

      switch (recurringEvent.frequency) {
        case "daily":
          current.add(recurringEvent.interval, "days");
          break;
        case "weekly":
          current.add(recurringEvent.interval, "weeks");
          break;
        case "monthly":
          current.add(recurringEvent.interval, "months");
          break;
        case "yearly":
          current.add(recurringEvent.interval, "years");
          break;
        default:
          current.add(1, "day");
      }
    }

    return instances;
  };

  const getAllEventsForDate = (date) => {
    const dateString = date.format("YYYY-MM-DD");
    const regularEvents = events.filter((event) => event.date === dateString);

    const recurringInstances = recurringEvents.flatMap(
      generateRecurringEventInstances
    );
    const recurringEventsForDate = recurringInstances.filter(
      (event) => event.date === dateString
    );

    return [...regularEvents, ...recurringEventsForDate];
  };

  const addEvent = (date) => {
    const dateString = date.format("YYYY-MM-DD");
    const existingEvents = getAllEventsForDate(date);

    if (existingEvents.length > 0) {
      alert(
        `Warning: There's already an event on ${date.format(
          "MMMM D, YYYY"
        )}.\nEvent: "${
          existingEvents[0].name
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

  const addRecurringEvent = (date) => {
    setTargetDate(date);
    setRecurringModalOpen(true);
  };

  const createRecurringEvent = (recurringEventData) => {
    const newRecurringEvent = {
      id: Date.now(),
      name: recurringEventData.name,
      startDate: recurringEventData.startDate,
      endDate: recurringEventData.endDate,
      frequency: recurringEventData.frequency,
      interval: recurringEventData.interval,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    };

    setRecurringEvents([...recurringEvents, newRecurringEvent]);
  };

  const deleteEvent = (eventId) => {
    if (eventId.includes("_")) {
      const [recurringEventId] = eventId.split("_");
      setRecurringEvents(
        recurringEvents.filter(
          (event) => event.id !== parseInt(recurringEventId)
        )
      );
    } else {
      setEvents(events.filter((event) => event.id !== eventId));
    }
  };

  const editEvent = (eventId, newName) => {
    if (!newName || !newName.trim()) {
      return;
    }

    if (eventId.includes("_")) {
      const [recurringEventId] = eventId.split("_");
      const updatedRecurringEvents = recurringEvents.map((event) =>
        event.id === parseInt(recurringEventId)
          ? { ...event, name: newName.trim() }
          : event
      );
      setRecurringEvents(updatedRecurringEvents);
    } else {
      const updatedEvents = events.map((event) =>
        event.id === eventId ? { ...event, name: newName.trim() } : event
      );
      setEvents(updatedEvents);
    }
  };

  const moveEvent = (eventId, newDate) => {
    const existingEvents = getAllEventsForDate(moment(newDate));
    if (existingEvents.length > 0) {
      alert(
        `Warning: Cannot move event to ${moment(newDate).format(
          "MMMM D, YYYY"
        )}.\nThere's already an event: "${
          existingEvents[0].name
        }"\n\nOnly one event per day is allowed.`
      );
      return;
    }

    // Check if it's a recurring event instance
    if (eventId.includes("_")) {
      // For recurring events, we'll update the start date of the recurring event
      const [recurringEventId, originalDate] = eventId.split("_");
      const recurringEvent = recurringEvents.find(
        (event) => event.id === parseInt(recurringEventId)
      );
      if (recurringEvent) {
        const dateDiff = moment(newDate).diff(moment(originalDate), "days");
        const updatedRecurringEvents = recurringEvents.map((event) =>
          event.id === parseInt(recurringEventId)
            ? {
                ...event,
                startDate: moment(event.startDate)
                  .add(dateDiff, "days")
                  .format("YYYY-MM-DD"),
                endDate: moment(event.endDate)
                  .add(dateDiff, "days")
                  .format("YYYY-MM-DD"),
              }
            : event
        );
        setRecurringEvents(updatedRecurringEvents);
      }
    } else {
      const updatedEvents = events.map((event) =>
        event.id === parseInt(eventId) ? { ...event, date: newDate } : event
      );
      setEvents(updatedEvents);
    }
  };

  const closeRecurringModal = () => {
    setRecurringModalOpen(false);
    setTargetDate(null);
  };

  return {
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
  };
}
