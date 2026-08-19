# GUÍA BREVE PARA DEFENSA ORAL — DIP (segunda actividad)

## 1. ¿Cuál es el proceso?
El mismo de la actividad UML: gestión de ejecuciones automatizadas y calidad de versiones. Esta vez se lleva a código, aplicando el principio DIP.

## 2. ¿Cuál es el objetivo de esta actividad?
Mostrar, con código ejecutable, que separar la política de orquestación (alto nivel) de las herramientas concretas (bajo nivel) mediante abstracciones permite probar y sustituir el pipeline de calidad sin modificarlo.

## 3. ¿Quién participa?
Los mismos de secuencia.puml: Responsable de QA, Pipeline CI/CD, Runner E2E, Repositorio de evidencia y Quality Gate.

## 4. ¿Qué es DIP y por qué se aplicó aquí?
Según la fuente obligatoria (mvpcluster.com): las clases de alto nivel no deben depender de las de bajo nivel, sino que ambas dependan de abstracciones. Se aplicó porque el orquestador necesitaba poder probarse sin herramientas reales y permitir cambiar de Runner E2E o de Repositorio de evidencia sin reescribir la orquestación.

## 5. ¿Dónde está la inversión de la dependencia?
Antes: el orquestador apunta directamente a LectorPlanExcel, RunnerPlaywright, RepositorioEvidenciaDiscoLocal y QualityGateSonarQube (clases concretas). Después: el orquestador solo conoce 4 interfaces (IPlanificadorPruebas, IRunnerE2E, IRepositorioEvidencia, IQualityGate); las clases concretas son las que implementan esas interfaces.

## 6. ¿Qué ocurre si los parámetros son inválidos?
Igual que en la actividad UML: el pipeline bloquea la versión sin invocar al Runner E2E.

## 7. ¿Qué ocurre si el ambiente no está disponible?
Se bloquea la versión y se registra el incidente, sin ejecutar casos.

## 8. ¿Qué pasa si la ejecución queda incompleta o la evidencia no se pudo guardar?
También se bloquea la versión antes de llegar al Quality Gate, evitando que una corrida a medias se interprete como aprobación.

## 9. ¿Qué significa un quality gate aprobado / bloqueado?
Igual que en la actividad UML: aprobado significa que la versión cumple los criterios ficticios definidos y puede continuar; bloqueado significa que existe una condición de calidad que debe corregirse antes de una nueva evaluación.

## 10. Modificación que debes poder hacer
Agregar un quinto adaptador, por ejemplo RepositorioEvidenciaS3 implementando IRepositorioEvidencia, y demostrar que despues_solid.ts (la clase PipelineCalidadOrchestrator) no se modifica, y que el pipeline sigue funcionando igual al inyectarlo.
