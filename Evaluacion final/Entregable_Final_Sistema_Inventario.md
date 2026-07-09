# Sistema Web de Seguimiento y Control de Inventario para Bodegas y Tiendas Pequeñas empleando Vue 3 y Django REST Framework

Nils Quispe Villalobos¹; Gustavo Cutipa Pérez¹; Cristhian Salas Porras¹; Julio Guillermo Colca¹ & Kevin Villafuerte Sanchez¹

¹ Escuela Académica Profesional de Ingeniería de Sistemas e Informática, Universidad Continental, Cusco, Perú.

---

## RESUMEN EJECUTIVO

Las bodegas y tiendas pequeñas del Perú operan mayoritariamente sin sistemas estructurados de control de inventario, lo que genera pérdidas por desabastecimiento y decisiones de reposición basadas en estimación antes que en datos. Este proyecto desarrolla un sistema web de inventario para ese segmento, con módulos de productos, movimientos, alertas de stock mínimo, proveedores, usuarios con roles diferenciados y reportes de valorización, sobre una arquitectura de tres capas: Vue 3, Django REST Framework y SQLite durante el desarrollo, migrable a PostgreSQL en producción sin alterar el modelo de datos. El desarrollo sigue Scrum en cuatro sprints de dos semanas, con implementación incremental de cada módulo bajo dirección del equipo, complementado con control de hitos y gestión de cambios sobre una línea base fijada al cierre del primer sprint. Al cierre del Sprint 3, cinco de ocho hitos y el 59 % del Product Backlog estaban completados: los módulos de autenticación, productos, movimientos, alertas y proveedores operan de forma verificada, mientras que reportes, despliegue en la nube y validación con usuario real corresponden al Sprint 4. El plan de pruebas contempla verificación funcional interna y una prueba de aceptación con un bodeguero real, cuyos resultados se incorporan en la sección VIII una vez ejecutadas. El aporte principal no es solo técnico: el motor de alertas se adapta a la disponibilidad de historial, resolviendo el arranque en frío de todo sistema predictivo nuevo.

---

## I. ANÁLISIS DE PROBLEMAS

### 1.1 Identificación y formulación del problema

En el Perú, el 91,8 % de las empresas comerciales corresponde a micro y pequeñas empresas [1]. Ese universo concentra al comercio de barrio, y dentro de él, más del 90 % no ejerce un control eficiente de sus inventarios [2]. La cifra no describe una situación marginal: describe la norma.

¿Qué ocurre cuando ese control no existe? Sucede lo que documenta la evidencia reciente sobre pequeñas empresas comerciales peruanas: compras duplicadas, productos que pierden vigencia sin detectarse a tiempo y roturas de stock que se traducen directamente en ventas perdidas. Un estudio de 2024 sobre una empresa ferretera peruana, con observación estructurada y análisis documental sobre más de 2000 registros de inventario, identificó la falta de herramientas de control como la causa raíz individual con mayor impacto sobre los costos operacionales del negocio, por delante de la ausencia de clasificación de existencias o de un software dedicado [2]. Ese hallazgo importa aquí no porque una ferretería sea idéntica a una bodega de barrio, sino porque comparte el mismo perfil de usuario: personal que trabaja de manera empírica, sin formación previa en gestión de inventarios y sin presupuesto para un ERP comercial.

En Cusco, donde el comercio de proximidad constituye una fuente de ingreso familiar extendida, esta carencia no es solo un problema de eficiencia interna. Limita la capacidad del negocio para crecer: un bodeguero que no sabe con certeza cuánto stock tiene no puede negociar mejores condiciones con proveedores ni anticipar compras estacionales.

**Problema central:** ¿de qué manera un sistema web de seguimiento y control de inventario puede reducir las pérdidas operativas y mejorar la toma de decisiones de reposición en bodegas y tiendas pequeñas del contexto urbano peruano?

Tres restricciones delimitan el alcance de cualquier solución viable para este problema. La restricción económica es la más evidente: las soluciones ERP comerciales disponibles en el mercado peruano cobran entre S/ 150 y S/ 500 mensuales, un costo que no es sostenible para un negocio con ingresos mensuales inferiores a S/ 10 000. La restricción técnica se deriva del perfil de usuario: la mayoría de propietarios de bodega no cuenta con formación para operar sistemas complejos ni con acceso a soporte técnico especializado. La restricción de conectividad, por último, condiciona el diseño hacia una arquitectura que no dependa de una conexión estable, ya que algunas zonas urbanas periféricas de Cusco presentan conectividad intermitente.

### 1.2 Objetivos del proyecto

**Objetivo general:** desarrollar un sistema web de seguimiento y control de inventario que permita a bodegas y tiendas pequeñas de Cusco reducir las pérdidas por desabastecimiento y sustituir el registro manual por decisiones de reposición basadas en datos.

**Objetivos específicos:**

1. Implementar un módulo de registro de entradas y salidas de inventario que actualice el stock disponible en tiempo real, verificable mediante la ausencia de discrepancias en pruebas de transacciones controladas.
2. Diseñar un motor de alertas que anticipe el agotamiento de stock combinando un umbral mínimo configurable con el cálculo de la tasa de consumo histórica, verificable mediante el porcentaje de productos en stock crítico que efectivamente generan alerta.
3. Validar la usabilidad del sistema con un usuario real del segmento objetivo, sin capacitación previa, verificable mediante el tiempo empleado en completar las tareas principales del sistema en una sola sesión.

