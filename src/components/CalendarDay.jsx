import { DraggableEvent } from "./DraggableEvent";

export function CalendarDay({
  day,
  events,
  isCurrentMonth,
  isToday,
  isSelected,
  onAddEvent,
  onDeleteEvent,
  onEditEvent,
  onMoveEvent,
}) {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("text/plain");
    const targetDate = day.format("YYYY-MM-DD");
    onMoveEvent(eventId, targetDate);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`min-h-[80px] p-2 border-r border-b border-gray-200 relative ${
        isCurrentMonth ? "bg-white" : "bg-gray-50"
      } ${
        isSelected ? "bg-blue-500 text-white" : ""
      } hover:bg-blue-50 transition-colors cursor-pointer`}
      onDoubleClick={() => onAddEvent(day)}
    >
      <div
        className={`text-sm font-medium ${
          isCurrentMonth ? "text-gray-900" : "text-gray-400"
        } ${isSelected ? "text-gray-900" : ""} ${
          isToday && !isSelected ? "text-blue-600 font-bold" : ""
        }`}
      >
        {day.format("D")}
      </div>

      {isToday && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
      )}

      <div className="mt-1 space-y-1">
        {events.map((event) => (
          <DraggableEvent
            key={event.id}
            event={event}
            isSelected={isSelected}
            onDelete={onDeleteEvent}
            onEdit={onEditEvent}
          />
        ))}
      </div>
    </div>
  );
}
