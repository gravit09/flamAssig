import { useState, useEffect, useReducer } from "react";
import moment from "moment";

const STORAGE_KEY = "calendar_events";

function dialogReducer(state, action) {
  switch (action.type) {
    case "SHOW_ALERT":
      return {
        open: true,
        mode: "alert",
        text: action.text,
        onConfirm: action.onConfirm,
      };
    case "SHOW_INPUT":
      return {
        open: true,
        mode: "input",
        text: action.text,
        defaultValue: action.defaultValue,
        onConfirm: action.onConfirm,
      };
    case "CLOSE":
      return { ...state, open: false };
    default:
      return state;
  }
}

const loadEventsFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [];
};

export function useEventTools() {
  const [events, setEvents] = useState(loadEventsFromStorage);
  const [recurring, setRecurring] = useState([]);
  const [recurringOpen, setRecurringOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [dialogState, dialogDispatch] = useReducer(dialogReducer, {
    open: false,
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);
  useEffect(() => {
    localStorage.setItem("recurring_events", JSON.stringify(recurring));
  }, [recurring]);
  useEffect(() => {
    const saved = localStorage.getItem("recurring_events");
    if (saved) {
      try {
        setRecurring(JSON.parse(saved));
      } catch {}
    }
  }, []);

  function getAllForDate(date) {
    const d = date.format("YYYY-MM-DD");
    const reg = events.filter((ev) => ev.date === d);
    const rec = recurring.flatMap((ev) => {
      const out = [];
      let cur = moment(ev.startDate);
      const end = moment(ev.endDate);
      while (cur.isSameOrBefore(end)) {
        out.push({
          ...ev,
          id: `${ev.id}_${cur.format("YYYY-MM-DD")}`,
          date: cur.format("YYYY-MM-DD"),
          isRecurring: true,
        });
        switch (ev.frequency) {
          case "daily":
            cur.add(ev.interval, "days");
            break;
          case "weekly":
            cur.add(ev.interval, "weeks");
            break;
          case "monthly":
            cur.add(ev.interval, "months");
            break;
          case "yearly":
            cur.add(ev.interval, "years");
            break;
          default:
            cur.add(1, "day");
        }
      }
      return out;
    });
    return [...reg, ...rec.filter((ev) => ev.date === d)];
  }

  function addEvent(date) {
    const dStr = date.format("YYYY-MM-DD");
    const exists = getAllForDate(date);
    if (exists.length) {
      dialogDispatch({
        type: "SHOW_ALERT",
        text: `There's already an event on ${date.format("MMMM D, YYYY")} ("${
          exists[0].name
        }"). Only one event per day allowed.`,
        onConfirm: () => dialogDispatch({ type: "CLOSE" }),
      });
      return;
    }
    dialogDispatch({
      type: "SHOW_INPUT",
      text: "Event name:",
      defaultValue: "",
      onConfirm: (val) => {
        if (val && val.trim()) {
          setEvents((evts) => [
            ...evts,
            {
              id: Date.now(),
              name: val.trim(),
              date: dStr,
              color: `hsl(${Math.random() * 360},70%,60%)`,
            },
          ]);
        }
        dialogDispatch({ type: "CLOSE" });
      },
    });
  }

  function editEvent(eventId, currentName, ask) {
    if (ask) {
      dialogDispatch({
        type: "SHOW_INPUT",
        text: "Edit event name:",
        defaultValue: currentName,
        onConfirm: (val) => {
          if (val && val.trim()) editEvent(eventId, val, false);
          dialogDispatch({ type: "CLOSE" });
        },
      });
      return;
    }
    if (!currentName || !currentName.trim()) return;
    if (String(eventId).includes("_")) {
      const [recId] = String(eventId).split("_");
      setRecurring((list) =>
        list.map((ev) =>
          ev.id === parseInt(recId) ? { ...ev, name: currentName.trim() } : ev
        )
      );
    } else {
      setEvents((list) =>
        list.map((ev) =>
          Number(ev.id) === Number(eventId)
            ? { ...ev, name: currentName.trim() }
            : ev
        )
      );
    }
  }

  function moveEvent(eventId, newDate) {
    const exists = getAllForDate(moment(newDate));
    if (exists.length) {
      dialogDispatch({
        type: "SHOW_ALERT",
        text: `Cannot move event to ${moment(newDate).format(
          "MMMM D, YYYY"
        )} ("${exists[0].name}"). Only one event per day allowed.`,
        onConfirm: () => dialogDispatch({ type: "CLOSE" }),
      });
      return;
    }
    if (String(eventId).includes("_")) {
      const [recId, origDate] = String(eventId).split("_");
      const rec = recurring.find((ev) => ev.id === parseInt(recId));
      if (rec) {
        const diff = moment(newDate).diff(moment(origDate), "days");
        setRecurring((list) =>
          list.map((ev) =>
            ev.id === parseInt(recId)
              ? {
                  ...ev,
                  startDate: moment(ev.startDate)
                    .add(diff, "days")
                    .format("YYYY-MM-DD"),
                  endDate: moment(ev.endDate)
                    .add(diff, "days")
                    .format("YYYY-MM-DD"),
                }
              : ev
          )
        );
      }
    } else {
      setEvents((list) =>
        list.map((ev) =>
          ev.id === parseInt(eventId) ? { ...ev, date: newDate } : ev
        )
      );
    }
  }

  function addRecurring(date) {
    setTarget(date);
    setRecurringOpen(true);
  }

  function createRecurring(data) {
    setRecurring((list) => [
      ...list,
      { ...data, id: Date.now(), color: `hsl(${Math.random() * 360},70%,60%)` },
    ]);
  }

  function removeEvent(eventId) {
    if (String(eventId).includes("_")) {
      const [recId] = String(eventId).split("_");
      setRecurring((list) => list.filter((ev) => ev.id !== parseInt(recId)));
    } else {
      setEvents((list) => list.filter((ev) => ev.id !== eventId));
    }
  }

  function closeRecurring() {
    setRecurringOpen(false);
    setTarget(null);
  }

  return {
    events,
    recurringEvents: recurring,
    recurringModalOpen: recurringOpen,
    targetDate: target,
    addEvent,
    addRecurring,
    createRecurring,
    removeEvent,
    editEvent,
    moveEvent,
    getAllEventsForDate: getAllForDate,
    closeRecurringModal: closeRecurring,
    dialogState,
    dialogDispatch,
  };
}