---

## II. CONOCIMIENTOS DE INGENIERÍA APLICADOS / RELACIONADOS

**Conocimiento en Matemáticas.** El sistema aplica estadística descriptiva en el módulo de alertas, concretamente en el cálculo de la tasa de consumo promedio de un producto durante los últimos 30 días de movimientos registrados. La fórmula operativa —días_restantes = stock_actual / tasa_consumo_diaria_promedio— parece trivial, pero exige una decisión estadística real: ¿qué hacer cuando no hay observaciones suficientes para que ese promedio sea confiable? La sección VII.3 documenta cómo el equipo resolvió esa pregunta. La misma lógica de agregación aparece en el módulo de reportes, donde la valorización total del inventario se calcula como la sumatoria del producto entre stock actual y precio de venta de cada ítem del catálogo (RF-09). Ninguna de las dos operaciones es matemáticamente compleja, y es precisamente por eso que sirven como recordatorio de algo que suele pasar inadvertido: el valor de un sistema de gestión rara vez depende de la sofisticación del cálculo, sino de aplicarlo sobre datos correctos y con las validaciones adecuadas [3].

**Conocimiento en ciencias naturales.** El módulo de movimientos (RF-02, RF-03) actualiza el stock de cada producto mediante la expresión stock_actual = stock_anterior + entradas − salidas. Esa ecuación no es una convención arbitraria de diseño: es la forma discreta de un balance de materia, uno de los principios básicos de la ciencia física, según el cual la masa que entra a un proceso debe igualar a la masa que sale más la que se acumula en él [4]. En ingeniería de procesos, esta ley gobierna desde el balance de una planta industrial hasta el diseño de un sistema de evaporación; en este proyecto gobierna, a menor escala, la integridad del stock de cada producto. La aplicación no es decorativa: es la razón concreta por la que, en el diseño de base de datos (sección VI.2), los movimientos de inventario no admiten operación de actualización ni eliminación. Permitir editar un movimiento ya registrado equivaldría, en términos físicos, a introducir una fuente o un sumidero de masa no contabilizado en el sistema; los errores se corrigen en cambio con un nuevo movimiento de ajuste, preservando la trazabilidad completa del balance. Esta analogía tiene un límite que conviene precisar: el sistema no resuelve ecuaciones diferenciales ni modela fenómenos físicos continuos, aplica el principio de conservación en su forma más elemental y contable. Es, con todo, la ley natural que sostiene efectivamente la lógica de negocio del módulo más crítico del sistema.

**Conocimiento en Ingeniería.** Los principios aplicados corresponden, en su mayoría, a la ingeniería de software: arquitectura de tres capas para separar presentación, lógica de negocio y persistencia (sección VI.3); diseño de API REST como contrato de comunicación entre frontend y backend; normalización de base de datos hasta la Tercera Forma Normal para eliminar redundancia (sección VI.2); autenticación mediante JSON Web Tokens (JWT) para control de acceso sin estado (RNF-04, CA-04); y metodología ágil Scrum para la planificación y ejecución del desarrollo (sección IV). Cada principio se aplica en un módulo identificable, no como referencia teórica aislada: la arquitectura de tres capas estructura el proyecto completo, la normalización gobierna las ocho tablas del esquema relacional, y JWT protege los endpoints de administración frente a solicitudes de usuarios con rol de vendedor.

---

## III. INGENIERO Y LA SOCIEDAD

**Justificación social.** Casi todas las empresas comerciales del país —el 91,8 %— son micro o pequeñas empresas [1], y dentro de ese universo, la bodega de barrio funciona como fuente de ingreso familiar en ciudades intermedias como Cusco. La ausencia de herramientas de gestión adecuadas no es, en ese contexto, un simple inconveniente operativo: limita directamente la capacidad de estos negocios para crecer y para sostenerse en el tiempo. Cualquier ingeniero que diseñe soluciones para el mercado peruano se topará, tarde o temprano, con este mismo patrón: la tecnología disponible está calibrada para organizaciones con estructura y presupuesto, no para el segmento que constituye la mayoría del tejido comercial real. La lección para la práctica profesional es concreta: diseñar pensando en el usuario promedio del segmento, no en el usuario ideal que aparece en la documentación del framework.

**Justificación económica.** Las decisiones de inventario mal informadas tienen un costo medible. En la empresa ferretera peruana analizada en [2], la falta de herramientas de control de inventarios resultó ser la causa raíz individual con mayor impacto sobre los costos operacionales —16 % del total—, por delante de la inexistencia de clasificación de inventarios o de un software dedicado. La misma investigación reporta que implementar herramientas de control simples, como un kardex digital y una clasificación ABC, redujo los costos operacionales asociados hasta en 26,3 %. Esa cifra no es directamente extrapolable a una bodega: la empresa del estudio maneja más de 2000 SKU, muy por encima del catálogo de 50 a 500 productos que define al segmento objetivo de este proyecto. Sostiene, sin embargo, la premisa central: sistematizar el control de inventario, incluso con herramientas modestas, produce ahorros verificables antes de considerar cualquier funcionalidad avanzada.

