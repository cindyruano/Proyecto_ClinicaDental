import {
  PipelineCalidadOrchestrator,
  PlanificadorExcel,
  PlanificadorJira,
  RunnerPlaywright,
  RunnerCypress,
  RunnerConAmbienteNoDisponible,
  RepositorioEvidenciaLocal,
  RepositorioEvidenciaFirebase,
  RepositorioEvidenciaConFalloDeEscritura,
  QualityGateSonarQube,
  PlanificadorConParametrosIncompletos,
  IPlanificadorPruebas,
  IRunnerE2E,
  IRepositorioEvidencia,
  IQualityGate,
  ResultadoCaso,
  PlanDePruebas,
} from "./despues_solid";

// ---------------------------------------------------------------------------
// Dobles de prueba (fakes) — NO usan disco, red ni navegador.
// Solo son posibles porque el orquestador depende de abstracciones (DIP).
// ---------------------------------------------------------------------------
class PlanificadorFake implements IPlanificadorPruebas {
  obtenerPlan(): PlanDePruebas {
    return {
      release: "TEST",
      suite: "smoke-ficticia",
      parametros: { ambiente: "test" },
      casos: ["CP-A", "CP-B", "CP-C", "CP-D"],
      parametrosValidos: true,
    };
  }
}

class RunnerFakeTodoPasa implements IRunnerE2E {
  verificarAmbiente() {
    return true;
  }
  ejecutar(): ResultadoCaso[] {
    return [
      { caso: "CP-A", estado: "passed", duracionMs: 10 },
      { caso: "CP-B", estado: "passed", duracionMs: 10 },
      { caso: "CP-C", estado: "passed", duracionMs: 10 },
      { caso: "CP-D", estado: "passed", duracionMs: 10 },
    ];
  }
}

class RunnerFakeConFallo implements IRunnerE2E {
  verificarAmbiente() {
    return true;
  }
  ejecutar(): ResultadoCaso[] {
    return [
      { caso: "CP-A", estado: "passed", duracionMs: 10 },
      { caso: "CP-B", estado: "failed", duracionMs: 10 },
      { caso: "CP-C", estado: "passed", duracionMs: 10 },
      { caso: "CP-D", estado: "passed", duracionMs: 10 },
    ];
  }
}

class RunnerFakeIncompleto implements IRunnerE2E {
  verificarAmbiente() {
    return true;
  }
  ejecutar(): ResultadoCaso[] {
    // Solo devuelve 2 de los 4 casos planificados -> "¿Pruebas completadas?" = No
    return [
      { caso: "CP-A", estado: "passed", duracionMs: 10 },
      { caso: "CP-B", estado: "passed", duracionMs: 10 },
    ];
  }
}

class RepositorioEvidenciaEnMemoria implements IRepositorioEvidencia {
  public guardado: ResultadoCaso[] | null = null;
  guardar(_release: string, resultados: ResultadoCaso[]) {
    this.guardado = resultados;
    return "memoria://evidencia-test";
  }
}

class QualityGateSimple implements IQualityGate {
  evaluar(resultados: ResultadoCaso[]) {
    const exitosos = resultados.filter((r) => r.estado === "passed").length;
    const tasaExito = exitosos / resultados.length;
    return { aprobado: tasaExito === 1, tasaExito, motivo: "100% requerido (test, V4)" };
  }
}

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error("FALLÓ: " + msg);
  console.log("OK   -", msg);
}

