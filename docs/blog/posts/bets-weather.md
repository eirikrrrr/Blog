---
date: 2025-02-18
categories:
  - Software
tags:
  - Experimento
  - Openclaw
  - Dinero
---

# Bot de apuestas sobre el clima con Openclaw (Opera en Simmer & Polymarket)

### Indice

1. [Instalar Openclaw (WSL / Raspberry)](none)
2. [Integrar Tu Agente En Simmer Market](none)
3. [Estrategia De Apuesta](none)
4. [Algo Interesante](none)


## 1. Instalar OpenClaw 🦀

A. Primero hay que instalar la CLI de openclaw y segun su [Documentacion](https://docs.openclaw.ai/install), con el comando de abajo, puedes instalar la herramienta de CLI 'openclaw' con la cual podemos hacer toda la configuracion de nuestro agente.

    curl -fsSL https://openclaw.ai/install.sh | bash

B. Una vez instalada la CLI, ¿Que opciones selecciono?

    Security warning → Si
    Onboarding       → Quick Start
    Model provider   → OpenAI (Codex OAuth, debes logearte con el link que te da)
    Model            → openai-codex/gpt-5.2
    Auth method      → ChatGPT OAuth
    Skills           → Si y seleccionas Clawdhub (Importante)
    Communication channel → Telegram (Importante Debes crear un bot, mas abajo te muestro como se configura)
    

C. Crear BOT de telegram