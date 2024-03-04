function validateVariableDeclaration(value) {
  const tokens = value.match(/\b\w+\b|\S/g);
  let pila = ["$", "S"];
  let apuntador = 0;
  let stackInfo = [];

  while (pila.length > 0) {
    const X = pila.at(-1);
    const a = tokens[apuntador];
    if (X === "$") {
      handleStack("Pop", X, tokens, apuntador, pila, stackInfo);
      break;
    }

    if (X === a) {
      handleStack("Pop", X, tokens, apuntador, pila, stackInfo);
      apuntador++;
    } else if (isNotTerminal(X)) {
      const produccion = getProduction(X, a);
      if (produccion) {
        handleStack("Pop", X, tokens, apuntador, pila, stackInfo);
        handleStack("Push", X, tokens, apuntador, pila, stackInfo);
        if (produccion[0] !== "ε") {
          for (let i = produccion.length - 1; i >= 0; i--) {
            pila.push(produccion[i]);
          }
        }
      } else {
        return errorReport("No se pudo encontrar una producción válida para", X, a, stackInfo);
      }
    } else {
      return errorReport("Token inesperado", X, a, stackInfo);
    }
  }

  return { esValida: apuntador === tokens.length, infoPila: stackInfo };
}

function isNotTerminal(simbolo) {
  return /[A-Z]/.test(simbolo);
}

function handleStack(accion, X, tokens, apuntador, pila, infoPila) {
  const mensaje = `${accion}: ${X}, Cadena: ${tokens.slice(apuntador).join(" ")}`;
  infoPila.push(mensaje);
  if (accion === "Pop") pila.pop();
}

function errorReport(mensaje, X, a, infoPila) {
  const reportarError = `Error: ${mensaje} "${X}" con "${a}".`;
  infoPila.push(reportarError);
  return { esValida: false, infoPila, reportarError: reportarError };
}

function getProduction(noTerminal, next) {
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
  isNotTerminal as esNoTerminal,
  handleStack as manejarPila,
  errorReport as reportarError,
  getProduction as obtenerProduccion
};