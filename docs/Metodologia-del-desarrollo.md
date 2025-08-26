# Metodología de Desarrollo del TFG

Este documento describe la metodología de desarrollo seguida en el proyecto, incluyendo la organización del código, la gestión de commits, ramas, issues y pull requests. Todo el código se realiza en **inglés** para seguir los estándares de programación, mientras que la documentación se mantiene en **español**.

---

## 1. Política de Commits

Se seguirá la convención de **[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/)** para asegurar mensajes claros y consistentes en el historial de Git.

### Tipos permitidos:

- **feat:** Añadir una nueva funcionalidad al proyecto.  
  Ejemplo: `feat(auth): add user registration endpoint`

- **fix:** Corregir un error o bug existente.  
  Ejemplo: `fix(login): correct password validation logic`

- **refactor:** Cambios en el código que no afectan la funcionalidad pero mejoran su estructura.  
  Ejemplo: `refactor(api): simplify user serializer`

- **docs:** Cambios en la documentación.  
  Ejemplo: `docs(readme): update installation instructions`

- **test:** Añadir o modificar pruebas (tests) del proyecto.  
  Ejemplo: `test(auth): add tests for registration endpoint`

- **conf (chore):** Cambios en configuración, dependencias o tareas auxiliares que no afectan la funcionalidad principal.  
  Ejemplo: `conf(ci): update GitHub Actions workflow`

**Recomendaciones adicionales:**

- Los mensajes deben ser claros y concisos, indicando **qué** se ha hecho y **por qué** si es necesario.  
- Usar el tiempo verbal presente en los mensajes: "add", "fix", "update", etc.

---

## 2. Política de Branching (GitHub Flow)

Se seguirá el flujo de **GitHub Flow**, que es simple y adecuado para proyectos individuales:

1. **main:** Rama principal y estable. Solo se integran cambios verificados mediante pull request.  
2. **feature/*:** Ramas para nuevas funcionalidades o mejoras. Nombrarlas de forma descriptiva:  
   Ejemplo: `feature/user-registration`  
3. **bugfix/* (opcional):** Ramas para corrección de errores críticos.  
4. **docs/* (opcional):** Ramas para cambios en documentación.

**Flujo de trabajo:**

- Crear una rama `feature/*` desde `main`.  
- Realizar commits siguiendo Conventional Commits.  
- Abrir un **Pull Request (PR)** hacia `main` cuando la funcionalidad esté lista.  
- Revisar y verificar el PR antes de fusionarlo.  
- Evitar subir cambios directamente a `main`.

> Esta estrategia permite mantener `main` estable y asegurar trazabilidad incluso siendo un proyecto individual.

---

## 3. Gestión de Issues

Las **issues** se utilizarán para planificar y organizar tareas, mejoras y bugs del proyecto. Cada issue debe incluir:

- **Título claro y conciso**.  
- **Descripción detallada** del problema o tarea.  
- **Etiquetas** para categorizar: `bug`, `enhancement`, `documentation`, `help wanted`, etc.  
- **Estado:**  
  - **To Do:** tareas pendientes de iniciar.  
  - **In Progress:** tareas en desarrollo.  
  - **Done:** tareas completadas y verificadas.

---

## 4. Estructura de la Documentación

Toda la documentación se centraliza en la carpeta `docs/` en la raíz del repositorio.

- La documentación se mantiene en español.  
- Cada sección debe tener un archivo `.md` independiente.  
- Se pueden enlazar los documentos desde el README o la wiki de GitHub para navegación rápida.

---

## 5. Buenas Prácticas Adicionales

- Mantener el código limpio y comentado.  
- Escribir pruebas automáticas cuando sea posible.  
- Realizar commits frecuentes y pequeños para facilitar seguimiento.  
- Revisar regularmente el estado de las issues y actualizar su progreso.  
- Mantener consistencia en nombres de archivos, variables y funciones siguiendo convenciones de inglés.  

---

**Objetivo:**  
Garantizar claridad, trazabilidad y organización en el desarrollo del proyecto, manteniendo un historial de cambios limpio y documentación accesible para evaluadores y colaboradores.

