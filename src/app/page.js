import ViewConnections from "./components/ViewConnections";
import Header from "./components/Header";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.app}>
      {/* //if route not collection then show this otherwise show collection page */}
      <Header />
      <ViewConnections />
    </div>
  );
}
