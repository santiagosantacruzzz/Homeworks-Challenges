import assert from "node:assert/strict";
import { test } from "node:test";
import Trie from "../src/estructuras/Trie.js";
import MaxHeap, { porReproducciones } from "../src/estructuras/MaxHeap.js";
import Graph from "../src/estructuras/Graph.js";
import Catalogo from "../src/estructuras/Catalogo.js";
import { CANCIONES, RELACIONES } from "../src/data/mock.js";

test("Trie: insert, search y sugerencias", () => {
  const t = new Trie();
  t.insert("La Flaca"); t.insert("La Bamba"); t.insert("Labios Compartidos"); t.insert("Llorarás");
  assert.equal(t.search("la flaca"), true);
  assert.equal(t.search("LA FLACA"), true);
  assert.equal(t.search("lloraras"), true);
  assert.equal(t.search("la"), false);         // es prefijo, no título
  assert.equal(t.search("la flacas"), false);
  assert.deepEqual(t.sugerencias("la").map(s => s.titulo), ["la bamba", "la flaca", "labios compartidos"]);
  assert.deepEqual(t.sugerencias("x"), []);
  assert.deepEqual(t.siguientesLetras("la"), [" ", "b"]);
  const camino = t.camino("lax");
  assert.deepEqual(camino.map(p => p.existe), [true, true, false]);
});

test("Trie: ñ se conserva y remove poda", () => {
  const t = new Trie();
  t.insert("Señora"); t.insert("Senda");
  assert.equal(t.search("senora"), false);
  assert.equal(t.search("SEÑORA"), true);
  const antes = t.totalNodos;
  t.insert("Sendero"); t.remove("sendero", null);
  assert.equal(t.totalNodos, antes);
  assert.equal(t.search("senda"), true);
});

test("MaxHeap: push/pop/heapify y propiedad", () => {
  const h = new MaxHeap([5, 3, 17, 10, 84, 19, 6, 22, 9]);
  for (let i = 0; i < h.size(); i++) {
    for (const c of [2*i+1, 2*i+2]) if (c < h.size()) assert.ok(h.heap[i] >= h.heap[c]);
  }
  assert.equal(h.peek(), 84);
  h.push(100);
  assert.equal(h.peek(), 100);
  assert.deepEqual(h.topK(3), [100, 84, 22]);
  assert.equal(h.size(), 10); // topK no daña el heap
  const salida = []; while (h.size()) salida.push(h.pop());
  assert.deepEqual(salida, [...salida].sort((a, b) => b - a));
  assert.equal(h.pop(), undefined);
});

test("MaxHeap: actualizar y eliminar", () => {
  const xs = [{titulo:"a",reproducciones:1},{titulo:"b",reproducciones:5},{titulo:"c",reproducciones:3}];
  const h = new MaxHeap(xs, porReproducciones);
  xs[0].reproducciones = 10; h.actualizar(x => x.titulo === "a", xs[0]);
  assert.equal(h.peek().titulo, "a");
  h.eliminar(x => x.titulo === "a");
  assert.equal(h.peek().titulo, "b");
});

test("Graph no dirigido y recomendación", () => {
  const g = new Graph();
  ["A","B","C","D","E"].forEach(n => g.addNode(n));
  g.addEdge("A","B"); g.addEdge("A","C"); g.addEdge("B","D"); g.addEdge("C","D"); g.addEdge("D","E");
  assert.equal(g.addEdge("B","A"), false); // repetida
  assert.equal(g.addEdge("A","A"), false);
  assert.deepEqual(g.printAdjacency("B"), ["A","D"]);
  assert.equal(g.totalAristas(), 5);
  const r = g.recomendar("A");
  assert.deepEqual(r.map(x => [x.id, x.nivel]), [["B",1],["C",1],["D",2]]);
  assert.deepEqual(r[2].enComun, ["B","C"]);
  g.removeNode("D");
  assert.deepEqual(g.printAdjacency("B"), ["A"]);
  assert.equal(g.isEmpty(), false);
});

test("Catalogo con datos mock", () => {
  const cat = Catalogo.desde(CANCIONES, RELACIONES);
  assert.equal(cat.tamano, 36);
  assert.equal(cat.top(1)[0].titulo, "Peli De Terror");
  assert.equal(cat.grafo.totalAristas(), RELACIONES.length);
  // Challenge 12: top K por prefijo
  const top = cat.trie.searchTopK("pa", 2).map(c => c.titulo);
  assert.deepEqual(top, ["PARADIXE", "PARADIXE (REMIX)"]);
  assert.equal(cat.trie.search("por si mañana no estoy"), true);
  // Feid comparte artista en sus tres canciones
  assert.ok(cat.grafo.printAdjacency("2").includes("7") && cat.grafo.printAdjacency("2").includes("11"));
  // reproducciones mueven el ranking
  const flaca = cat.trie.buscar("tormentos")[0];
  cat.actualizar({ ...flaca, reproducciones: 3_000_000 });
  assert.equal(cat.top(1)[0].titulo, "Tormentos");
  assert.equal(cat.trie.searchTopK("t", 1)[0].titulo, "Tormentos");
  assert.equal(cat.posiciones().get(flaca.id), 1);
  const rec = cat.recomendar("1");
  assert.ok(rec.every(r => r.cancion && r.id !== "1"));
  console.log(rec.slice(0,6).map(r => `${r.nivel} ${r.cancion.titulo} (${r.enComun.length})`).join("\n"));
  cat.eliminar(flaca.id);
  assert.equal(cat.trie.search("tormentos"), false);
  assert.equal(cat.grafo.searchNode(flaca.id), undefined);
});
