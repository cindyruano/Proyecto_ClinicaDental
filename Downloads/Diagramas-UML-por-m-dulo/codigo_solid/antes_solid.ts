/**
 * ANTES — Sin aplicar DIP
 * -----------------------------------------------------------------------
 * El módulo de alto nivel (PipelineCalidadOrchestrator) construye e invoca
 * directamente clases concretas de bajo nivel para replicar el mismo flujo
 * de 5 decisiones de diagramas/actividad.puml (¿Parámetros válidos?,
 * ¿Ambiente disponible?, ¿Pruebas completadas?, ¿Evidencia completa?,
 * ¿Quality gate aprobado?), pero acoplado a Excel, Playwright, disco local
 * y SonarQube concretos.
 *
 * Problema (incumplimiento de DIP):
 *  - La política de orquestación (alto nivel) depende de detalles de
 *    infraestructura (bajo nivel): rutas de archivo, SDK de Playwright,
 *    API HTTP de SonarQube.
 *  - Para probar el orquestador en aislamiento (unit test) es obligatorio
 *    tener disco, navegador y servidor SonarQube disponibles.
 *  - Para cambiar de Runner E2E (p. ej. Cypress) o de Repositorio de
 *    evidencia (p. ej. Firebase) hay que MODIFICAR esta clase.
 */

// ---- Clases concretas de bajo nivel (detalles de infraestructura) --------

class LectorPlanExcel {
  leerPlan(rutaArchivo: string) {
    console.log(`[Excel] Responsable de QA define versión, suite y parámetros desde ${rutaArchivo}`);
    return {
      release: "R-2026.08-ficticio",
      casos: ["CP-001-login-ficticio", "CP-002-agenda-cita-ficticia", "CP-003-registro-paciente-ficticio"],
      parametrosValidos: true,
    };
  }
}

class RunnerPlaywright {
  verificarAmbiente(): boolean {
    return true;
  }
  ejecutar(casos: string[]) {
    console.log(`[Runner E2E · Playwright] Ejecutando ${casos.length} casos E2E...`);
    return casos.map((c) => ({ caso: c, estado: "passed" as const, duracionMs: 1200 }));
  }
}

class RepositorioEvidenciaDiscoLocal {
  guardar(release: string, resultados: unknown) {
    // Escribe evidencia únicamente en una carpeta local fija del runner de CI.
    const ruta = `C:/ci-runner/evidencias/${release}.json`;
    console.log(`[Repositorio de evidencia · disco local] Evidencia guardada en ${ruta}`);
    return ruta;
  }
}

class QualityGateSonarQube {
  evaluar(resultados: { estado: string }[]) {
    // Acoplado a la API HTTP concreta de SonarQube y a un umbral fijo.
    const fallidos = resultados.filter((r) => r.estado !== "passed").length;
    const tasaExito = (resultados.length - fallidos) / resultados.length;
    console.log(`[Quality Gate · SonarQube] tasa de éxito=${(tasaExito * 100).toFixed(1)}%`);
    return tasaExito >= 0.95; // umbral quemado en el código
  }
}

// ---- Módulo de alto nivel (política de negocio) ---------------------------

export class PipelineCalidadOrchestrator {
  ejecutarPipeline(release: string): boolean {
    // Alto nivel construyendo e invocando directamente clases de bajo nivel:
    // ¡acoplamiento fuerte! No hay ninguna abstracción de por medio.
    const lector = new LectorPlanExcel();
    const runner = new RunnerPlaywright();
    const repositorioEvidencia = new RepositorioEvidenciaDiscoLocal();
    const gate = new QualityGateSonarQube();

    const plan = lector.leerPlan("./planes/plan-actual.xlsx");
    if (!plan.parametrosValidos) {
      console.log("❌ Parámetros inválidos");
      return false;
    }
    if (!runner.verificarAmbiente()) {
      console.log("❌ Ambiente no disponible");
      return false;
    }

    const resultados = runner.ejecutar(plan.casos);
    if (resultados.length !== plan.casos.length) {
      console.log("❌ Ejecución incompleta");
      return false;
    }

    const ubicacion = repositorioEvidencia.guardar(release, resultados);
    if (!ubicacion) {
      console.log("❌ Evidencia incompleta");
      return false;
    }

    const aprobado = gate.evaluar(resultados);
    console.log(aprobado ? "✅ Quality Gate APROBADO — versión apta para continuar" : "❌ Quality Gate BLOQUEADO — versión bloqueada");
    return aprobado;
  }
}

// Demostración
if (require.main === module) {
  new PipelineCalidadOrchestrator().ejecutarPipeline("R-2026.08-ficticio");
}
