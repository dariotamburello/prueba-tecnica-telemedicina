import React, { createContext, useReducer, useEffect } from "react";
import { roomList } from "../data/rooms";

const initialState = {
  patients: [],
  rooms: roomList.reduce((acc, room) => {
    acc[room] = { available: true };
    return acc;
  }, {}),
};

// Acciones
const ADD_PATIENT = "ADD_PATIENT";
const UPDATE_PATIENT = "UPDATE_PATIENT";
const ASSIGN_ROOM = "ASSIGN_ROOM";

// Reducer
function patientReducer(state, action) {
  switch (action.type) {
    case ADD_PATIENT:
      return {
        ...state,
        patients: [...state.patients, action.payload],
      };
    case UPDATE_PATIENT:
      return {
        ...state,
        patients: state.patients.map((p) =>
          p.dni === action.payload.dni ? action.payload : p
        ),
      };
    case ASSIGN_ROOM:
      return {
        ...state,
        rooms: action.payload,
      };
    default:
      return state;
  }
}

// Contexto
// eslint-disable-next-line react-refresh/only-export-components
export const PatientContext = createContext();

// Provider
export function PatientProvider({ children }) {
  const [state, dispatch] = useReducer(patientReducer, initialState, () => {
    const savedPatients = localStorage.getItem("patients");
    if (savedPatients) {
      try {
        const parsedData = JSON.parse(savedPatients);

        if (
          parsedData &&
          typeof parsedData === "object" &&
          "patients" in parsedData
        ) {
          return parsedData;
        }
      } catch (e) {
        console.error("Error parsing localStorage data:", e);
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(state));
  }, [state]);

  const addPatient = (patient) => {
    dispatch({
      type: ADD_PATIENT,
      payload: {
        ...patient,
        status: "Activo",
        assignedTo: "",
        room: "",
        diagnosis: "",
        attentionStart: "",
        attendedAt: "",
        createdAt: new Date().toLocaleString(),
      },
    });
  };

  const updatePatient = (updatedPatient) => {
    dispatch({
      type: UPDATE_PATIENT,
      payload: updatedPatient,
    });
  };

  const assignRoomAndGetFirstAvailable = () => {
    const unavailableRooms = state.patients
      .filter((p) => p.room)
      .map((p) => p.room);

    const firstAvailableRoom = roomList.find(
      (room) => !unavailableRooms.includes(room)
    );

    return firstAvailableRoom;
  };

  const assignRoomToPatient = (roomName) => {
    dispatch({
      type: "ASSIGN_ROOM",
      payload: {
        ...state.rooms,
        [roomName]: { available: false },
      },
    });
  };

  return (
    <PatientContext.Provider
      value={{
        state,
        addPatient,
        updatePatient,
        assignRoomAndGetFirstAvailable,
        assignRoomToPatient,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}
