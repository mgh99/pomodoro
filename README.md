# 🍅 Pomodoro Timer

Aplicación web para gestionar el tiempo con la técnica Pomodoro. Sin dependencias, sin frameworks — HTML, CSS y JavaScript puro.

## ¿Qué es la técnica Pomodoro?

Divide tu trabajo en bloques de concentración (pomodoros) separados por descansos cortos. Cada 4 pomodoros, tómate un descanso largo.

```
[Pomodoro 25min] → [Descanso corto 5min]  ×4
                                           ↓
                              [Descanso largo 15min]
```

## Funcionalidades

- Temporizador con anillo de progreso animado
- 3 modos: **Pomodoro**, **Descanso corto** y **Descanso largo**
- Indicador de ciclos con puntos de progreso
- Estadísticas del día (pomodoros completados y minutos de foco)
- Sonido al terminar cada fase (Web Audio API, sin archivos externos)
- Notificaciones del navegador
- Configuración personalizable (duración de cada fase, ciclos, auto-inicio)
- Persistencia en `localStorage`

## Uso

### Sin Docker

Abre `index.html` directamente en el navegador. No necesita servidor ni instalación.

### Con Docker

```bash
# Primera vez
docker compose up --build

# Siguientes veces
docker compose up

# Detener
docker compose down
```

La app estará disponible en **http://localhost:8080**.

> Los cambios en `index.html` y `assets/` se reflejan en el contenedor sin necesidad de reconstruir la imagen.

## Estructura del proyecto

```
pomodoro/
├── index.html
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── assets/
    ├── css/
    │   ├── main.css        # Variables, layout, estadísticas
    │   ├── timer.css       # Anillo SVG, tabs, controles
    │   └── components.css  # Botones, modal, toggles
    └── js/
        ├── storage.js      # Persistencia en localStorage
        ├── settings.js     # Modal de configuración
        ├── notifications.js# Sonido y notificaciones
        ├── timer.js        # Lógica de cuenta regresiva
        ├── session.js      # Ciclo pomodoro / descansos
        └── app.js          # Inicialización
```

## Configuración

Haz clic en el ícono ⚙️ para ajustar:

| Opción | Por defecto |
|---|---|
| Duración del pomodoro | 25 min |
| Descanso corto | 5 min |
| Descanso largo | 15 min |
| Ciclos antes del descanso largo | 4 |
| Sonido al terminar | Activado |
| Auto-iniciar siguiente fase | Desactivado |

La configuración se guarda automáticamente en el navegador.
