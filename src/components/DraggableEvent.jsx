export function DraggableEvent({ event, isSelected, onDelete, onEdit }) {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(event.id);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("clicked");
    onEdit(event.id, event.name);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", event.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex items-center w-full">
      <div
        draggable
        onDragStart={handleDragStart}
        className={`text-xs p-1 rounded cursor-move truncate flex-1 ${
          isSelected ? "text-white bg-white bg-opacity-20" : ""
        }`}
        style={{
          backgroundColor: isSelected ? "rgba(255,255,255,0.2)" : event.color,
          color: isSelected ? "white" : "black",
        }}
        title={event.name}
      >
        <span className="truncate">{event.name}</span>
      </div>
      <button
        onClick={handleEditClick}
        className="ml-1 text-xs opacity-70 hover:opacity-100 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0"
        style={{ fontSize: "10px" }}
        title="Edit"
      >
        ✎
      </button>
      <button
        onClick={handleDeleteClick}
        className="ml-1 text-xs opacity-70 hover:opacity-100 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0"
        style={{ fontSize: "10px" }}
        title="Delete"
      >
        ×
      </button>
    </div>
  );
}
