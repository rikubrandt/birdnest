import styles from "../styles/Home.module.css";
import useSWR from "swr";
import axios from "axios";
import List from "@mui/material/List";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";

import Violation from "../components/violation";

export default function Home() {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);

  const { data, error } = useSWR("/api/drones", fetcher, {
    refreshInterval: 10,
  });

  return (
    <Container maxWidth="sm">
      <Card variant="outlined">
        <h1 className={styles.title}>Area violations</h1>
        <List
          sx={{ width: "100%", maxWidth: 450, bgcolor: "background.paper" }}
        >
          {data &&
            Object.keys(data).map((violation, i) => (
              <Violation key={i} pilot={data[violation]} />
            ))}
        </List>
      </Card>

      <footer className={styles.footer}></footer>
    </Container>
  );
}
