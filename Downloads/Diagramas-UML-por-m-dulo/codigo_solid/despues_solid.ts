/**
 * DESPUÉS — Abstracciones ("puertos")
 * -----------------------------------------------------------------------
 * Aplicando Dependency Inversion Principle:
 *   "Las clases de alto nivel no tienen que depender de otras de bajo nivel,
 *    sino que ambas dependan de abstracciones, así como que las
 *    abstracciones no deben depender de los detalles, sino al contrario."
 *   (MVP Cluster, Principios básicos del diseño de software)
 *
 * Estas interfaces son el contrato estable del que dependerán TANTO el
 * orquestador (alto nivel) COMO los adaptadores concretos (bajo nivel).
 *
 * Nombres y decisiones tomados literalmente de las fuentes .puml ya
 * entregadas en la actividad UML previa del mismo repositorio:
 *   diagramas/casos_uso.puml    → actores, CU-01..CU-04, V1..V4
 *   diagramas/actividad.puml    → las 5 decisiones del flujo
 *   diagramas/secuencia.puml    → participantes y mensajes
 */

export interface PlanDePruebas {
  release: string;
  suite: string;
  parametros: Record<string, string>;
  casos: string[];
  /** Corresponde a la decisión "¿Parámetros válidos?" del diagrama de actividad. */
  parametrosValidos: boolean;
}

export interface ResultadoCaso {
  caso: string;
  estado: "passed" | "failed" | "flaky";
  duracionMs: number;
}

export interface DecisionGate {
  aprobado: boolean;
  tasaExito: number;
  motivo: string;
}

/**
 * Puerto: obtención y validación del plan de pruebas.
 * Corresponde a CU-01 "Planificar ejecución E2E" + V1 "Validar parámetros de ejecución".
 */
export interface IPlanificadorPruebas {
  obtenerPlan(release: string): Promise<PlanDePruebas> | PlanDePruebas;
}

/**
 * Puerto: participante "Runner E2E" del diagrama de secuencia.
 * Corresponde a CU-02 "Ejecutar pruebas E2E" + V2 "Verificar ambiente de pruebas".
 */
export interface IRunnerE2E {
  /** Decisión "¿Ambiente disponible?" del diagrama de actividad. */
  verificarAmbiente(): Promise<boolean> | boolean;
  ejecutar(plan: PlanDePruebas): Promise<ResultadoCaso[]> | ResultadoCaso[];
}

/**
 * Puerto: participante "Repositorio de evidencia" del diagrama de secuencia.
 * Corresponde a CU-03 "Conservar evidencia" + V3 "Registrar resultados y evidencias".
 * Devuelve null si la evidencia no pudo conservarse completa (decisión "¿Evidencia completa?").
 */
export interface IRepositorioEvidencia {
  guardar(release: string, resultados: ResultadoCaso[]): Promise<string | null> | string | null;
}

/**
 * Puerto: participante "Quality Gate" del diagrama de secuencia.
 * Corresponde a CU-04 "Aplicar quality gate" + V4 "Evaluar criterios de calidad".
 * Decisión "¿Quality gate aprobado?" del diagrama de actividad.
 */
export interface IQualityGate {
  evaluar(resultados: ResultadoCaso[]): Promise<DecisionGate> | DecisionGate;
}

/**
 * DESPUÉS — Adaptadores de bajo nivel
 * -----------------------------------------------------------------------
 * Cada adaptador IMPLEMENTA un puerto. La flecha de dependencia va del
 * detalle hacia la abstracción (no al revés): "las abstracciones no deben
 * depender de los detalles, sino los detalles de las abstracciones".
 * Son intercambiables entre sí sin afectar al orquestador.
 *
 * Los datos (release, suite, parámetros, casos) son exclusivamente
 * ficticios, sin información clínica identificable.
 */

// --- CU-01 + V1: Planificación y validación de parámetros ------------------

