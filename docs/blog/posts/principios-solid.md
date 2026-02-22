---
date: 2025-02-18
categories:
  - Software
tags:
  - Arquitectura
  - Clean Code
  - Buenas Prácticas
---

# Principios SOLID: Escribiendo Software que Escala

Los principios **SOLID** son la piedra angular del diseño orientado a objetos. Seguirlos te ayuda a construir sistemas mantenibles, extensibles y testables. En este post los exploramos con ejemplos prácticos.

<!-- more -->

## ¿Qué son los principios SOLID?

**SOLID** es un acrónimo que representa cinco principios de diseño de software introducidos por Robert C. Martin (*Uncle Bob*):

- **S**ingle Responsibility Principle
- **O**pen/Closed Principle
- **L**iskov Substitution Principle
- **I**nterface Segregation Principle
- **D**ependency Inversion Principle

## S — Principio de Responsabilidad Única

> Una clase debe tener una sola razón para cambiar.

=== "❌ Mal ejemplo"

    ```python
    class Usuario:
        def __init__(self, nombre: str, email: str):
            self.nombre = nombre
            self.email = email

        def guardar_en_db(self):
            # Lógica de base de datos aquí
            pass

        def enviar_email_bienvenida(self):
            # Lógica de email aquí
            pass
    ```

=== "✅ Buen ejemplo"

    ```python
    class Usuario:
        def __init__(self, nombre: str, email: str):
            self.nombre = nombre
            self.email = email

    class UsuarioRepositorio:
        def guardar(self, usuario: Usuario):
            # Solo responsabilidad: persistencia
            pass

    class EmailService:
        def enviar_bienvenida(self, usuario: Usuario):
            # Solo responsabilidad: envío de emails
            pass
    ```

## O — Principio Abierto/Cerrado

> Las entidades deben estar **abiertas para extensión** pero **cerradas para modificación**.

```python
from abc import ABC, abstractmethod

class Descuento(ABC):
    @abstractmethod
    def calcular(self, precio: float) -> float:
        pass

class DescuentoEstudiante(Descuento):
    def calcular(self, precio: float) -> float:
        return precio * 0.8  # 20% descuento

class DescuentoVIP(Descuento):
    def calcular(self, precio: float) -> float:
        return precio * 0.7  # 30% descuento

# Agregar un nuevo tipo NO requiere modificar código existente
class DescuentoBlackFriday(Descuento):
    def calcular(self, precio: float) -> float:
        return precio * 0.5  # 50% descuento
```

## L — Principio de Sustitución de Liskov

> Los objetos de una clase derivada deben poder sustituir a los de la clase base sin alterar el comportamiento.

!!! warning "Violación común"
    Si una subclase lanza excepciones que la clase base no lanza, o modifica el comportamiento esperado, estás violando LSP.

## I — Principio de Segregación de Interfaces

> Los clientes no deben depender de interfaces que no utilizan.

```python
from abc import ABC, abstractmethod

# ❌ Interfaz gorda
class Animal(ABC):
    @abstractmethod
    def volar(self): pass
    
    @abstractmethod
    def nadar(self): pass
    
    @abstractmethod
    def correr(self): pass

# ✅ Interfaces específicas
class Volador(ABC):
    @abstractmethod
    def volar(self): pass

class Nadador(ABC):
    @abstractmethod
    def nadar(self): pass

class Pato(Volador, Nadador):
    def volar(self): return "El pato vuela"
    def nadar(self): return "El pato nada"
```

## D — Principio de Inversión de Dependencias

> Depende de abstracciones, no de implementaciones concretas.

```python
from abc import ABC, abstractmethod

class BaseDeDatos(ABC):
    @abstractmethod
    def guardar(self, datos: dict): pass

class PostgreSQL(BaseDeDatos):
    def guardar(self, datos: dict):
        print(f"Guardando en PostgreSQL: {datos}")

class MongoDB(BaseDeDatos):
    def guardar(self, datos: dict):
        print(f"Guardando en MongoDB: {datos}")

class ServicioUsuario:
    # Depende de abstracción, no de implementación
    def __init__(self, db: BaseDeDatos):
        self.db = db

    def crear_usuario(self, usuario: dict):
        self.db.guardar(usuario)

# Fácil de cambiar la implementación sin modificar ServicioUsuario
servicio = ServicioUsuario(PostgreSQL())
```

## Resumen visual

| Principio | Pregunta clave | Beneficio |
|-----------|---------------|-----------|
| SRP | ¿Cuántas razones tiene para cambiar? | Cohesión alta |
| OCP | ¿Puedo extender sin modificar? | Estabilidad |
| LSP | ¿Las subclases se comportan correctamente? | Polimorfismo seguro |
| ISP | ¿Estoy forzando interfaces innecesarias? | Desacoplamiento |
| DIP | ¿Dependo de abstracciones? | Flexibilidad |

## Conclusión

Los principios SOLID no son dogmas inamovibles — son guías que, bien aplicadas, producen software más fácil de mantener, testear y extender. El objetivo final siempre es el mismo: **código que los humanos puedan entender y cambiar con confianza**.