**Justificación ambiental.** Sustituir el cuaderno físico de registro por un sistema digital reduce el consumo de papel asociado a la operación diaria de un negocio, un beneficio que las estrategias de digitalización orientadas a pequeñas empresas documentan de forma consistente [5]. El efecto es marginal frente al impacto ambiental agregado de otras actividades del negocio —el transporte de mercadería, por ejemplo, probablemente pesa más— y sería impreciso presentarlo como el aporte ambiental central del proyecto. Es, con todo, un efecto real y verificable, y coherente con el objetivo estratégico peruano de digitalización de las MYPE.

**Justificación política y normativa.** El Estado peruano estableció la digitalización de las micro y pequeñas empresas como objetivo estratégico mediante la Política Nacional de Competitividad y Productividad [6]. Este proyecto se inserta en ese marco no como una obligación regulatoria —el sistema no está sujeto a reporte ante ninguna entidad— sino como una respuesta consistente con la dirección de política pública vigente para el sector.

**Acontecimientos tecnológicos y científicos.** Hace una década, desplegar un sistema web con autenticación segura y base de datos relacional en producción exigía contratar un servidor propio y administrar buena parte de la infraestructura manualmente. La consolidación de plataformas de hosting en capa gratuita, de bases de datos gestionadas y de servicios de correo transaccional —como los usados en este proyecto— cambió esa ecuación: un equipo de cinco estudiantes puede hoy desplegar una arquitectura de tres capas con certificado SSL vigente sin presupuesto de infraestructura. Ese cambio, más que cualquier avance puntual en algoritmos, es el que hace viable un proyecto de este tipo dentro de un semestre académico. La lección para la práctica profesional no es solo técnica: la accesibilidad de la infraestructura moderna redefine qué cuenta como un proyecto razonable para un equipo pequeño, y un ingeniero de sistemas actual necesita conocer el ecosistema de servicios gestionados tanto como el lenguaje de programación que utiliza.

---

## IV. METODOLOGÍA EMPLEADA

El proyecto se desarrolló bajo un enfoque híbrido: Scrum como marco de trabajo para la planificación y ejecución técnica, combinado con prácticas de gestión de proyectos de tradición PMI/PMBOK —línea base y control de cambios formal— para el seguimiento del avance frente a lo planificado. Esta combinación no fue una decisión de manual: respondió a una necesidad concreta. Scrum por sí solo no exige una línea base fija ni un proceso documentado de gestión de cambios, y el equipo necesitaba ambas cosas para distinguir, al cierre de cada sprint, entre un desvío real y una variación esperable del proceso ágil (sección VII).

El trabajo se organizó en cuatro sprints de dos semanas: configuración e infraestructura, desarrollo de los módulos núcleo, incorporación de alertas y control de acceso, y cierre con reportes y validación. Cada sprint siguió la misma secuencia operativa: análisis de las historias de usuario ya priorizadas en el Product Backlog, verificación contra los prototipos de interfaz elaborados en Figma, implementación de la solución y pruebas unitarias sobre los endpoints desarrollados.

La implementación de cada módulo es incremental, no generada de una sola vez: cada historia de usuario del Product Backlog se codifica, se prueba y se integra por separado, siguiendo el orden de prioridad ya definido en el PA01. OpenAI Codex funciona como asistente de programación durante esta etapa, apoyando la escritura de código dentro de cada módulo bajo la dirección técnica del integrante responsable; las decisiones de arquitectura, el modelado de datos y la validación de cada entrega siguen siendo responsabilidad del equipo, no del asistente. Durante el desarrollo, las tres capas descritas en la sección VI.3 se ejecutan en el entorno local de cada integrante, sin depender de un proveedor de hosting en la nube; esa dependencia se incorpora recién en la etapa de despliegue final (hito H-08, sección VII.2).

**Aportes y descubrimientos**

El equipo identificó dos hallazgos que modificaron decisiones tomadas en la planificación inicial.

El primero surgió durante el desarrollo del motor de alertas predictivo. El cálculo de la tasa de consumo de 30 días, tal como se planificó en el PA01, asume un historial de movimientos que un negocio recién digitalizado no tiene. Un bodeguero que instala el sistema el primer día parte de cero registros, y un promedio calculado sobre cero observaciones no es un promedio: es un error de división. El equipo resolvió esto con una lógica de degradación progresiva —alertas basadas únicamente en el stock mínimo mientras el historial es insuficiente, cálculo predictivo activado a partir de siete días de datos— documentada formalmente como cambio de Tipo B en el Sistema de Gestión de Cambios (sección VII.3).

El segundo hallazgo fue más operativo que técnico. La configuración de variables de entorno se comportó de manera distinta entre las máquinas de desarrollo de los integrantes, lo que generó una demora de cuatro horas durante el primer sprint por diferencias en el archivo de entorno local de cada equipo. El equipo documentó la causa como aprendizaje institucional para los sprints posteriores, evitando que el mismo problema volviera a consumir tiempo no planificado.

---

## V. USO DE HERRAMIENTAS MODERNAS

**Tabla 1.** Herramientas empleadas en el desarrollo del proyecto

