function validateVariableDeclaration(value) {
  const tokens = value.match(/\b\w+\b|\S/g);
  let pila = ["$", "S"];
  let apuntador = 0;
  let infoPila = [];

  while (pila.length > 0) {
    const X = pila.at(-1);
    const a = tokens[apuntador];
    if (X === "$") {
      manejarPila("Pop", X, tokens, apuntador, pila, infoPila);
      break;
    }

    if (X === a) {
      manejarPila("Pop", X, tokens, apuntador, pila, infoPila);
      apuntador++;
    } else if (esNoTerminal(X)) {
      const produccion = obtenerProduccion(X, a);
      if (produccion) {
        manejarPila("Pop", X, tokens, apuntador, pila, infoPila);
        manejarPila("Push", X, tokens, apuntador, pila, infoPila);
        if (produccion[0] !== "ε") {
          for (let i = produccion.length - 1; i >= 0; i--) {
            pila.push(produccion[i]);
          }
        }
      } else {
        return reportarError("No se pudo encontrar una producción válida para", X, a, infoPila);
      }
    } else {
      return reportarError("Token inesperado", X, a, infoPila);
    }
  }

  return { esValida: apuntador === tokens.length, infoPila };
}

function esNoTerminal(simbolo) {
  return /[A-Z]/.test(simbolo);
}

function manejarPila(accion, X, tokens, apuntador, pila, infoPila) {
  const mensaje = `${accion}: ${X}, Cadena: ${tokens.slice(apuntador).join(" ")}`;
  infoPila.push(mensaje);
  if (accion === "Pop") pila.pop();
}

function reportarError(mensaje, X, a, infoPila) {
  const reportarError = `Error: ${mensaje} "${X}" con "${a}".`;
  infoPila.push(reportarError);
  return { esValida: false, infoPila, reportarError: reportarError };
}

function obtenerProduccion(noTerminal, next) {
  const producciones = {
    "S": ["I", "A", "B", "V"],
    "B": ["AL", "F"],
    "AL": ["G", ":", "SM", "RA", ";"],
    "RA": /,/.test(next) ? [",", "SM", "RA"] : ["ε"],
    "F": ["C", ":", "N", "R", ";"],
    "R": /,/.test(next) ? [",", "N", "R"] : ["ε"],
    "A": ["automata"],
    "G": ["alfabeto"],
    "C": ["aceptacion"],
    "V": ["}"],
    "I": ["{"],
    "SM": /^[a-z0-9]$/i.test(next) ? [next] : null,
    "N": /^q[0-9]$/.test(next) ? [next] : null
  };

  return producciones[noTerminal] || null;
}

export {
  validateVariableDeclaration,
  esNoTerminal,
  manejarPila,
  reportarError,
  obtenerProduccion
};