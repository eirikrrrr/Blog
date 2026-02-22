---
date: 2025-02-20
categories:
  - Código
tags:
  - Python
  - Patrones
  - Optimización
---

# Python Avanzado: Trucos y Patrones que Todo Dev Debería Conocer

Python es uno de los lenguajes más versátiles del mundo, pero muchos desarrolladores solo rascan la superficie. Aquí van técnicas avanzadas que mejorarán tu código hoy.

<!-- more -->

## 1. Generators: Memoria eficiente para grandes datasets

```python
# ❌ Carga todo en memoria
def obtener_numeros(n):
    return [i * i for i in range(n)]

# ✅ Generator: procesa uno a uno
def obtener_numeros_gen(n):
    for i in range(n):
        yield i * i

# Para 10 millones de números:
# Lista: ~400MB de RAM
# Generator: ~100 bytes de RAM
for num in obtener_numeros_gen(10_000_000):
    if num > 1000:
        break  # Parar cuando sea necesario
```

## 2. Context Managers: Gestión limpia de recursos

```python
from contextlib import contextmanager
import time

@contextmanager
def timer(nombre: str):
    inicio = time.perf_counter()
    try:
        yield
    finally:
        fin = time.perf_counter()
        print(f"⏱️ {nombre}: {fin - inicio:.4f}s")

# Uso elegante
with timer("operación costosa"):
    resultado = sum(i**2 for i in range(1_000_000))
```

## 3. Decoradores: Reutiliza lógica transversal

```python
import functools
from typing import Callable
import time

def retry(max_intentos: int = 3, delay: float = 1.0):
    """Decorador que reintenta una función en caso de error."""
    def decorator(func: Callable):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            ultimo_error = None
            for intento in range(max_intentos):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    ultimo_error = e
                    print(f"Intento {intento + 1} fallido: {e}")
                    time.sleep(delay)
            raise ultimo_error
        return wrapper
    return decorator

@retry(max_intentos=3, delay=0.5)
def llamar_api(url: str) -> dict:
    import httpx
    response = httpx.get(url, timeout=5)
    response.raise_for_status()
    return response.json()
```

## 4. Dataclasses: Modelos de datos sin boilerplate

```python
from dataclasses import dataclass, field
from datetime import datetime

@dataclass(frozen=True)  # Inmutable como una tupla
class Punto:
    x: float
    y: float

    def distancia_al_origen(self) -> float:
        return (self.x**2 + self.y**2) ** 0.5

@dataclass
class BlogPost:
    titulo: str
    contenido: str
    fecha: datetime = field(default_factory=datetime.now)
    tags: list[str] = field(default_factory=list)
    publicado: bool = False

    def __post_init__(self):
        self.titulo = self.titulo.strip()
        if not self.titulo:
            raise ValueError("El título no puede estar vacío")
```

## 5. Type Hints: Código autodocumentado

```python
from typing import TypeVar, Generic, Protocol

T = TypeVar('T')

class Pila(Generic[T]):
    """Pila genérica con type hints completos."""
    
    def __init__(self) -> None:
        self._items: list[T] = []
    
    def push(self, item: T) -> None:
        self._items.append(item)
    
    def pop(self) -> T:
        if not self._items:
            raise IndexError("La pila está vacía")
        return self._items.pop()
    
    def __len__(self) -> int:
        return len(self._items)

# El IDE entiende los tipos perfectamente
pila: Pila[int] = Pila()
pila.push(42)
valor: int = pila.pop()
```

## 6. Pattern Matching (Python 3.10+)

```python
def procesar_evento(evento: dict) -> str:
    match evento:
        case {"tipo": "click", "elemento": str(elem)}:
            return f"Click en {elem}"
        
        case {"tipo": "teclado", "tecla": "Enter"}:
            return "Enter presionado"
        
        case {"tipo": "error", "codigo": int(cod)} if cod >= 500:
            return f"Error del servidor: {cod}"
        
        case {"tipo": "error", "codigo": int(cod)}:
            return f"Error del cliente: {cod}"
        
        case _:
            return "Evento desconocido"

print(procesar_evento({"tipo": "click", "elemento": "botón-submit"}))
# → "Click en botón-submit"
```

## 7. asyncio: I/O concurrente sin threads

```python
import asyncio
import httpx

async def obtener_datos(url: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()

async def main():
    urls = [
        "https://api.example.com/usuarios",
        "https://api.example.com/productos", 
        "https://api.example.com/pedidos",
    ]
    
    # Ejecutar todas las peticiones EN PARALELO
    resultados = await asyncio.gather(
        *[obtener_datos(url) for url in urls]
    )
    
    for url, datos in zip(urls, resultados):
        print(f"{url}: {len(datos)} registros")

asyncio.run(main())
```

!!! tip "Cuándo usar asyncio"
    `asyncio` brilla cuando tienes muchas operaciones de **I/O** (peticiones HTTP, lectura de archivos, consultas a DB). Para cómputo intensivo, usa `multiprocessing`.

## Conclusión

Python tiene profundidad suficiente para crecer con tus necesidades. Dominar estas técnicas avanzadas te diferencia de un desarrollador promedio — no solo escribes código que funciona, escribes código que **perdura**.
