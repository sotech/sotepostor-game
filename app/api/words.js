// Listado base de sustantivos comunes. Se replica hasta alcanzar 1000 entradas.
const baseNouns = [
  "amigo", "animal", "arbol", "arena", "arte", "atardecer", "avenida", "avion", "banco", "barco",
  "barrio", "batalla", "bebida", "belleza", "boca", "bosque", "brazo", "cabana", "caballo", "cabeza",
  "cafe", "calle", "campo", "cancion", "cama", "camino", "camisa", "carta", "casa", "cascada",
  "cena", "cerebro", "cerro", "cine", "cinturon", "ciudad", "clase", "clave", "clima", "coche",
  "cocina", "collar", "comida", "copa", "corazon", "correo", "cosa", "costa", "crema", "cuaderno",
  "cuadro", "cuarto", "cuchara", "cuello", "cultura", "cuna", "cura", "curso", "debate", "dedo",
  "defensa", "desierto", "diamante", "dibujo", "dinero", "disco", "dolor", "duda", "edificio", "equipo",
  "escena", "escuela", "espejo", "espiritu", "espuma", "estacion", "estrella", "fabrica", "familia", "faro",
  "festival", "fiebre", "finca", "flauta", "flor", "fondo", "fruta", "fuego", "fuente", "fuerza",
  "futuro", "gafas", "gallina", "gallo", "gato", "golpe", "gorro", "gota", "guitarra", "habitacion",
  "hada", "hambre", "herramienta", "hielo", "hijo", "historia", "hogar", "hoja", "hombre", "honor",
  "hoja", "hora", "hotel", "huella", "humor", "idea", "iglesia", "imagen", "impuesto", "inicio",
  "insecto", "instrumento", "invierno", "isla", "jardin", "jarron", "jefe", "juego", "juez", "juguete",
  "lago", "lampara", "lanza", "largo", "lata", "lavabo", "leche", "lectura", "lengua", "leon",
  "letra", "libro", "liga", "limon", "lirio", "llama", "llave", "lluvia", "lobo", "loma",
  "luna", "luz", "madre", "madera", "magia", "maleta", "mano", "manto", "maquina", "mar",
  "marea", "mariposa", "marisco", "marmol", "martillo", "masa", "mason", "mayo", "mesa", "meseta",
  "metal", "metro", "mezcla", "mina", "mision", "misterio", "mito", "moda", "molino", "momento",
  "montana", "mochila", "moneda", "mundo", "museo", "musica", "naranja", "nieve", "noche", "nota",
  "nube", "nudo", "nueva", "numero", "obra", "oceano", "ocio", "ola", "olor", "onda",
  "oro", "orquesta", "pacto", "pajaro", "palabra", "palacio", "palma", "papel", "pared", "parque",
  "parte", "pasillo", "pasto", "pelota", "peluca", "pena", "pera", "perla", "perro", "persona",
  "piano", "piedra", "piel", "pierna", "pintura", "piscina", "pizza", "planta", "plato", "playa",
  "plaza", "pluma", "poder", "poema", "poeta", "polvo", "puente", "puerta", "puerto", "pueblo",
  "punto", "queso", "rama", "rampa", "rana", "rango", "rayo", "reloj", "restaurante", "retrato",
  "rio", "ritmo", "roca", "ropa", "rosa", "rueda", "ruido", "ruta", "sabana", "sabio",
  "sala", "salida", "salon", "salto", "sangre", "silla", "sistema", "sol", "sombrero", "sombra",
  "sonido", "sopa", "suelo", "suerte", "tabla", "tarde", "taza", "techo", "tela", "telefono",
  "templo", "teoria", "tesoro", "texto", "tierra", "tigre", "tinta", "titulo", "tobillo", "toma",
  "tormenta", "torre", "torta", "trabajo", "trampa", "tren", "trigo", "trompeta", "tronco", "trueno",
  "universo", "uva", "vaca", "vagon", "valle", "valor", "vapor", "vara", "vaso", "vela",
  "ventana", "verano", "verdad", "viaje", "vida", "viento", "vino", "violonchelo", "voz", "yate",
  "zanja", "zorro", "zumo", "zapato", "zona", "barco", "nudo", "brisa", "cuerda", "trazo"
];

export const WORDS = (() => {
  const list = [];
  while (list.length < 1000) {
    list.push(...baseNouns);
  }
  return list.slice(0, 1000);
})();

export function randomNoun() {
  const idx = Math.floor(Math.random() * WORDS.length);
  return WORDS[idx];
}
