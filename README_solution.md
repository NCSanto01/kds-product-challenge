# Solución del Challenge

## Decisiones Técnicas

Se ha completado el challenge tomando una serie de decisiones técnicas fundamentadas que han permitido obtener una solución funcional y optimizada al concepto MVP que se buscaba. Estas decisiones se explican a continuación:

- Por encima de todo, se prioriza la funcionalidad de cara al objetivo final, es decir, que la herramienta ayude a la tienda a entregar la mayor cantidad de órdenes posibles correctamente.

- El diseño estético no es importante en este punto. Se puede mantener el diseño original y hacer los cambios necesarios para adaptar las nuevas funcionalidades.

- El contenido de las órdenes no tiene relevancia y puede ser ignorado.

- No es necesario hacer que la Web sea responsive. Se debe poder visualizar bien en pantallas de ordenador, pero de momento no es necesario que se adapte a dispositivos más pequeños.

- Es necesaria una estructura Full-Stack, añadiendo un Backend desde cero que gestione toda la lógica de la herramienta. El Frontend pasa a ser solamente un visualizador y editor de los datos mantenidos en el Backend. Esto es crucial de cara a la escalabilidad, mantenibilidad, y funcionalidad de la herramienta.

- Para facilitar el testeo, se puede limitar el número de órdenes Pendientes concurrentes a 10.

- No es necesario implementar ningún tipo de base de datos por ahora. No es importante para este challenge, ya que al final las órdenes vienen de una fuente externa, y lo que prima es la gestión de la información que llega en Real-Time. Los pocos datos persistentes pueden estar harcodeados en el Backend para este MVP.

- Se debe implementar una serie de nuevas funcionalidades que he considerado importantes de cara a optimizar el flujo de trabajo del personal de la tienda. Estas se describen en la solución.


## Descripción de la Solución

- Se ha creado una estructura full-stack, creando un Backend desde cero y moviendo toda la lógica de negocio y la lógica de la tienda al Backend. Por ello, el Orchestrator original que simulaba la recepción de pedidos ya no se usa. Los pedidos y los Riders se simulan en el Backend y el Frontend los lee. El Frontend es solamente un visualizador y editor de los datos mantenidos en el Backend. Esto permite tener varias pestañas abiertas con diferentes instancias del Frontend, y se puede comprobar que toda la información se mantiene sincronizada entre ellas.

- Se ha desarrollado toda la funcionalidad básica del challenge, de cambiar las órdenes de estado y de entregarlas a los Riders. Clickando en una orden, esta pasa a la siguiente columna lógica. También se puede arrastrar la orden a otra columna manualmente. Esto permite también mover las órdenes hacia columnas anteriores.

- Se ha añadido la columna "Entregados", que muestra el historial de las órdenes que han sido entregadas a los Riders. Esta columna no es visible por defecto y puede activarse con un botón para que se muestre en el Kanban. Las órdenes de la columna "Entregados" ya no pueden salir de ahí.

- Se ha añadido la columna "Cancelados". Al arrastrar una orden a esta columna, se queda en un estado de "Cancelada". El Rider asignado para esta orden desaparece. Esta columna tampoco es visible por defecto y puede activarse con un botón para que se muestre en el Kanban. Las órdenes de la columna "Cancelados" ya no pueden salir de ahí.

- Se han añadido diferentes USUARIOS. Se tiene el usuario ADMIN que representa al encargado de la tienda, y luego están los usuarios de los empleados que preparan los pedidos (JAVI, NICO, DANI). Se puede cambiar de usuario con un selector en la esquina superior derecha.

