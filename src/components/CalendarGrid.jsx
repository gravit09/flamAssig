import moment from "moment";
import { CalendarDay } from "./CalendarDay";
import { MonthNavigation } from "./MonthNavigation";

export function CalendarGrid({
  currentDate,
  events,
  getEventsForDate,
  onAddEvent,
  onDeleteEvent,
  onMoveEvent,
  onPreviousMonth,
  onNextMonth,
}) {
  const getDaysInMonth = () => {
    const start = moment(currentDate).startOf("month").startOf("week");
    const end = moment(currentDate).endOf("month").endOf("week");
    const days = [];
    let day = start.clone();

    while (day.isSameOrBefore(end)) {
      days.push(day.clone());
      day.add(1, "day");
    }
    return days;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <MonthNavigation
        currentDate={currentDate}
        onPreviousMonth={onPreviousMonth}
        onNextMonth={onNextMonth}
      />

      <div className="grid grid-cols-7 bg-gray-50 border-b">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-4 text-center font-semibold text-gray-600"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {getDaysInMonth().map((day, index) => {
          const isCurrentMonth = day.isSame(currentDate, "month");
          const isToday = day.isSame(moment(), "day");
          const isSelected = day.isSame(currentDate, "day");
          const dayEvents = getEventsForDate(day);

          return (
            <CalendarDay
              key={index}
              day={day}
              events={dayEvents}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              isSelected={isSelected}
              onAddEvent={onAddEvent}
              onDeleteEvent={onDeleteEvent}
              onMoveEvent={onMoveEvent}
            />
          );
        })}
      </div>
    </div>
  );
}