| Herramienta | Uso en el proyecto |
| --- | --- |
| Figma | Diseño de los ocho prototipos de interfaz (login, dashboard, productos, movimientos, proveedores, alertas, usuarios, reportes), aplicando principios de UX antes de iniciar la codificación. Estos prototipos sirven como referencia directa para la implementación de las interfaces con apoyo de Codex. |
| Trello | Tablero Kanban de cinco columnas (Backlog, En desarrollo, En revisión, Completado, Bloqueado) para el seguimiento de tareas por sprint y el registro de tarjetas del Sistema de Gestión de Cambios. |
| GitHub | Control de versiones del repositorio `inventario-bodegas-web` con ramas `main`, `develop` y `feature/nombre-tarea`; registro de avances mediante el historial de commits de cada módulo; e integración del trabajo de los cinco integrantes mediante revisión de código antes de fusionar con `develop`. |
| VS Code | Entorno de desarrollo principal para la codificación del frontend y el backend. |
| OpenAI Codex | Asistente principal de programación durante la implementación. Apoya la escritura de código módulo por módulo, siguiendo el orden del Product Backlog, bajo la dirección técnica del equipo; no reemplaza las decisiones de arquitectura, modelado de datos ni la validación de cada entrega. |
| Vue 3 + Vite | Framework y herramienta de construcción del frontend, con Vue Router para el enrutamiento, Pinia para la gestión de estado y Axios como cliente HTTP para el consumo de la API REST. |
| Django REST Framework | Framework de backend en Python, organizado en aplicaciones independientes (`core`, `users`, `products`, `inventory`, `suppliers`, `alerts`, `reports`). |
| SQLite | Motor de base de datos utilizado durante el desarrollo, por su integración nativa con Django y su configuración mínima; no requiere instalar un servidor de base de datos independiente. |
| PostgreSQL | Motor de base de datos previsto para el entorno de producción; la migración desde SQLite no exige cambios en el modelo de datos (sección VI.2), ya que ambos motores comparten el mismo conjunto de migraciones de Django. |
| Render | Plataforma de despliegue en capa gratuita prevista para la etapa final del proyecto (hito H-08), con certificado SSL gestionado automáticamente. |
| SendGrid | Servicio SMTP para el envío de alertas de stock mínimo por correo electrónico, en su plan gratuito. |

> **🖼️ [ESPACIO PARA CAPTURAS DE PANTALLA]:** el punto V de la consigna pide evidencia visual de cada herramienta en uso. Se sugiere incluir, como mínimo: el tablero Trello con tarjetas activas de un sprint, el historial de commits del repositorio en GitHub, el proyecto abierto en VS Code, una sesión de trabajo con Codex, y el panel de control de Render mostrando el servicio desplegado (esta última, una vez alcanzada la etapa de despliegue final).

---

## VI. DISEÑO DE INGENIERÍA

### 6.1 Listado de requerimientos funcionales

**Tabla 2.** Requerimientos funcionales

| ID | Necesidad | Usuario | Finalidad |
| --- | --- | --- | --- |
| RF-01 | Registrar productos con nombre, categoría, unidad de medida, precio de compra y precio de venta | Administrador | Mantener un catálogo estructurado para operaciones de inventario precisas |
| RF-02 | Registrar entradas de mercadería indicando proveedor, cantidad, fecha y costo unitario | Administrador / Vendedor | Actualizar el stock disponible tras cada reposición |
| RF-03 | Registrar salidas de productos por venta o consumo interno | Vendedor | Reflejar en tiempo real la reducción de existencias |
| RF-04 | Configurar niveles mínimos de stock por producto | Administrador | Activar alertas antes de una rotura de stock |
| RF-05 | Generar alertas visuales y por correo cuando un producto alcance su nivel mínimo | Sistema | Anticipar decisiones de reposición |
| RF-06 | Consultar reportes de movimiento por rango de fechas | Administrador | Analizar tendencias de consumo |
| RF-07 | Gestionar proveedores con datos de contacto y condiciones de pago | Administrador | Facilitar las órdenes de reposición |
| RF-08 | Gestionar usuarios con roles de administrador y vendedor | Administrador | Controlar el acceso según responsabilidades |
| RF-09 | Generar reporte de valorización de inventario actual | Administrador | Conocer el valor monetario del stock disponible |
| RF-10 | Acceder al sistema desde dispositivos móviles mediante interfaz responsiva | Administrador / Vendedor | Gestionar el inventario sin depender de un equipo fijo |

Cada requerimiento tiene una pantalla asociada, prototipada en Figma antes de su implementación: login (RF-08), dashboard, productos (RF-01), movimientos (RF-02, RF-03), proveedores (RF-07), alertas (RF-04, RF-05) y reportes (RF-06, RF-09). El diseño responsivo (RF-10) se resuelve con una grilla CSS de 12 columnas que colapsa a formulario en columna única por debajo de 768 px.

> **🖼️ [ESPACIO PARA CAPTURAS DE PANTALLA]:** reemplazar o complementar las referencias a Figma con capturas reales del sistema en funcionamiento, una por cada pantalla implementada, una vez desplegada la versión de Sprint 4.

### 6.2 Diseño de base de datos

