import * as React from "react";
import ListGroup from "../components/ListGroup";

function OpenModel(): JSX.Element {
  return (
    <div>
      <div>
        <h1> Open Model Screen</h1>
      </div>

      <div>
        <h6>
          {" "}
          Ziel: Auf dieser Seite müssen die Modelle abgelegt werden und ein
          Zugang zum Öffnen eines Model hergestellt werden
        </h6>
      </div>
      <div>
        <ListGroup />
      </div>
    </div>
  );
}

export default OpenModel;
