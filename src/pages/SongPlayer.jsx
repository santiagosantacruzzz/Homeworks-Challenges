import { useMemo, useState } from "react";
import { LinkedList } from "../dataStructures/LinkedList";
import { mockSongs } from "../data/mockData";
import NodeChain from "../components/NodeChain";

export default function SongPlayer() {
  const playlist = useMemo(() => {
    const list = new LinkedList();
    mockSongs.forEach((song) => list.append(song));
    return list;
  }, []);

  const values = playlist.print();

  const [currentSong, setCurrentSong] = useState(values[0]);
  const [track, setTrack] = useState(0);

  const handleNext = () => {
    const value = playlist.next();
    setCurrentSong(value);
    setTrack((prev) => (prev + 1) % values.length);
  };

  return (
    <section className="page">
      <header className="page__header">
        <h1>Reproductor de canciones</h1>
        <p className="page__intro">
          Lista enlazada simple: cada canción apunta a la siguiente. El botón
          avanza el nodo actual con next().
        </p>
      </header>

      <div className="player-card">
        <div className="player-card__now-playing">
          <span className="player-card__label">Sonando ahora</span>
          <h2>{currentSong.title}</h2>
          <p>
            {currentSong.artist} · {currentSong.duration}
          </p>
        </div>

        <button className="btn btn--primary" onClick={handleNext}>
          Siguiente canción
        </button>
      </div>

      <NodeChain
        nodes={values}
        currentIndex={track}
        renderLabel={(song) => song.title}
      />
    </section>
  );
}
