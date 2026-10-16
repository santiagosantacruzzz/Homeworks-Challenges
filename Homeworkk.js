// HOMEWORK 01 - ARRAYS
// JavaScript

// 1. length: cantidad de elementos del array
let frutas = ["Manzana", "Pera", "Mango", "Banano"];
console.log("1. length:");
console.log(frutas.length); // 4


// 2. at(): elemento en un índice (acepta índices negativos)
let coloresAt = ["Rojo", "Verde", "Azul"];
console.log("2. at():");
console.log(coloresAt.at(1));  // "Verde"
console.log(coloresAt.at(-1)); // "Azul"


// 3. concat(): une arrays, devuelve uno nuevo (no muta)
let frutas1 = ["Manzana", "Pera"];
let frutas2 = ["Mango", "Banano"];
let todasLasFrutas = frutas1.concat(frutas2);
console.log("3. concat():");
console.log(todasLasFrutas); // ["Manzana", "Pera", "Mango", "Banano"]


// 4. constructor: referencia a la función que creó el array
let numerosConstructor = [1, 2, 3];
console.log("4. constructor:");
console.log(numerosConstructor.constructor === Array); // true
console.log(numerosConstructor.constructor.name);      // "Array"


// 5. copyWithin(): copia parte del array dentro de sí mismo (muta)
let numerosCopyWithin = [1, 2, 3, 4, 5];
numerosCopyWithin.copyWithin(0, 3);
console.log("5. copyWithin():");
console.log(numerosCopyWithin); // [4, 5, 3, 4, 5]


// 6. entries(): iterador de pares [índice, valor]
let frutasEntries = ["Manzana", "Pera", "Mango"];
let entradas = frutasEntries.entries();
console.log("6. entries():");
for (let entrada of entradas) {
    console.log(entrada);
}
// [0, "Manzana"] [1, "Pera"] [2, "Mango"]


// 7. every(): true si TODOS cumplen la condición
let edadesEvery = [20, 25, 30, 40];
let todosAdultos = edadesEvery.every((edad) => edad >= 18);
console.log("7. every():");
console.log(todosAdultos); // true


// 8. fill(): reemplaza elementos en un rango por un valor (muta)
let numerosFill = [1, 2, 3, 4, 5];
numerosFill.fill(0, 1, 4);
console.log("8. fill():");
console.log(numerosFill); // [1, 0, 0, 0, 5]


// 9. filter(): nuevo array con los elementos que cumplen la condición
let numerosFilter = [1, 2, 3, 4, 5, 6];
let numerosPares = numerosFilter.filter((numero) => numero % 2 === 0);
console.log("9. filter():");
console.log(numerosPares); // [2, 4, 6]


// 10. find(): primer elemento que cumple la condición
let edades = [12, 15, 18, 21, 25];
let primeraEdadMayor = edades.find((edad) => edad >= 18);
console.log("10. find():");
console.log(primeraEdadMayor); // 18


// 11. findIndex(): índice del primer elemento que cumple la condición
let edadesIndex = [12, 15, 18, 21, 25];
let indiceEdad = edadesIndex.findIndex((edad) => edad >= 18);
console.log("11. findIndex():");
console.log(indiceEdad); // 2


// 12. findLast(): último elemento que cumple la condición (busca desde el final)
let numerosFindLast = [10, 15, 20, 25, 30];
let ultimoMayor20 = numerosFindLast.findLast((numero) => numero > 20);
console.log("12. findLast():");
console.log(ultimoMayor20); // 30


// 13. findLastIndex(): índice del último elemento que cumple la condición
let numerosFindLastIndex = [10, 15, 20, 25, 30];
let ultimoIndiceMayor20 = numerosFindLastIndex.findLastIndex(
    (numero) => numero > 20
);
console.log("13. findLastIndex():");
console.log(ultimoIndiceMayor20); // 4


// 14. flat(): aplana niveles de arrays anidados
let numerosAnidados = [1, 2, [3, 4], [5, [6, 7]]];
console.log("14. flat():");
console.log(numerosAnidados.flat());  // [1, 2, 3, 4, 5, [6, 7]]
console.log(numerosAnidados.flat(2)); // [1, 2, 3, 4, 5, 6, 7]


