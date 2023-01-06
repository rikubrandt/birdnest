import styles from "../styles/Home.module.css";
import useSWR from "swr";
import List from "@mui/material/List";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Violation from "../components/violation";

const API_URL = "https://dolphin-app-sx5yd.ondigitalocean.app/drones";

export default function Home() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error } = useSWR(API_URL, fetcher, {
    refreshInterval: 1000,
  });

  return (
    <Container maxWidth="sm">
      <Card variant="outlined">
        <div className={styles.title}>
          Link to the{" "}
          <a href="https://github.com/rikubrandt/birdnest">
            <strong>code</strong>
          </a>
        </div>
        <h1 className={styles.title}>Area violations</h1>
        <List
          sx={{ width: "100%", maxWidth: 450, bgcolor: "background.paper" }}
        >
          {data &&
            Object.keys(data).map((violation, i) => (
              <Violation key={i} pilot={data[violation] as Pilot} />
            ))}
        </List>
      </Card>

      <footer className={styles.footer}></footer>
    </Container>
  );
}

export type Pilot = {
  timestamp: string;
  closestXY: [number, number];
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};
