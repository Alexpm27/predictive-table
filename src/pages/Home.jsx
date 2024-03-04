import React, { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { validateVariableDeclaration } from "../scripts/pila";

export default function CodeEditor() {
  const [validationResult, setValidationResult] = useState(null);

  const onChange = useCallback((value) => {
    const result = validateVariableDeclaration(value);
    setValidationResult(result);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black">
      <p className="pb-2 font-mono text-2xl text-white">Analizador sintactico con tabla predictiiva</p>
      <div className="flex justify-center items-center max-w-max p-6 bg-gray-400 shadow-md rounded-md">
        <CodeMirror
          value=""
          height="400px"
          width="600px"
          theme="light"
          onChange={onChange}
          className="py-2"
        />
          {validationResult && (
        <div className={`bg-${validationResult == true ? "green" : "gray"}-100 text-red-500 p-4 mt-4 ml-4 rounded-md shadow-md border-[5px]`}>
              <p className="text-center border-b-[5px]">
              {validationResult.esValida
                ? "Cadena válida"
                : `Cadena no válida: ${validationResult.reportarError}`}
            </p>
            {validationResult.infoPila.map((item, index) => (
              <div key={index} className="mt-2 border-b-[5px]">{item}</div>
            ))}
            </div>
          )}
      </div>
    </div>
  );
}