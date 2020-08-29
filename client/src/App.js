import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { listLogEntries } from "./Api";
import LogEntryForm from "./LogEntryForm";

require("dotenv").config();

const App = () => {
  const [logs, setLogs] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addLocation, setAddLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 45.889025,
    longitude: 22.896921,
    zoom: 3,
  });

  const getEntries = () => {
    (async () => {
      const logEntries = await listLogEntries();
      setLogs(logEntries);
    })();
  };

  useEffect(getEntries, []);

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddLocation({
      longitude,
      latitude,
    });
  };

  return (
    <ReactMapGL
      {...viewport}
      onDblClick={showAddMarkerPopup}
      mapStyle="mapbox://styles/dariusdc/ckdu22gpe0r931aor1owm59jh"
      mapboxApiAccessToken={
        "pk.eyJ1IjoiZGFyaXVzZGMiLCJhIjoiY2tkdTBjODh1MjN3MjJ3dHZkd3k5aGxjcSJ9.08jrjx1ThoGc692rENe44A"
      }
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
    >
      {logs.map((log) => {
        return (
          <div onClick={() => setShowPopup({ [log._id]: true })} key={log._id}>
            <Marker
              latitude={log.latitude}
              longitude={log.longitude}
              offsetLeft={-12}
              offsetTop={-24}
            >
              <div>
                <img
                  style={{
                    height: `${6 * viewport.zoom}px`,
                    width: `${6 * viewport.zoom}px`,
                    maxHeight: "50px",
                    maxWidth: "50px",
                    minHeight: "20px",
                    minWidth: "20px",
                  }}
                  src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png"
                  alt="Marker tag"
                />
              </div>
            </Marker>
            {showPopup[log._id] ? (
              <Popup
                key={log._id}
                dynamicPosition={true}
                latitude={log.latitude}
                longitude={log.longitude}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setShowPopup({ ...showPopup, [log._id]: false })}
                anchor="top"
              >
                <div className="popup">
                  <h3>{log.title}</h3>
                  <h4 className="rating">Rating: {log.rating}</h4>
                  <p>{log.comments}</p>
                  <small>
                    Visited on {new Date(log.visitDate).toLocaleDateString()}
                  </small>
                  {log.image && <img src={log.image} alt={log.title} />}
                </div>
              </Popup>
            ) : (
              ""
            )}
          </div>
        );
      })}
      {addLocation ? (
        <div>
          <Marker
            latitude={addLocation.latitude}
            longitude={addLocation.longitude}
            offsetLeft={-12}
            offsetTop={-24}
          >
            <div>
              <img
                style={{
                  height: `${6 * viewport.zoom}px`,
                  width: `${6 * viewport.zoom}px`,
                  maxHeight: "50px",
                  maxWidth: "50px",
                  minHeight: "20px",
                  minWidth: "20px",
                }}
                src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png"
                alt="Marker tag"
              />
            </div>
          </Marker>
          <Popup
            dynamicPosition={true}
            latitude={addLocation.latitude}
            longitude={addLocation.longitude}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setAddLocation(null)}
            anchor="top"
          >
            <LogEntryForm
              onClose={() => {
                setAddLocation(null);
                getEntries();
              }}
              location={addLocation}
            />
          </Popup>
        </div>
      ) : (
        ""
      )}
    </ReactMapGL>
  );
};

export default App;
