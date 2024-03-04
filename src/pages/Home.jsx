import React, { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { validateVariableDeclaration } from "../type/pila";

export default function CodeEditor() {
  const [validationResult, setValidationResult] = useState(null);

  const onChange = useCallback((value) => {
    const result = validateVariableDeclaration(value);
    setValidationResult(result);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-200">
      <div className="max-w-max p-6 bg-white shadow-md rounded-md">
        <CodeMirror
          value=""
          height="400px"
          width="600px"
          theme="dark"
          onChange={onChange}
          className="py-2"
        />
        {validationResult && (
          <div className={`bg-${validationResult.esValida ? "green" : "red"}-100 text-purple-500 p-4 mt-4 rounded-md shadow-md`}>
            <p className="text-center">
              {validationResult.esValida
                ? "Cadena válida"
                : `Cadena no válida: ${validationResult.reportarError}`}
            </p>
            {validationResult.infoPila.map((item, index) => (
              <div key={index} className="mt-2">{item}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
