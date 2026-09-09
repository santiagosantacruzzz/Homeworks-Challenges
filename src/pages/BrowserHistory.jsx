import { useMemo, useState } from "react";
import { DoublyLinkedList } from "../dataStructures/DoublyLinkedList";
import { mockPages } from "../data/mockData";
import NodeChain from "../components/NodeChain";

export default function BrowserHistory() {
  const history = useMemo(() => {
    const list = new DoublyLinkedList();
    mockPages.forEach((page) => list.append(page));
    return list;
  }, []);

  const values = history.print();
  const [track, setTrack] = useState(values.length - 1);
  const [currentPage, setCurrentPage] = useState(values[values.length - 1]);

  const handleBack = () => {
    const value = history.back();
    setCurrentPage(value);
    setTrack((prev) => Math.max(prev - 1, 0));
  };

  const handleForward = () => {
    const value = history.forward();
    setCurrentPage(value);
    setTrack((prev) => Math.min(prev + 1, values.length - 1));
  };

  return (
    <section className="page">
      <header className="page__header">
        <h1>Historial de navegación</h1>
        <p className="page__intro">
          Lista doblemente enlazada: cada página guarda un puntero al
          siguiente y al anterior. Los botones usan back() y forward().
        </p>
      </header>

      <div className="player-card">
        <div className="player-card__now-playing">
          <span className="player-card__label">Página actual</span>
          <h2>{currentPage.title}</h2>
          <p>{currentPage.url}</p>
        </div>

        <div className="player-card__controls">
          <button
            className="btn btn--ghost"
            onClick={handleBack}
            disabled={!history.canGoBack()}
          >
            Atrás
          </button>
          <button
            className="btn btn--primary"
            onClick={handleForward}
            disabled={!history.canGoForward()}
          >
            Adelante
          </button>
        </div>
      </div>

      <NodeChain
        nodes={values}
        currentIndex={track}
        renderLabel={(page) => page.title}
        bidirectional
      />
    </section>
  );
}
