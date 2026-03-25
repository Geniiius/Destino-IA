/**
 * @file features/admin/hooks/useSlideGeneration.ts
 * @description Hook para procesar documentos PDF y crear slides
 *
 * Solo PDF.js + Supabase - Sin dependencias de IA
 */

import { useState, useCallback } from "react";
import type { Slide, SlideType } from "@/types";

export type GeneratedSlide = Slide & { blob: Blob };

interface UseSlideGenerationOptions {
  onSuccess?: (slides: GeneratedSlide[]) => void;
  onError?: (error: Error) => void;
}

interface UseSlideGenerationReturn {
  isProcessing: boolean;
  error: string | null;
  processDocument: (file: File) => Promise<void>;
  clearError: () => void;
}

interface PDFPage {
  title: string;
  content: string;
  imageUrl: string; // URL object local
  blob: Blob;
}

// Constantes para evitar números mágicos
const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_LENGTH = 500;

/**
 * Hook para procesar documentos PDF y crear slides
 * Extrae el contenido de cada página y crea slides básicos
 */
export function useSlideGeneration(
  options: UseSlideGenerationOptions = {}
): UseSlideGenerationReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Extrae texto de cada página del PDF
   */
  const extractPagesFromPDF = async (file: File): Promise<PDFPage[]> => {
    // PDF.js est chargé via CDN dans index.html
    // @ts-expect-error - pdfjsLib es una variable global
    const pdfjs = window.pdfjsLib;

    if (!pdfjs) {
      throw new Error("PDF.js no está cargado. Verifica el CDN en index.html");
    }

    // Configuer le worker et les polices pour éviter les avertissements
    if (!pdfjs.GlobalWorkerOptions) pdfjs.GlobalWorkerOptions = {};
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      const version = (pdfjs as any).version || "3.11.174";
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const fontVersion = (pdfjs as any).version || "3.11.174";
    const pdf = await pdfjs.getDocument({ 
      data: arrayBuffer,
      standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${fontVersion}/standard_fonts/`,
      disableFontFace: true // Éviter les erreurs CORS sur les polices système
    }).promise;
    const pages: PDFPage[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: { str: string }) => item.str)
        .join(" ")
        .trim();

      // Convertir la page en image
      const viewport = page.getViewport({ scale: 2.0 }); // Scale 2.0 pour haute qualité
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      if (context) {
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Convertir en WebP (beaucoup plus léger que JPEG)
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.8));
        if (!blob) throw new Error("Erreur de conversion WebP sur la page " + i);
        
        const imageUrl = URL.createObjectURL(blob);

        // Extraer título (primera línea con contenido significativo)
        const lines = pageText
          .split(/\s{2,}/)
          .filter((l: string) => l.trim().length > 0);
        const title = lines[0]?.substring(0, MAX_TITLE_LENGTH) || `Slide ${i}`;
        const content = lines
          .slice(1)
          .join(" ")
          .substring(0, MAX_CONTENT_LENGTH);

        pages.push({ title, content, imageUrl, blob });
      }
    }

    return pages;
  };

  /**
   * Determina el tipo de slide basándose en el contenido
   */
  const determineSlideType = (
    index: number,
    total: number,
    content: string
  ): SlideType => {
    if (index === 0) return "intro";
    if (index === total - 1) return "challenge";

    // Detectar ejercicios por palabras clave
    const exerciseKeywords = [
      "ejercicio",
      "práctica",
      "actividad",
      "tarea",
      "exercice",
      "practice",
    ];
    const hasExerciseKeyword = exerciseKeywords.some((keyword) =>
      content.toLowerCase().includes(keyword)
    );

    if (hasExerciseKeyword) return "exercise";
    return "theory";
  };

  const processDocument = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf") {
        setError("Solo se aceptan archivos PDF");
        return;
      }

      setIsProcessing(true);
      setError(null);

      try {
        // 1. Extraer páginas del PDF
        const pages = await extractPagesFromPDF(file);

        if (pages.length === 0) {
          throw new Error("No se pudo extraer contenido del PDF");
        }

        // 2. Crear slides desde las páginas extraídas
        const slides: GeneratedSlide[] = pages.map((page, idx) => ({
          id: `pdf-${Date.now()}-${idx}`,
          title: page.title,
          subtitle: `Página ${idx + 1} de ${pages.length}`,
          content: page.content || "Sin contenido adicional",
          type: determineSlideType(idx, pages.length, page.content),
          order_index: idx,
          is_active: idx === 0,
          imageUrl: page.imageUrl, // Ajouter l'image de la page
          blob: page.blob,         // Ajouter le blob pour l'upload
        }));

        options.onSuccess?.(slides);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(`Error al procesar el documento: ${errorMessage}`);
        options.onError?.(err instanceof Error ? err : new Error(errorMessage));
      } finally {
        setIsProcessing(false);
      }
    },
    [options]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isProcessing,
    error,
    processDocument,
    clearError,
  };
}