export class PlanificadorExcel implements IPlanificadorPruebas {
  constructor(private readonly rutaArchivo: string) {}
  obtenerPlan(release: string): PlanDePruebas {
    console.log(`[Excel] Responsable de QA define versión, suite y parámetros desde ${this.rutaArchivo}`);
    return {
      release,
      suite: "smoke-hospitalario-ficticio",
      parametros: { ambiente: "staging-ficticio", navegador: "chromium" },
      casos: ["CP-001-login-ficticio", "CP-002-agenda-cita-ficticia", "CP-003-registro-paciente-ficticio"],
      parametrosValidos: true,
    };
  }
}

export class PlanificadorJira implements IPlanificadorPruebas {
  async obtenerPlan(release: string): Promise<PlanDePruebas> {
    console.log(`[Jira] Consultando ciclo de pruebas del release ${release}`);
    return {
      release,
      suite: "regresion-ficticia",
      parametros: { ambiente: "qa-ficticio" },
      casos: ["CP-001-login-ficticio", "CP-004-alta-medico-ficticio"],
      parametrosValidos: true,
    };
  }
}

/** Adaptador usado para demostrar la decisión "¿Parámetros válidos?" = No. */
export class PlanificadorConParametrosIncompletos implements IPlanificadorPruebas {
  obtenerPlan(release: string): PlanDePruebas {
    console.log(`[Planificación] Parámetros incompletos detectados para ${release}`);
    return { release, suite: "", parametros: {}, casos: [], parametrosValidos: false };
  }
}

// --- CU-02 + V2: Runner E2E ---------------------------------------------------

export class RunnerPlaywright implements IRunnerE2E {
  verificarAmbiente(): boolean {
    return true;
  }
  ejecutar(plan: PlanDePruebas): ResultadoCaso[] {
    console.log(`[Runner E2E · Playwright] Ejecutando ${plan.casos.length} casos E2E...`);
    return plan.casos.map((c) => ({ caso: c, estado: "passed", duracionMs: 1200 }));
  }
}

export class RunnerCypress implements IRunnerE2E {
  verificarAmbiente(): boolean {
    return true;
  }
  ejecutar(plan: PlanDePruebas): ResultadoCaso[] {
    console.log(`[Runner E2E · Cypress] Ejecutando ${plan.casos.length} casos E2E...`);
    return plan.casos.map((c, i) => ({
      caso: c,
      estado: i === plan.casos.length - 1 ? "failed" : "passed",
      duracionMs: 900,
    }));
  }
}

/** Adaptador usado para demostrar la decisión "¿Ambiente disponible?" = No. */
export class RunnerConAmbienteNoDisponible implements IRunnerE2E {
  verificarAmbiente(): boolean {
    console.log("[Runner E2E] Ambiente de pruebas no disponible");
    return false;
  }
  ejecutar(): ResultadoCaso[] {
    throw new Error("No debería llamarse: el ambiente no estaba disponible");
  }
}

// --- CU-03 + V3: Repositorio de evidencia ------------------------------------

export class RepositorioEvidenciaLocal implements IRepositorioEvidencia {
  guardar(release: string, resultados: ResultadoCaso[]): string {
    const ruta = `./evidencias/${release}.json`;
    console.log(`[Repositorio de evidencia · disco local] Evidencia guardada en ${ruta} (${resultados.length} casos)`);
    return ruta;
  }
}

export class RepositorioEvidenciaFirebase implements IRepositorioEvidencia {
  async guardar(release: string, resultados: ResultadoCaso[]): Promise<string> {
    const ruta = `firestore://evidencias/${release}`;
    console.log(`[Repositorio de evidencia · Firebase] Evidencia sincronizada en ${ruta} (${resultados.length} casos)`);
    return ruta;
  }
}

/** Adaptador usado para demostrar la decisión "¿Evidencia completa?" = No. */
export class RepositorioEvidenciaConFalloDeEscritura implements IRepositorioEvidencia {
  guardar(): null {
    console.log("[Repositorio de evidencia] No se pudo confirmar el almacenamiento de la evidencia");
    return null;
  }
}

// --- CU-04 + V4: Quality Gate --------------------------------------------------

