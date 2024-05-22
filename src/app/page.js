import ViewConnections from "./components/ViewConnections2";
import Header from "./components/Header";
import styles from "./page.module.css";
import ViewConnections2 from "./components/ViewConnections2";

export default function Home() {
  return (
    <div className={styles.app}>
      {/* //if route not collection then show this otherwise show collection page */}
      <Header />
      <ViewConnections2 />
    </div>
  );
}
