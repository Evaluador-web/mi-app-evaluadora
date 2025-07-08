
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { Welcome } from './components/Welcome';
import { analyzeDocument } from './services/geminiService';
import { extractTextFromPDF } from './services/pdfService';
import type { AnalysisResult } from './types';
import { AnalyzeIcon } from './components/IconComponents';

export default function App(): React.ReactNode {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    setFile(selectedFile);
    setFileName(selectedFile?.name || '');
    setAnalysisResult(null);
    setError(null);
  }, []);

  const handleAnalyzeClick = useCallback(async () => {
    if (!file) {
      setError('Por favor, seleccione un archivo PDF para analizar.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const extractedText = await extractTextFromPDF(file);
      if (!extractedText.trim()) {
          throw new Error("No se pudo extraer texto del PDF. El archivo podría estar vacío, protegido o ser una imagen sin texto legible.");
      }
      const result = await analyzeDocument(extractedText);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error desconocido durante el análisis. Revise la consola para más detalles.';
      setError(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [file]);

  return (
    <div className="min-h-screen bg-slate-100/50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg ring-1 ring-slate-200 p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-700">1. Cargue su documento</h2>
              <p className="text-sm text-slate-500">Seleccione el documento académico o de política (.pdf) que desea evaluar.</p>
              <FileUpload onFileSelect={handleFileSelect} fileName={fileName} />
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-700">2. Inicie el análisis</h2>
              <p className="text-sm text-slate-500">La IA examinará el texto en busca de indicadores de inclusión y equidad.</p>
              <button
                onClick={handleAnalyzeClick}
                disabled={!file || isLoading}
                className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader />
                    <span>Analizando...</span>
                  </>
                ) : (
                   <>
                    <AnalyzeIcon />
                    <span>Analizar Documento</span>
                   </>
                )}
              </button>
            </div>
          </div>
          {error && <div className="mt-6"><ErrorMessage message={error} /></div>}
        </div>

        <div className="mt-8">
          {!isLoading && !analysisResult && !error && <Welcome />}
          {isLoading && 
            <div className="text-center p-8">
              <div className="inline-block w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-600 font-semibold">Realizando análisis profundo... Esto puede tardar unos momentos.</p>
            </div>
          }
          {analysisResult && <AnalysisDisplay data={analysisResult} />}
        </div>
      </main>
    </div>
  );
}