El esquema relacional se diseñó para soportar los procesos CRUD de cada módulo y cumple con la Tercera Forma Normal. Ocho tablas componen el modelo: **Categoría**, **Proveedor**, **Producto**, **Rol**, **Usuario**, **Movimiento_Inventario**, **Alerta** y **Configuración_Sistema**. La decisión de diseño más significativa fue separar Categoría de Producto: si el nombre de la categoría viviera dentro de la tabla de productos, corregirlo exigiría modificar múltiples filas, violando la independencia funcional que persigue la normalización. Por la razón expuesta en la sección II, la tabla Movimiento_Inventario no admite operación de actualización ni eliminación; los errores se corrigen mediante un nuevo movimiento de ajuste que preserva la trazabilidad del historial. Las ocho tablas se implementan primero sobre SQLite durante el desarrollo y se migran a PostgreSQL en producción sin modificar ninguna de ellas, dado que ambos motores ejecutan el mismo conjunto de migraciones definidas en el ORM de Django.

> **🖼️ [ESPACIO PARA GRÁFICO]:** insertar aquí el diagrama entidad-relación (DER) y el diagrama de clases del sistema, ambos ya elaborados como Figura 1 y Figura 2 en el PA02.

### 6.3 Arquitectura de la solución

El sistema adopta una arquitectura de tres capas. La capa de presentación se construye con Vue 3 y Vite, consume la API REST mediante Axios y gestiona el estado de la aplicación con Pinia y el enrutamiento con Vue Router. La capa de lógica de negocio, en Django REST Framework, gestiona la autenticación JWT, el procesamiento de alertas y la generación de reportes. La capa de datos implementa las entidades descritas en 6.2 sobre SQLite durante el desarrollo, aprovechando su integración nativa con el ORM de Django y la ausencia de un servidor de base de datos independiente que instalar en cada máquina del equipo; el mismo esquema migra a PostgreSQL en el entorno de producción sin modificaciones, ya que Django abstrae el motor subyacente detrás de un mismo conjunto de migraciones. El envío de alertas por correo se resuelve mediante el servicio SMTP de SendGrid, como componente externo desacoplado del núcleo del sistema.

Durante el desarrollo, las tres capas se ejecutan en el entorno local de cada integrante: el servidor de desarrollo de Django (`runserver`) para el backend y el servidor de Vite para el frontend, ambos apuntando a la base de datos SQLite local. El backend se desarrolla íntegramente en Python, con Django y Django REST Framework cubriendo tanto la lógica de negocio como la capa de administración de datos, sin depender de un servidor de aplicaciones ni de herramientas de gestión de base de datos de otro ecosistema de lenguaje. El despliegue en un proveedor de hosting en la nube (Render) corresponde a la etapa final del proyecto, descrita como hito H-08 en la sección VII.2.

> **🖼️ [ESPACIO PARA GRÁFICO]:** insertar el diagrama de arquitectura de tres capas (frontend – backend – base de datos – servicio externo), ya disponible en el PA01, en versión gráfica pulida.

**Alcance del producto mínimo viable (PMV).** Un producto mínimo viable es la versión de un sistema que entrega valor funcional verificable al usuario objetivo con el menor esfuerzo de desarrollo posible [7]. Para este proyecto, el PMV no es el sistema completo planificado en el PA01: es el conjunto de módulos que permite a un propietario de bodega reemplazar el cuaderno de apuntes por un registro digital y tomar decisiones de reposición basadas en datos. La Tabla 3 resume qué queda dentro y fuera de ese alcance.

**Tabla 3.** Alcance funcional del PMV

| Módulo | Estado al cierre del Sprint 3 |
| --- | --- |
| Autenticación (login, JWT) | Completado |
| Productos (CRUD completo) | Completado |
| Movimientos (entradas y salidas) | Completado |
| Alertas (modo básico y modo avanzado) | Completado |
| Usuarios y roles | Completado |
| Proveedores (CRUD) | Completado |
| Dashboard resumen | Completado |
| Interfaz responsiva | En desarrollo (Sprint 3/4) |
| Reportes (movimientos y valorización) | Planificado para Sprint 4 — fuera del PMV inicial, no bloqueante para el uso básico |
| Cálculo predictivo completo (histórico &gt; 7 días) | Progresivo — se activa conforme el bodeguero acumula registros |

---

## VII. GESTIÓN DEL PROYECTO

El diseño del proyecto combinó tres criterios de decisión: técnicos (arquitectura de tres capas descrita en VI.3, elegida por su capacidad de mantenimiento independiente por módulo), económicos (costo total estimado de S/ 3 000 para 150 horas de desarrollo, calculado a una tarifa referencial de S/ 20 por hora, y S/ 0 en servicios externos gracias al uso de planes gratuitos) y operativos (Scrum en sprints de dos semanas, descrito en la sección IV).

### 7.1 Roles y responsabilidades

| Integrante | Rol principal |
| --- | --- |
| Integrante 1 | Líder de proyecto / Backend — coordina el avance y desarrolla los endpoints de mayor complejidad (movimientos, usuarios, motor de alertas) |
| Integrante 2 | Backend — base de datos, autenticación JWT, endpoints de productos y proveedores, cálculo predictivo |
| Integrante 3 | Frontend — configuración de Vue 3, rutas, interfaces de productos y movimientos |
| Integrante 4 | Frontend / UX-UI — prototipos en Figma, interfaces de reportes, alertas y usuarios |
| Integrante 5 | QA / DevOps — pruebas unitarias, administración del repositorio y del entorno de despliegue |

### 7.2 Hitos y línea base

