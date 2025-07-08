
import { Type } from "@google/genai";

export const GEMINI_PROMPT = `
**ROL Y OBJETIVO:**
Eres un Gen, un asistente de IA experto en inclusión educativa, diseño curricular universal (DUA) y políticas educativas justas. Tu misión es analizar el texto de un documento académico o de política educativa y generar un informe completo.

**TAREA PRINCIPAL:**
Analiza el siguiente texto extraído de un documento PDF. Tu respuesta DEBE ser un único objeto JSON válido, sin comentarios, texto introductorio, ni markdown. El JSON debe ajustarse estrictamente al schema proporcionado.

**INSTRUCCIONES DE ANÁLISIS:**
1.  **Determinar Tipo de Documento:** Identifica si es un "Programa de Asignatura" o una "Política Educativa".
2.  **Índice de Inclusión:** Evalúa la presencia de conceptos inclusivos en secciones clave. Para cada sección, califica la atención a "NEE", "Talentos", y "Género e Interculturalidad" como "Ausente", "Parcial" o "Completo".
3.  **Análisis por Dimensión:** Proporciona un análisis cualitativo para cada una de las tres dimensiones (NEE, Talentos, Género e Interculturalidad), basándote en los siguientes principios:
    *   Usa lenguaje positivo y propositivo.
    *   Enfócate en fortalezas y potencialidades.
    *   Reconoce que las barreras están en el entorno, no en el estudiante.
    *   Considera contextos como aulas hospitalarias.
    *   Evita terminología de déficit.
4.  **Recomendaciones Textuales:** Genera sugerencias de texto específicas para insertar en el documento y mejorar su nivel de inclusión, siempre respetando la autonomía docente y sin proponer actividades de aula concretas.
5.  **Áreas de Oportunidad:** Identifica vacíos y sugiere mejoras con lenguaje afirmativo.
6.  **Análisis Léxico:** Identifica la frecuencia de palabras clave relacionadas con la inclusión. Las palabras clave son: inclusión, accesible, flexibilidad, ajustes, fortalezas, potencialidades, equidad, hospitalaria, DUA, género, diversidad, diferenciación, excepcional, intercultural. Genera una lista de estas palabras con su frecuencia.
7.  **Gráfico de Inclusión:** Estima un porcentaje de inclusión (0-100%) para cada página o sección principal del documento.
8.  **Clasificación General:** Basado en todo el análisis, clasifica el nivel de inclusión general del documento como "ALTO", "MEDIO" o "BAJO".
9.  **Resumen Ejecutivo:** Escribe un breve resumen de los hallazgos principales.

**TEXTO DEL DOCUMENTO PARA ANALIZAR:**
---
`;

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "Resumen ejecutivo de los hallazgos del análisis." },
    documentType: { type: Type.STRING, description: "Tipo de documento: 'Programa de Asignatura' o 'Política Educativa'." },
    overallInclusionLevel: { type: Type.STRING, description: "Clasificación general de inclusión: 'ALTO', 'MEDIO', o 'BAJO'." },
    inclusionIndex: {
      type: Type.ARRAY,
      description: "Tabla de índice de inclusión por sección y dimensión.",
      items: {
        type: Type.OBJECT,
        properties: {
          page: { type: Type.STRING, description: "Página o sección del documento." },
          section: { type: Type.STRING, description: "Nombre de la sección analizada." },
          nee: { type: Type.STRING, description: "Nivel para Necesidades Educativas Especiales (Ausente, Parcial, Completo)." },
          talents: { type: Type.STRING, description: "Nivel para Talentos Excepcionales (Ausente, Parcial, Completo)." },
          genderInterculturality: { type: Type.STRING, description: "Nivel para Género e Interculturalidad (Ausente, Parcial, Completo)." }
        },
        required: ["page", "section", "nee", "talents", "genderInterculturality"]
      }
    },
    recommendations: {
        type: Type.ARRAY,
        description: "Recomendaciones textuales para mejorar el documento.",
        items: {
            type: Type.OBJECT,
            properties: {
                page: { type: Type.STRING, description: "Página o sección donde aplicar la recomendación." },
                location: { type: Type.STRING, description: "Ubicación exacta para la inserción del texto." },
                suggestion: { type: Type.STRING, description: "Texto sugerido para añadir." }
            },
            required: ["page", "location", "suggestion"]
        }
    },
    dimensionAnalysis: {
        type: Type.OBJECT,
        description: "Análisis cualitativo detallado por cada dimensión.",
        properties: {
            nee: { type: Type.STRING, description: "Análisis de la dimensión de Necesidades Educativas Especiales." },
            talents: { type: Type.STRING, description: "Análisis de la dimensión de Talentos Excepcionales." },
            genderInterculturality: { type: Type.STRING, description: "Análisis de la dimensión de Género e Interculturalidad." }
        },
        required: ["nee", "talents", "genderInterculturality"]
    },
    wordCloudData: {
        type: Type.ARRAY,
        description: "Datos para la nube de palabras clave sobre inclusión.",
        items: {
            type: Type.OBJECT,
            properties: {
                text: { type: Type.STRING, description: "La palabra clave." },
                value: { type: Type.NUMBER, description: "Frecuencia de la palabra." }
            },
            required: ["text", "value"]
        }
    },
    pageInclusionChartData: {
        type: Type.ARRAY,
        description: "Datos para el gráfico de barras de inclusión por página/sección.",
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "Nombre de la página o sección." },
                inclusion: { type: Type.NUMBER, description: "Porcentaje de inclusión estimado (0-100)." }
            },
            required: ["name", "inclusion"]
        }
    },
    opportunityAreas: {
        type: Type.ARRAY,
        description: "Áreas de oportunidad identificadas y sugerencias.",
        items: {
            type: Type.OBJECT,
            properties: {
                aspect: { type: Type.STRING, description: "Aspecto a mejorar." },
                suggestion: { type: Type.STRING, description: "Frase o acción sugerida." }
            },
            required: ["aspect", "suggestion"]
        }
    }
  },
  required: ["summary", "documentType", "overallInclusionLevel", "inclusionIndex", "recommendations", "dimensionAnalysis", "wordCloudData", "pageInclusionChartData", "opportunityAreas"]
};