- Usuario ADMIN: 
    - Puede ver TODAS las órdenes en todo momento
    - Puede asignar las Pendientes a los diferentes empleados arrastrando la orden a la columna del empleado deseado dentro de la columna "En Preparación".
    - Puede desasignar una órden volviéndola a arrastrar a la columna "Pendientes".
    - Puede mover con libertad las órdenes entre las diferentes columnas y cancelar las órdenes, incluso cuando no están asignadas a ningún empleado.
    - Puede ver la OCUPACIÓN de cada empleado en tiempo real (cuántas órdenes tiene cada empleado en Preparación, divido por un número de órdenes máximas).
    - Si pulsa en una Orden en estado Pendiente en vez de arrastrarla a un empleado, el sistema asigna automáticamente la orden al empleado con menor ocupación.

- Usuario Empleado (JAVI, NICO, DANI):
    - Puede ver TODAS las órdenes Pendientes (porque no han sido asignadas aún).
    - Puede arrastrar o pinchar en una orden Pendiente para ponerla en Preparación y asignársela a sí mismo.
    - En el resto de columnas, solo puede ver las órdenes que le han sido asignadas.
    - En las columnas de "Cancelados" y "Entregados", solo puede ver sus órdenes asignadas canceladas o entregadas.
    - Puede mover con libertad las órdenes que le han sido asignadas entre las diferentes columnas y cancelar las órdenes.


- Pistas visuales:
    - Se muestra el nombre del empleado asignado a cada orden en la tarjeta de la orden.
    - Se muestra la ocupación de cada empleado para el usuario ADMIN en la parte superior del Kanban.
    - Se muestra el número de órdenes en cada columna en la parte superior de cada columna.
    - Se muestra la hora de recepción de cada orden en la tarjeta de la orden.
    - Se muestran las órdenes con diferentes colores en función del tiempo que lleven esperando. Una orden que lleva más de 1 minuto sin entregarse se muestra en amarillo. Una orden que lleva más de 3 minutos se muestra en rojo. Estos colores vienen acompañados de unos iconos.
    - Los Repartidores cuyo pedido ya está Listo para recgoer se muestran en Verde. El resto se muestra del color por defecto (naranja).


Con esta serie de funcionalidades, la herramienta está enfocada a que cada empleado abra una instancia con su usuario y que pueda ir seleccionando las órdenes en las que quiere trabajar, sin tener que ver las órdenes de los demás empleados. Por otro lado, el ADMIN puede ver todas las órdenes y asignarlas manualmente, monitorizando el rendimiento y la ocupación del equipo. Las pistas visuales aportan un poco más de información para optimizar el trabajo de ambos roles. 


## Posibles mejoras

- Se podría implementar una funcionalidad para que el propio repartidor pueda marcar la orden como "Entregada". Me parece bastante probable que desde la app del repartidor pueda marcar la orden como que ya la ha recogido, y eso se podría conectar con nuestro sistema para ahorrar un paso más al personal de la tienda.

- Se podría implementar un nuevo enfoque totalmente alternativo que no se centre en las órdenes como tal, sino en el contenido de las órdenes. Es decir, se podría desglosar cada orden en sus productos y agruparlos con los productos de otras órdenes, para que los empleados puedan preparar todos los productos de un mismo tipo, en vez de preparar cada orden individualmente. Esto es más complejo de implementar y se ha considerado que queda fuera del challenge, pero seguramente sería más óptimo en negocios de restauración, por ejemplo.

- Se debería corregir algún fallo de estilo que hace que las tarjetas a veces se vean cortadas, y hacer todo más "responsive".

- Evidentemente faltan muchas funcionalidades importantes (Base de datos, autenticación de usuarios, rediseño estético total, configuración del sistema,etc.)


## Instrucciones de ejecución

- Backend: Desde la carpeta "backend", ejecutar primero "npm install" y después ejecutar "npm run start:dev" para iniciar el servidor.
- Frontend: Desde la carpeta "frontend", ejecutar primero "npm install" y después ejecutar "npm run dev" para iniciar el frontend.
- Se recomienda abrir varias instancias del frontend en diferentes pestañas para comprobar el funcionamiento de los diferentes usuarios en tiempo real. 