La línea base del proyecto quedó fijada al cierre del Sprint 1, una vez configurado el entorno de desarrollo local y completado el primer hito verificable [8]. Toda desviación posterior se mide contra ese punto de partida, siguiendo la lógica de control que distingue un plan de referencia de su ejecución real [9].

**Tabla 4.** Línea base de cronograma (Gantt de referencia)

| Sprint | Semanas | Hitos planificados |
| --- | --- | --- |
| Sprint 1 | 1 – 2 | H-01 Repositorio creado · H-02 Entorno local operativo con login funcional |
| Sprint 2 | 3 – 4 | H-03 CRUD de productos y movimientos funcional |
| Sprint 3 | 5 – 6 | H-04 Motor de alertas activo · H-05 Control de acceso por roles operativo |
| Sprint 4 | 7 – 8 | H-06 Módulo de reportes completo · H-07 MVP validado con usuario real · H-08 Sistema en producción con HTTPS |

**Tabla 5.** Ejecución frente a la línea base (al cierre del Sprint 3)

| Sprint | Horas planificadas | Horas ejecutadas | Hitos completados | Desviación |
| --- | --- | --- | --- | --- |
| Sprint 1 | 28 h | 32 h | H-01, H-02 | +4 h por incidente de configuración del entorno local entre las máquinas del equipo; sin impacto en la fecha del hito |
| Sprint 2 | 40 h | 40 h | H-03 | 0 h |
| Sprint 3 | 38 h | 38 h | H-04, H-05 | 0 h |
| Sprint 4 | 44 h | — | H-06, H-07, H-08 | Pendiente |

> **📋 INSTRUCCIONES PARA COMPLETAR ESTA SECCIÓN:** una vez cerrado el Sprint 4, actualizar la fila correspondiente con las horas realmente ejecutadas y la fecha real de cierre de H-06, H-07 y H-08. Con esos datos, construir el diagrama de Gantt ejecutado (por ejemplo, en Trello Power-Up de Gantt, Excel o GanttPro) y colocarlo junto a la Tabla 4 a modo de comparación visual.

### 7.3 Sistema de Gestión de Cambios

El Sistema de Gestión de Cambios establece el proceso formal para identificar, evaluar, aprobar e implementar modificaciones al alcance, cronograma, arquitectura o funcionalidades del sistema durante el desarrollo [10]. Opera en cuatro etapas: identificación de la solicitud en una tarjeta Trello, evaluación de impacto por el líder de proyecto y el integrante responsable del módulo afectado, decisión —que requiere consenso de al menos tres integrantes cuando el cambio supera las 8 horas o afecta un hito ya completado— e implementación con cierre verificado por QA.

**Tabla 6.** Clasificación de cambios

| Tipo | Descripción | Aprobación requerida |
| --- | --- | --- |
| A — Correctivo | Corrección de defecto en funcionalidad completada | Líder de proyecto |
| B — Adaptativo | Ajuste por nueva restricción técnica o de usuario | Líder + módulo responsable |
| C — Evolutivo | Funcionalidad nueva no planificada en el PA01 | Consenso de 3 integrantes |
| D — Emergencia | Falla crítica en producción | Líder, sin espera |

El único cambio aplicado y verificado hasta la fecha corresponde al ajuste del motor de alertas descrito en la sección IV (Tipo B, Sprint 3, +3 horas al Integrante 2, sin impacto en hitos), documentado con evidencia funcional: el sistema genera alertas visuales para todo producto en stock mínimo independientemente del historial disponible, y añade el campo de días estimados hasta agotamiento únicamente cuando existen al menos 7 días de movimientos registrados.

### 7.4 Control del avance

**Tabla 7.** Estado del Product Backlog al cierre del Sprint 3 (Semana 6)

| Estado | Puntos de historia | Porcentaje |
| --- | --- | --- |
| Completados | 37 SP | 59 % |
| En desarrollo | 21 SP | 33 % |
| Pendientes | 10 SP | 16 % |
| **Total** | **63 SP** | **100 %** |

El proyecto se mantiene alineado con la planificación del PA02: al cierre de la Semana 6 se esperaba tener completados los hitos H-01 a H-05, y así ocurrió, sin desviaciones de fecha. El único desvío de esfuerzo registrado —las 4 horas adicionales del Sprint 1— fue absorbido por el equipo sin reprogramar tareas.

---

## VIII. PRUEBAS Y RESULTADOS

Las pruebas se planificaron en dos etapas, alineadas con las características de calidad de funcionalidad, fiabilidad y usabilidad que un sistema de este tipo debe cumplir frente a un usuario sin formación técnica [11].

**Etapa 1 — Pruebas funcionales internas (Semana 7).** El responsable de QA ejecuta pruebas unitarias sobre los endpoints de productos, movimientos, alertas y usuarios; pruebas de integración sobre los flujos completos desde la interfaz Vue 3; pruebas de rendimiento con 10 solicitudes consecutivas a los endpoints más usados; y pruebas de responsividad en tres resoluciones (375 px, 768 px, 1280 px).

**Etapa 2 — Prueba de aceptación con usuario real (Semana 8, hito H-07).** Un propietario o empleado de bodega del entorno cercano al equipo recibe un usuario de rol administrador y una única instrucción: "Registre un nuevo producto, ingrese una compra de ese producto y luego anote una venta." Sin explicación adicional de la interfaz, el líder de proyecto registra el tiempo total y los puntos donde el usuario se detiene o manifiesta dudas. Al finalizar, el usuario responde tres preguntas cerradas sobre si pudo completar la tarea sin ayuda, si encontró el sistema fácil de entender, y si lo usaría en su negocio.