async function main() {
  console.log("=== CASO 1: parámetros inválidos -> bloqueado sin invocar Runner E2E (V1) ===");
  const orquestador1 = new PipelineCalidadOrchestrator(
    new PlanificadorConParametrosIncompletos(),
    new RunnerConAmbienteNoDisponible(), // si se llamara, lanzaría excepción: prueba de que NO se invoca
    new RepositorioEvidenciaEnMemoria(),
    new QualityGateSimple()
  );
  const decision1 = await orquestador1.ejecutarPipeline("TEST");
  assert(decision1.aprobado === false, "bloqueado por parámetros inválidos, sin tocar el Runner E2E");

  console.log("\n=== CASO 2: ambiente no disponible -> bloqueado (V2) ===");
  const orquestador2 = new PipelineCalidadOrchestrator(
    new PlanificadorFake(),
    new RunnerConAmbienteNoDisponible(),
    new RepositorioEvidenciaEnMemoria(),
    new QualityGateSimple()
  );
  const decision2 = await orquestador2.ejecutarPipeline("TEST");
  assert(decision2.aprobado === false, "bloqueado por ambiente no disponible");

  console.log("\n=== CASO 3: ejecución incompleta -> bloqueado (¿Pruebas completadas?) ===");
  const orquestador3 = new PipelineCalidadOrchestrator(
    new PlanificadorFake(),
    new RunnerFakeIncompleto(),
    new RepositorioEvidenciaEnMemoria(),
    new QualityGateSimple()
  );
  const decision3 = await orquestador3.ejecutarPipeline("TEST");
  assert(decision3.aprobado === false, "bloqueado porque el número de resultados no coincide con el plan");

  console.log("\n=== CASO 4: evidencia incompleta -> bloqueado (V3) ===");
  const orquestador4 = new PipelineCalidadOrchestrator(
    new PlanificadorFake(),
    new RunnerFakeTodoPasa(),
    new RepositorioEvidenciaConFalloDeEscritura(),
    new QualityGateSimple()
  );
  const decision4 = await orquestador4.ejecutarPipeline("TEST");
  assert(decision4.aprobado === false, "bloqueado porque el repositorio de evidencia no confirmó el guardado");

  console.log("\n=== CASO 5: quality gate rechazado -> versión bloqueada (V4) ===");
  const evidenciaMem5 = new RepositorioEvidenciaEnMemoria();
  const orquestador5 = new PipelineCalidadOrchestrator(
    new PlanificadorFake(),
    new RunnerFakeConFallo(),
    evidenciaMem5,
    new QualityGateSimple()
  );
  const decision5 = await orquestador5.ejecutarPipeline("TEST");
  assert(decision5.aprobado === false, "quality gate rechaza (versión bloqueada) cuando hay al menos un caso fallido");
  assert(evidenciaMem5.guardado !== null, "aun así la evidencia quedó conservada antes del rechazo (CU-03)");

  console.log("\n=== CASO 6: camino feliz completo -> versión apta (aislamiento total, sin disco/red/navegador) ===");
  const evidenciaMem6 = new RepositorioEvidenciaEnMemoria();
  const orquestador6 = new PipelineCalidadOrchestrator(
    new PlanificadorFake(),
    new RunnerFakeTodoPasa(),
    evidenciaMem6,
    new QualityGateSimple()
  );
  const decision6 = await orquestador6.ejecutarPipeline("TEST");
  assert(decision6.aprobado === true, "quality gate aprueba (versión apta) cuando el 100% de casos pasan");

  console.log(
    "\n=== CASO 7: mismo orquestador, ahora con adaptadores 'reales' (Jira+Cypress+Firebase) ==="
  );
  console.log("Ninguna línea de PipelineCalidadOrchestrator cambió para lograr esto.");
  const orquestador7 = new PipelineCalidadOrchestrator(
    new PlanificadorJira(),
    new RunnerCypress(),
    new RepositorioEvidenciaFirebase(),
    new QualityGateSonarQube(0.8)
  );
  const decision7 = await orquestador7.ejecutarPipeline("R-2026.08-ficticio");
  assert(typeof decision7.aprobado === "boolean", "el orquestador funciona igual con adaptadores distintos");

  console.log(
    "\n=== CASO 8: mismo orquestador, combinación Excel+Playwright+Disco local+Sonar ==="
  );
  const orquestador8 = new PipelineCalidadOrchestrator(
    new PlanificadorExcel("./planes/plan-actual.xlsx"),
    new RunnerPlaywright(),
    new RepositorioEvidenciaLocal(),
    new QualityGateSonarQube(0.95)
  );
  await orquestador8.ejecutarPipeline("R-2026.08-ficticio");

  console.log("\nTodas las verificaciones pasaron.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