export class QualityGateSonarQube implements IQualityGate {
  constructor(private readonly umbral = 0.95) {}
  evaluar(resultados: ResultadoCaso[]): DecisionGate {
    const exitosos = resultados.filter((r) => r.estado === "passed").length;
    const tasaExito = exitosos / resultados.length;
    return {
      aprobado: tasaExito >= this.umbral,
      tasaExito,
      motivo: `umbral SonarQube ${this.umbral * 100}% (V4)`,
    };
  }
}

/**
 * DESPUÉS — Módulo de alto nivel (política de negocio)
 * -----------------------------------------------------------------------
 * PipelineCalidadOrchestrator materializa en código el mismo recorrido ya
 * modelado en diagramas/actividad.puml y diagramas/secuencia.puml de la
 * actividad UML previa:
 *
 *   Responsable de QA → Pipeline CI/CD → Runner E2E → Repositorio de
 *   evidencia → Quality Gate → versión apta / versión bloqueada
 *
 * con sus 5 decisiones en el mismo orden:
 *   1. ¿Parámetros válidos?      (V1, dentro de IPlanificadorPruebas)
 *   2. ¿Ambiente disponible?     (V2, IRunnerE2E.verificarAmbiente)
 *   3. ¿Pruebas completadas?     (comparación de resultados vs. plan.casos)
 *   4. ¿Evidencia completa?      (V3, IRepositorioEvidencia.guardar)
 *   5. ¿Quality gate aprobado?   (V4, IQualityGate.evaluar)
 *
 * PipelineCalidadOrchestrator NO conoce Excel, Playwright, disco local ni
 * SonarQube: solo conoce los 4 puertos definidos en puertos.ts, recibidos
 * por INYECCIÓN DE DEPENDENCIAS en el constructor (DIP).
 */
export class PipelineCalidadOrchestrator {
  constructor(
    private readonly planificador: IPlanificadorPruebas,
    private readonly runner: IRunnerE2E,
    private readonly repositorioEvidencia: IRepositorioEvidencia,
    private readonly gate: IQualityGate
  ) {}

  async ejecutarPipeline(release: string): Promise<DecisionGate> {
    // CU-01 — Planificar ejecución E2E
    const plan = await this.planificador.obtenerPlan(release);

    // Decisión 1: ¿Parámetros válidos? (V1)
    if (!plan.parametrosValidos) {
      return this.bloquear("Parámetros inválidos: se solicita corrección de la planificación (V1).");
    }

    // Decisión 2: ¿Ambiente disponible? (V2)
    const ambienteDisponible = await this.runner.verificarAmbiente();
    if (!ambienteDisponible) {
      return this.bloquear("Ambiente no disponible: se registra el incidente de ejecución (V2).");
    }

    // CU-02 — Ejecutar pruebas E2E (rol: Runner E2E)
    const resultados = await this.runner.ejecutar(plan);

    // Decisión 3: ¿Pruebas completadas?
    const pruebasCompletadas = resultados.length === plan.casos.length;
    if (!pruebasCompletadas) {
      return this.bloquear("Ejecución incompleta: se conserva el diagnóstico disponible.");
    }

    // CU-03 — Conservar evidencia (rol: Repositorio de evidencia, V3)
    const ubicacionEvidencia = await this.repositorioEvidencia.guardar(release, resultados);

    // Decisión 4: ¿Evidencia completa?
    if (!ubicacionEvidencia) {
      return this.bloquear("Evidencia incompleta: se solicita corrección y nueva ejecución.");
    }

    // CU-04 — Aplicar quality gate (rol: Quality Gate, V4)
    const decision = await this.gate.evaluar(resultados);

    // Decisión 5: ¿Quality gate aprobado?
    this.log(decision);
    return decision;
  }

  private bloquear(motivo: string): DecisionGate {
    const decision: DecisionGate = { aprobado: false, tasaExito: 0, motivo };
    this.log(decision);
    return decision;
  }

  private log(decision: DecisionGate): void {
    console.log(
      decision.aprobado
        ? `✅ Quality Gate APROBADO — versión apta para continuar (${(decision.tasaExito * 100).toFixed(1)}%) — ${decision.motivo}`
        : `❌ Quality Gate BLOQUEADO — versión bloqueada, causas registradas — ${decision.motivo}`
    );
  }
}