// 15. flatMap(): map() + flat() de un nivel
let numerosFlatMap = [1, 2, 3];
let resultadoFlatMap = numerosFlatMap.flatMap((numero) => [numero, numero * 2]);
console.log("15. flatMap():");
console.log(resultadoFlatMap); // [1, 2, 2, 4, 3, 6]


// 16. forEach(): ejecuta una función por cada elemento, no retorna array
let nombres = ["Ana", "Carlos", "Laura"];
console.log("16. forEach():");
nombres.forEach((nombre) => console.log("Hola " + nombre));
// Hola Ana / Hola Carlos / Hola Laura


// 17. includes(): true/false si el elemento existe
let lenguajes = ["JavaScript", "Python", "Java"];
console.log("17. includes():");
console.log(lenguajes.includes("JavaScript")); // true
console.log(lenguajes.includes("C++"));         // false


// 18. indexOf(): posición de la primera aparición (-1 si no existe)
let animalesIndex = ["Perro", "Gato", "Pájaro"];
console.log("18. indexOf():");
console.log(animalesIndex.indexOf("Gato")); // 1


// 19. join(): une los elementos en un string
let palabras = ["Hola", "mundo", "JavaScript"];
let frase = palabras.join(" ");
console.log("19. join():");
console.log(frase); // "Hola mundo JavaScript"


// 20. keys(): iterador de los índices del array
let frutasKeys = ["Manzana", "Pera", "Mango"];
let indices = frutasKeys.keys();
console.log("20. keys():");
for (let indice of indices) {
    console.log(indice);
}
// 0 / 1 / 2


// 21. lastIndexOf(): posición de la última aparición
let numerosRepetidos = [10, 20, 30, 20, 40];
console.log("21. lastIndexOf():");
console.log(numerosRepetidos.lastIndexOf(20)); // 3


// 22. map(): nuevo array transformando cada elemento
let numerosMap = [1, 2, 3, 4];
let numerosDobles = numerosMap.map((numero) => numero * 2);
console.log("22. map():");
console.log(numerosDobles); // [2, 4, 6, 8]


// 23. pop(): elimina y devuelve el último elemento (muta)
let animales = ["Perro", "Gato", "Conejo"];
let animalEliminado = animales.pop();
console.log("23. pop():");
console.log(animales);                          // ["Perro", "Gato"]
console.log("Elemento eliminado:", animalEliminado); // Conejo


// 24. push(): agrega elementos al final (muta)
let colores = ["Rojo", "Azul"];
colores.push("Verde");
console.log("24. push():");
console.log(colores); // ["Rojo", "Azul", "Verde"]


// 25. reduce(): reduce el array a un único valor (izquierda a derecha)
let precios = [10000, 20000, 30000];
let total = precios.reduce((acumulador, precio) => acumulador + precio, 0);
console.log("25. reduce():");
console.log(total); // 60000


// 26. reduceRight(): igual que reduce() pero de derecha a izquierda
let numerosReduceRight = [1, 2, 3, 4];
let resultadoReduceRight = numerosReduceRight.reduceRight(
    (acumulador, numero) => acumulador - numero
);
console.log("26. reduceRight():");
console.log(resultadoReduceRight); // -2


// 27. reverse(): invierte el orden del array (muta)
let letras = ["A", "B", "C", "D"];
letras.reverse();
console.log("27. reverse():");
console.log(letras); // ["D", "C", "B", "A"]


// 28. shift(): elimina y devuelve el primer elemento (muta)
let ciudades = ["Cali", "Bogotá", "Medellín"];
let ciudadEliminada = ciudades.shift();
console.log("28. shift():");
console.log(ciudades);                            // ["Bogotá", "Medellín"]
console.log("Elemento eliminado:", ciudadEliminada); // Cali


// 29. slice(): extrae una parte del array (no muta)
let numerosSlice = [10, 20, 30, 40, 50];
let parteNumeros = numerosSlice.slice(1, 4);
console.log("29. slice():");
console.log(parteNumeros); // [20, 30, 40]