**Tabla 8.** Criterios de aceptación del PMV

| N.° | Criterio | Umbral | Resultado obtenido |
| --- | --- | --- | --- |
| CA-01 | Registrar un producto, una entrada y una salida en una sola sesión sin asistencia técnica | ≤ 10 minutos en la primera sesión | *(completar tras la prueba)* |
| CA-02 | El stock se actualiza correctamente tras cada movimiento | 0 discrepancias en 20 transacciones de prueba | *(completar tras la prueba)* |
| CA-03 | Las alertas visuales se generan para todos los productos en stock crítico | 100 % de alertas generadas | *(completar tras la prueba)* |
| CA-04 | El usuario con rol vendedor no accede a módulos de administración | Acceso restringido en el 100 % de los casos | *(completar tras la prueba)* |
| CA-05 | El sistema responde en menos de 3 segundos en red de 5 Mbps o superior | ≤ 3 segundos por solicitud | *(completar tras la prueba)* |
| CA-06 | El sistema es accesible desde un dispositivo móvil | Todos los módulos accesibles sin scroll horizontal | *(completar tras la prueba)* |

> **📋 INSTRUCCIONES PARA COMPLETAR ESTA SECCIÓN:** esta tabla y el plan que la precede describen lo que hay que ejecutar, no un resultado ya obtenido. Al ejecutar la Etapa 1 y la Etapa 2:
> 1. Registrar el número de casos de prueba ejecutados, aprobados y fallidos por cada tipo de prueba (unitarias, integración, rendimiento, responsividad).
> 2. Completar la columna "Resultado obtenido" de la Tabla 8 con el dato real medido para cada criterio (tiempo en minutos, número de discrepancias, porcentaje, etc.), no con una estimación.
> 3. Si algún criterio no se cumple, documentarlo igual que un hallazgo del Sistema de Gestión de Cambios (sección VII.3), en lugar de omitirlo.
> 4. Adjuntar como evidencia las capturas de pantalla de la ejecución de pruebas (consola de pruebas unitarias, resultados de Postman o similar) y las respuestas del usuario real a las tres preguntas cerradas.

---

## IX. LECCIONES APRENDIDAS

**1. Un sistema predictivo necesita una estrategia explícita para cuando no hay datos.** El motor de alertas se diseñó asumiendo historial disponible; la realidad de un usuario nuevo demostró lo contrario. La lección no es "probar más antes de programar" —eso ya se hizo—, sino diseñar explícitamente el caso de cero datos desde el primer boceto de cualquier funcionalidad que dependa de historial, en lugar de tratarlo como una excepción a corregir después.

**2. La configuración de entorno es tan parte del sistema como el código.** La demora de 4 horas por diferencias en la configuración del entorno de desarrollo local entre las máquinas del equipo no fue un error de programación: fue un vacío de documentación. Un archivo de variables de entorno de ejemplo, versionado desde el primer commit, habría evitado el problema.

**3. Separar la línea base del avance ágil ayuda a distinguir un desvío real de una variación normal.** Sin una línea base fija, el equipo no habría podido afirmar con certeza que los 5 primeros hitos se cumplieron sin desviación de fecha; la comparación habría quedado a criterio subjetivo de cada integrante.

**4. Diseñar para las tres operaciones más frecuentes del usuario, antes que para la lista completa de requerimientos, ordenó las prioridades del equipo.** Identificar que registrar una entrada, registrar una salida y consultar stock eran las acciones centrales del bodeguero —antes de dibujar cualquier pantalla— evitó construir interfaces visualmente coherentes pero con flujos poco intuitivos para el usuario real.

---

## X. CONCLUSIONES

Respecto al primer objetivo específico, el módulo de movimientos actualiza el stock en tiempo real aplicando el balance descrito en la sección II, y las pruebas de integración internas no reportaron discrepancias sobre los casos verificados hasta el cierre del Sprint 3; la confirmación completa con 20 transacciones controladas corresponde a la Etapa 1 de pruebas del Sprint 4.

Respecto al segundo objetivo específico, el motor de alertas queda implementado con dos modos de operación —básico y predictivo— que resuelven el problema del arranque en frío identificado durante el desarrollo. La verificación del porcentaje de productos en stock crítico que efectivamente generan alerta (CA-03) es, igual que el punto anterior, una tarea de la Etapa 1 de pruebas.

Respecto al tercer objetivo específico, la validación con un usuario real del segmento objetivo no se ha ejecutado a la fecha de este informe: es, por diseño del proyecto, la actividad central del hito H-07 en el Sprint 4. No es posible, en consecuencia, concluir sobre la usabilidad del sistema con evidencia empírica todavía; sí es posible afirmar que el protocolo de prueba (sección VIII) está definido y listo para ejecutarse.

En conjunto, el proyecto demuestra que un equipo estudiantil puede aplicar simultáneamente principios de ingeniería de software, gestión ágil de proyectos y análisis de contexto socioeconómico sobre un mismo problema real, sin que ninguna de esas dimensiones se resuelva a costa de las otras. La brecha entre lo planificado y lo ejecutado, medida de forma explícita a través de la línea base, se mantuvo en cero días durante los tres primeros sprints; queda por verificar si esa disciplina se sostiene en el sprint de cierre.

