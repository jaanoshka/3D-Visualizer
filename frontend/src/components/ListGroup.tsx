import React, { useState } from "react";

function ListGroup() {
  let items = ["Model_1", "Model_2", "Model_3", "Model_4", "Model_5"]; //Test: Liste mit Beispielelementen

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const listContainerStyle: React.CSSProperties = {
    width: "20%", // Breite der Liste
    margin: "20px 0px", // Horizontaler Abstand von 20px und vertikaler Abstand automatisch zentriert
    padding: "20px", // Innenabstand der Liste
    backgroundColor: "#f0f0f0", // Hintergrundfarbe der Liste
    border: "1px solid #ccc", // Rand der Liste
    borderRadius: "5px", // Abgerundete Ecken der Liste
    maxHeight: "300px", // Maximale Höhe der Liste (scrollbar, wenn mehr Elemente)
    overflowY: "auto", // Scrollen, falls mehr Elemente als Höhe erlauben
  };

  return (
    <>
      {items.length === 0 && <p>No items found</p>}

      <ul className="list-group" style={listContainerStyle}>
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
