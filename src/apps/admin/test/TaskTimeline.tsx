import React, { useEffect, useRef } from "react";
import interact from "interactjs";

const Timeline = () => {
  const timelineRef = useRef(null);
  const events = [
    { id: 1, label: "Event 1", date: "2022-01-01" },
    { id: 2, label: "Event 2", date: "2022-02-01" },
    { id: 3, label: "Event 3", date: "2022-03-01" },
  ];

  useEffect(() => {
    const draggableElements = interact(".draggable").draggable({
      onmove: dragMoveListener,
    });

    return () => {
      draggableElements.unset();
    };
  }, []);

  const dragMoveListener = (event) => {
    const target = event.target;
    const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.deltaX;

    // Update the position
    target.style.transform = `translateX(${x}px)`;

    // Store the position
    target.setAttribute("data-x", x);
  };

  return (
    <div
      style={{
        position: "relative",
        padding: "50px",
        border: "1px solid #ccc",
      }}
    >
      <h2>Interactive Timeline</h2>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          borderTop: "2px dashed #000",
        }}
      />
      {events.map((event) => (
        <div
          key={event.id}
          className="draggable"
          data-x="0"
          style={{
            position: "absolute",
            top: "20px",
            left: `${event.id * 100}px`,
            background: "#fff",
            padding: "10px",
            border: "1px solid #000",
            borderRadius: "5px",
          }}
        >
          <strong>{event.label}</strong> - {event.date}
        </div>
      ))}
    </div>
  );
};

export default Timeline;
