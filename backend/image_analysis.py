import os
import sys
from PIL import Image, ImageOps


def analyze_image(image_path):
    """
    Realiza un análisis básico de la imagen forense.
    En una versión real, aquí se podrían integrar modelos de IA para
    detección de anomalías, medidas, etc.
    """
    if not os.path.exists(image_path):
        print(f"Error: El archivo {image_path} no existe.")
        return

    try:
        with Image.open(image_path) as img:
            width, height = img.size
            format = img.format
            mode = img.mode

            print(f"--- Análisis de Imagen Forense ---")
            print(f"Archivo: {os.path.basename(image_path)}")
            print(f"Dimensiones: {width}x{height}")
            print(f"Formato: {format}")
            print(f"Modo de color: {mode}")

            # Ejemplo de procesamiento: detección de bordes básica
            # grayscale = ImageOps.grayscale(img)
            # ... mas analisis

            print("Estado: Procesamiento básico completado.")

    except Exception as e:
        print(f"Error al analizar la imagen: {e}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        analyze_image(sys.argv[1])
    else:
        print("Uso: python image_analysis.py <ruta_de_la_imagen>")