---

## REFERENCIAS BIBLIOGRÁFICAS

**[1]** INSTITUTO NACIONAL DE ESTADÍSTICA E INFORMÁTICA. *Perú: Características Económicas y Financieras de las Empresas Comerciales, 2019: Resultados de la Encuesta Económica Anual 2020* [en línea]. Lima: INEI, 2020 [consulta: 2026-07-07]. Disponible en: https://www.inei.gob.pe/media/MenuRecursivo/publicaciones_digitales/Est/Lib1874/libro.pdf

**[2]** VASQUEZ-LAYZA, Leidy Nora; CERNA RIOS, Nelly Bresminda y ESCURRA-LAGOS, Jean Carlos. *Implementación de estrategias de control de inventarios y gestión de almacenes para reducir costos operacionales en una empresa ferretera peruana* [en línea]. 4th LACCEI International Multiconference on Entrepreneurship, Innovation and Regional Development – LEIRD 2024, 2024 [consulta: 2026-07-07]. Disponible en: https://dx.doi.org/10.18687/LEIRD2024.1.1.420

**[3]** ZAPATA CORTÉS, Julián Andrés. *Fundamentos de la gestión de inventarios*. Medellín: Centro Editorial Esumer, 2014. ISBN 978-958-8599-82-5.

**[4]** GEANKOPLIS, Christie John; HERSEL, Allen H. y LEPEK, Daniel H. *Transport Processes and Separation Process Principles*. 5ª ed. [en línea]. Pearson, 2018 [consulta: 2026-07-07]. Disponible en: https://www.informit.com/articles/article.aspx?p=2916277&seqNum=6

**[5]** ACELERA PYME. *Revolución paperless: haz un uso racional del papel gracias a la digitalización* [en línea]. Gobierno de España, 2023 [consulta: 2026-07-07]. Disponible en: https://www.acelerapyme.gob.es/novedades/pildora/revolucion-paperless-haz-un-uso-racional-del-papel-gracias-la-digitalizacion

**[6]** MINISTERIO DE ECONOMÍA Y FINANZAS DEL PERÚ. *Política Nacional de Competitividad y Productividad*. Decreto Supremo N.° 345-2018-EF [en línea]. Lima: MEF, 2018 [consulta: 2026-05-20]. Disponible en: https://www.gob.pe/institucion/mef/normas-legales/234701-345-2018-ef

**[7]** ESERP BUSINESS & LAW SCHOOL. *Producto mínimo viable (MVP)* [en línea]. 2019 [consulta: 2026-06-10]. Disponible en: https://es.eserp.com/articulos/producto-minimo-viable/

**[8]** STSEPANETS, A. *Qué es un hito y cuáles son los ejemplos de hitos de un proyecto* [en línea]. GanttPRO Blog, 2021 [consulta: 2026-06-01]. Disponible en: https://blog.ganttpro.com/es/que-es-un-hito-y-que-ejemplos-de-hitos-hay/

**[9]** RECURSOS EN PROJECT MANAGEMENT. *Línea base de un proyecto: ¿qué es la línea base de un proyecto?* [en línea]. 2019 [consulta: 2026-06-10]. Disponible en: https://www.recursosenprojectmanagement.com/linea-base-del-cronograma/

**[10]** TEAM ASANA. *¿Qué es un proceso de control de cambios y cómo se implementa?* [en línea]. Asana, 2021 [consulta: 2026-06-10]. Disponible en: https://asana.com/es/resources/change-control-process

**[11]** ISO/IEC 25010:2011. *Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models* [en línea]. Ginebra: ISO, 2011 [consulta: 2026-06-01]. Disponible en: https://www.iso.org/standard/35733.html

---

## ANEXOS

**Anexo A. Video demostrativo del producto**

> **📋 INSTRUCCIONES PARA COMPLETAR:**
> 1. Grabar un video de máximo 8 minutos con el sistema en funcionamiento real (no el prototipo de Figma). Guion sugerido, alineado con el protocolo de la Etapa 2 de pruebas (sección VIII): inicio de sesión → registro de un producto nuevo → registro de una entrada de mercadería → registro de una salida → stock actualizado en el dashboard → una alerta generada por stock mínimo → vista del reporte de valorización.
> 2. Subir el video a YouTube (modo "no listado" es suficiente) o a Google Drive con acceso por enlace.
> 3. Colocar aquí el enlace y generar el código QR correspondiente con cualquier herramienta gratuita, insertando la imagen resultante.

**Anexo B. Enlaces del proyecto**

| Recurso | Enlace |
| --- | --- |
| Repositorio GitHub | https://github.com/Nils7255/inventario-bodegas-web |
| Prototipo Figma | https://www.figma.com/make/aUXE1Hu2zrSFnOsJbYAy6j/Sistema-de-Control-de-Inventario |
| Tablero Trello | *(enlace del tablero, ya usado en el PA03)* |

**Anexo C. Evidencia de trabajo en equipo**

> **🖼️ [ESPACIO PARA CAPTURAS]:** capturas del tablero Trello mostrando tarjetas asignadas a distintos integrantes y del grafo de contribuciones de GitHub.
