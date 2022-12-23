import xml2js from "xml2js";
import type { NextApiRequest, NextApiResponse } from "next";
const parser = new xml2js.Parser();

let VIOLATIONS: Map<String, Pilot> = new Map();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json(Object.fromEntries(VIOLATIONS));
  } else {
    res.status(400).json({ error: "Bad request" });
  }
}

// fetch data from the API
// Turn the XML into JSON
async function drones() {
  const response = await fetch("http://assignments.reaktor.com/birdnest/drones")
    .then((response) => response.text())
    .then((str) => parser.parseStringPromise(str))
    .then((result) => JSON.stringify(result))
    .then((result) => JSON.parse(result))
    .catch((error) => console.log(error));
  const data = response.report.capture;
  if (data.length > 0) {
    const timestamp = data[0].$.snapshotTimestamp;

    const drones = data[0].drone;
    for (let i = 0; i < drones.length; i++) {
      const drone = drones[i];
      if (dist_from_nest(drone.positionX, drone.positionY) < 100000) {
        const pilot = VIOLATIONS.get(drone.serialNumber);
        // If the pilot already exists, update the timestamp and closest coordinates.
        if (pilot) {
          pilot.timestamp = timestamp;
          if (
            dist_from_nest(drone.positionX, drone.positionY) <
            dist_from_nest(pilot.closestXY[0], pilot.closestXY[1])
          ) {
            pilot.closestXY[0] = drone.positionX;
            pilot.closestXY[1] = drone.positionY;
          }
        } else {
          const info = await getPilot(drones[i].serialNumber);
          const pilot: Pilot = {
            timestamp: timestamp,
            closestXY: [drone.positionX, drone.positionY],
            firstName: info.firstName,
            lastName: info.lastName,
            email: info.email,
            phoneNumber: info.phoneNumber,
          };
          VIOLATIONS.set(drone.serialNumber, pilot);
        }
      }
    }
  }
  cleanViolations();
}

//Check if violations are 10 minutes old and clean them.
function cleanViolations() {
  const now = new Date();
  VIOLATIONS.forEach((pilot, serialNumber) => {
    const then = new Date(pilot.timestamp);
    const diff = now.getTime() - then.getTime();
    if (diff > 1000 * 60 * 10) {
      VIOLATIONS.delete(serialNumber);
    }
  });
}

function dist_from_nest(x1: number, y1: number) {
  return Math.sqrt(Math.pow(250000 - x1, 2) + Math.pow(250000 - y1, 2));
}

type Pilot = {
  timestamp: string;
  closestXY: [number, number];
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type { Pilot };

async function getPilot(serialNumber: string) {
  const response = await fetch(
    "http://assignments.reaktor.com/birdnest/pilots/" + serialNumber
  ).then((response) => response.json());
  return response;
}

// Update the violations every 2 seconds.
setInterval(drones, 2000);