// 30. some(): true si AL MENOS UN elemento cumple la condición
let edadesSome = [12, 15, 17, 20];
let hayAdultos = edadesSome.some((edad) => edad >= 18);
console.log("30. some():");
console.log(hayAdultos); // true


// 31. sort(): ordena el array (muta)
let numerosSort = [40, 10, 30, 20];
numerosSort.sort((a, b) => a - b);
console.log("31. sort():");
console.log(numerosSort); // [10, 20, 30, 40]


// 32. splice(): elimina, agrega o reemplaza elementos (muta)
let frutasSplice = ["Manzana", "Pera", "Banano"];
frutasSplice.splice(1, 1, "Mango");
console.log("32. splice():");
console.log(frutasSplice); // ["Manzana", "Mango", "Banano"]


// 33. toLocaleString(): convierte a string con formato local
let preciosToLocaleString = [1000, 2000, 3000];
console.log("33. toLocaleString():");
console.log(preciosToLocaleString.toLocaleString("es-CO")); // "1.000,2.000,3.000"


// 34. toString(): convierte el array a string separado por comas
let frutasString = ["Manzana", "Pera", "Mango"];
let textoFrutas = frutasString.toString();
console.log("34. toString():");
console.log(textoFrutas); // "Manzana,Pera,Mango"


// 35. unshift(): agrega elementos al inicio (muta)
let numeros = [2, 3, 4];
numeros.unshift(1);
console.log("35. unshift():");
console.log(numeros); // [1, 2, 3, 4]


// 36. values(): iterador de los valores del array
let frutasValues = ["Manzana", "Pera", "Mango"];
let valores = frutasValues.values();
console.log("36. values():");
for (let valor of valores) {
    console.log(valor);
}
// Manzana / Pera / Mango


// BONUS - Métodos modernos (ES2023) que NO mutan el array original

// 37. toSpliced(): como splice() pero devuelve una copia (no muta)
let numerosToSpliced = [1, 2, 3, 4];
let nuevoArray = numerosToSpliced.toSpliced(1, 2, 8, 9);
console.log("37. toSpliced():");
console.log("Array original:", numerosToSpliced); // [1, 2, 3, 4]
console.log("Nuevo array:", nuevoArray);           // [1, 8, 9, 4]


// 38. toSorted(): como sort() pero devuelve una copia ordenada (no muta)
let numerosToSorted = [40, 10, 30, 20];
let numerosOrdenados = numerosToSorted.toSorted((a, b) => a - b);
console.log("38. toSorted():");
console.log("Array original:", numerosToSorted);   // [40, 10, 30, 20]
console.log("Array ordenado:", numerosOrdenados);  // [10, 20, 30, 40]


// 39. toReversed(): como reverse() pero devuelve una copia invertida (no muta)
let letrasToReversed = ["A", "B", "C", "D"];
let letrasInvertidas = letrasToReversed.toReversed();
console.log("39. toReversed():");
console.log("Array original:", letrasToReversed);   // ["A", "B", "C", "D"]
console.log("Array invertido:", letrasInvertidas);  // ["D", "C", "B", "A"]


// 40. with(): devuelve una copia reemplazando un elemento en un índice (no muta)
let numerosWith = [10, 20, 30, 40];
let nuevoNumeros = numerosWith.with(2, 100);
console.log("40. with():");
console.log("Array original:", numerosWith); // [10, 20, 30, 40]
console.log("Nuevo array:", nuevoNumeros);    // [10, 20, 100, 40]


// 41. Array.isArray(): comprueba si un valor es un array
let lista = [1, 2, 3];
console.log("41. Array.isArray():");
console.log(Array.isArray(lista));  // true
console.log(Array.isArray("Hola")); // false


// 42. Array.from(): crea un array desde un iterable o array-like
let palabra = "Hola";
let letrasArray = Array.from(palabra);
console.log("42. Array.from():");
console.log(letrasArray); // ["H", "o", "l", "a"]


// 43. Array.of(): crea un array a partir de los argumentos recibidos
let nuevoArrayOf = Array.of(10, 20, 30, 40);
console.log("43. Array.of():");
console.log(nuevoArrayOf); // [10, 20, 30, 40]


// FIN
console.log("HOMEWORK 01 - ARRAYS FINALIZADO");
