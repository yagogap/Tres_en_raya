
/**********************************************************
Constructor del Objeto Servidor: Se supone que es un objeto 
que no existirá en la versión final ya que todos los métodos
de los que dispone se implementarán en el servidor y desde el
cliente se le solicitará el servicio via ¿¿ REST ??
***********************************************************/
  function Servidor(){
    } 
  Servidor.prototype.Hay_Tres_En_Raya = function(){
    //Determina si tras un movimiento de un jugador se da tres en raya
    //Lo hace comprobando si la suma de las posiciones en las que están 
    // sus fichas suma la cifra mágica pero solo si hay tres puestas

    var valor_jug = (La_Partida.juega_jug_1)? Jugador_1.valor : Jugador_2.valor;
    var suma = 0, puestas = 0;
    var cuantas_piezas = La_Partida.tablero.length; 
    for (i=0;i < cuantas_piezas; i++)
      if (La_Partida.tablero[i] == valor_jug){
        puestas++;
        suma = suma + La_Conf.cuadrado_magico[i]; 
        }       
    return suma == La_Conf.cifra_magica && puestas == La_Conf.n_max_bolas/2; 
    } // del método Hay_Tres_En_Raya

  Servidor.prototype.Es_Posicion_Valida =  function(posicion,tablero) {
    //Comrueba si la posición destino es válida sobre el tablero
    //lo es si la posición es un hueco
    //console.log (tablero[posicion]+'**'+La_Conf.valorhueco);
    return tablero[posicion] == La_Conf.valorhueco;    
    } //de la función EsPosicionValida
  
/**********************************************************
Constructor del Objeto Configuración: No pertenece al modelo 
de datos. Se utiliza para manetener los valores de las 
propiedades que se corresponden con variables de configuración
***********************************************************/
  
  function Configuracion(){
    this.ruta = "./imgs/";
    this.hueco = this.ruta + 'hueco.jpg';
    this.valorhueco = 0;
    this.n_max_bolas = 6;    
    //las cifras del cuadrado mágico están preestablecidas
    this.cuadrado_magico =new Array (4,9,2,3,5,7,8,1,6);
    //la cifra se establece por el uso del cuadrado mágico
    this.cifra_magica = 15;       
    }

/**********************************************************
Constructor del Objeto Partida: Contiene todas las propiedades 
y métodos que son propios de la partida
***********************************************************/
    
  function Partida(){
    this.tablero = new Array (9);
    //Número de fichas siendo posicionadas
    this.cuantas_hay = 0;
    //determina si el jugador que juega es el primero
    this.juega_jug_1 = true;
    //determina si hay que cambiar de jugador
    this.hay_que_cambiar = false;
    //determina si el reloj de juegos está activo
    this.Esta_Activo_Reloj = false;
    //identificador del proceso del reloj para poder pararlo
    this.pid_reloj = 0;    
    }
    
  Partida.prototype.inicializa_tablero = function (){
    var num_celdas = this.tablero.length;
    //Inicialización del tablero entero con huecos
    for (i=0; i< num_celdas; i++)
       this.tablero[i] = La_Conf.valorhueco;
    } // de inicializa_tablero      
  
  Partida.prototype.DeclaraDraggable = function (jugador){
     //Este método declara draggables solamente las fichas del jugador que se le pasa
     var cuantas_celdas = this.tablero.length; 
     for (var i=0;i < cuantas_celdas; i++)
        if (this.tablero[i] == jugador.valor ){
           document.getElementById('i'+i).draggable = true;
           document.getElementById('i'+i).className = 'mov';
           }  // del if es el valor del primer jugador 
        else{   
           document.getElementById('i'+i).draggable = false;
           document.getElementById('i'+i).className = 'no_mov';
           }  // del if es el valor del primer jugador 
     } // del método DeclaraDraggable
     
  Partida.prototype.Situa = function (cual){
      //Esta función se ejecuta si hay menos de 6 fichas en el tablero
      //se determina el jugador que mueve
      var jugador = (this.juega_jug_1)? Jugador_1 : Jugador_2;
      //se determina la posición en el tablero
      pos = parseInt(cual.substr(1,2));
      if (El_Servidor.Es_Posicion_Valida(pos, this.tablero)){
        //si es una posición válida se actualiza el tablero y la pantalla      
        this.tablero[pos] = jugador.valor;      
        document.getElementById(cual).src = jugador.bola;
        // hay una bola más en el tablero
        this.cuantas_hay++;
        //juega el otro jugador
        this.hay_que_cambiar = true;
        //Se declaran como draggables las fichas del primer jugador
        //solo en el caso de que se hayan situado todas las fichas
        if (this.cuantas_hay == La_Conf.n_max_bolas)
           this.DeclaraDraggable(Jugador_1);
        }  //del if es válida
      } // del método Situa()
               
  Partida.prototype.juega = function(cual){     
      //La función llama a Situa() si hay menos de 6 fichas
      // o a Mueve() si hay 6 y toca moverlas
      pos = parseInt(cual.substr(1,2));
      //no se cambia de jugador hasta que haya un movimiento válido
      this.hay_que_cambiar = false;
      //si hay menos de seis, se situa una nueva
      if (this.cuantas_hay < La_Conf.n_max_bolas)
         this.Situa(cual);    
      if (El_Servidor.Hay_Tres_En_Raya()){
         //si hay tres en raya se termina la partida
         this.Acaba('exito');
         this.Esta_Activo_Reloj = false;
         return;
         }// hay tres en raya 
      if (this.hay_que_cambiar)
         this.juega_jug_1 = !this.juega_jug_1;                       				 
    } // del método juega

  Partida.prototype.pinta_tablero =  function (){
    var cadena = '';
    var num_piezas = this.tablero.length;
    for (var elid=0; elid < num_piezas; elid++){
      cadena += "<div id='d"+elid+"' class='celda' onclick=La_Partida.juega('i" + elid + "')"
      cadena += " ondragover='La_Partida.PermiteDrop(event)' ondrop='La_Partida.Drop(event)' >";      
      cadena += "<img name='i"+elid+"' id='i"+elid+"' class='pieza' ";
      cadena += " ondragstart='La_Partida.Drag(event)'";
      cadena += " src='"+La_Conf.hueco+"'>";
      cadena += "</div>";
      } //de for todas las posiciones 
    document.getElementById('areajuego').innerHTML=cadena;
  } // de pinta_tablero    

  Partida.prototype.Drag = function(evento) {
    evento.target.style.opacity = 0.8;
    evento.dataTransfer.setData('text', evento.target.id);
    }

 Partida.prototype.PermiteDrop = function(evento) {  
    evento.preventDefault();
    evento.stopPropagation();      
    }

 Partida.prototype.Drop = function(evento) {
    evento.stopPropagation(); 
    evento.preventDefault();
    //se determina el jugador al que le va a tocar jugar
    var jugador = (La_Partida.juega_jug_1)? Jugador_1 : Jugador_2;
    var img_origen = evento.dataTransfer.getData("text");
    var pos_origen = img_origen.substr(1,2);
    var capa_origen = 'd' + pos_origen;
    var capa_destino = evento.currentTarget;
    var pos_destino = capa_destino.id.substr(1,2);
    var img_destino =  'i'+pos_destino;
    //no se cambia de jugador hasta que haya un movimiento válido
    this.hay_que_cambiar = false;    
    //Si la posición de destino es válida se cambian los src
    if (El_Servidor.Es_Posicion_Valida(pos_destino, this.tablero)){   
       //Se actualiza la imagen
       document.getElementById(img_destino).src = document.getElementById(img_origen).src;
       document.getElementById(img_origen).src = La_Conf.hueco;
       //Se actualiza el tablero en memoria
       this.tablero[pos_destino] = jugador.valor;
       this.tablero[pos_origen] = La_Conf.valorhueco;
       this.hay_que_cambiar = true;            
       } // if si el destino es válido
    document.getElementById(img_origen).style.opacity = 1;
    if (El_Servidor.Hay_Tres_En_Raya()){
       //si hay tres en raya se termina la partida
       this.Acaba('exito');
       return;
       }// hay tres en raya     
    if (this.hay_que_cambiar){
       this.juega_jug_1 = !this.juega_jug_1; 
       jugador = (this.juega_jug_1)? Jugador_1 : Jugador_2;       
       this.DeclaraDraggable(jugador);
       } // de si hay que cambiar de jugador       
    } //del método Drop           

  Partida.prototype.Acaba = function (situacion){
    //El método Acaba() recibe la condición de terminación y muestra el mensaje
    //determinando cuál es el jugador que ha ganado si corresponde
    function Tapa_Tablero(textofinal){
      //Sitúa la capa que cubre el juego al acabar el tiempo o el juego
      //para que el jugador no pueda acceder a las fichas
      document.getElementById('capa_tapa').innerHTML = textofinal;
      document.getElementById('capa_tapa').style.display='block';            
      }  // de la función Tapa_Tablero()
    var nombre_jug = (this.juega_jug_1)? Jugador_1.nombre : Jugador_2.nombre;       
    switch (situacion){
      case 'exito': var textofinal="¡¡Has ganado!! :-)<br />"+nombre_jug;
                    break;
      case 'tiempo':var textofinal="Se ha terminado el tiempo :-(";
                    break;
      default:      var textofinal="Se ha terminado el juego :-0";
                    break;                    
      } //del switch
    //Si está activo el reloj, se desactiva  
    if (this.Esta_Activo_Reloj){  
       clearInterval(this.pid_reloj);
       this.Esta_Activo_Reloj = false;       
       //document.getElementById('n_tiempo').value = 0;
       } // si está activo el reloj
    Tapa_Tablero(textofinal);              
		} // del método Acaba

  Partida.prototype.Reloj =  function (){
     //Controla el reloj del juego restando un segundo al valor del campo
	   document.getElementById('n_tiempo').value = document.getElementById('n_tiempo').value -1;
     //si el tiempo ha llegado a cero hay que terminar la partida
		 if (document.getElementById('n_tiempo').value == 0)
		    this.Acaba('tiempo');
		 }	 // del método Reloj;    

/**********************************************************
Constructor del Objeto Jugador: Contiene aquellas propiedades
y métodos que son propios de cada uno de los jugadores (nombre,
ficha con la que juegan, valor que se representa en el tablero,
 etc)
***********************************************************/
     
  function Jugador(jug, valor, bola, bola_pulsada){
    var n_jug = document.getElementById(jug).value;  
    this.nombre = n_jug;
    this.valor = valor;
    this.bola = bola;  
    this.bola_pulsada = bola_pulsada; 
    }  

	function jugar(){
    //la función jugar es la principal y crea la partida y los dos jugadores  
    La_Partida = new Partida();   
    Jugador_1 = new Jugador('jug1',1,La_Conf.ruta+'bola1.jpg',La_Conf.ruta+'bola1_pulsada.jpg');
    Jugador_2 = new Jugador('jug2',2,La_Conf.ruta+'bola2.jpg',La_Conf.ruta+'bola2_pulsada.jpg');   
    //se inicializa la partida y se dibuja el tablero vacío
    La_Partida.inicializa_tablero();
    La_Partida.pinta_tablero();
    //se oculta la capa que impide acceder a las posiciones             
    document.getElementById('capa_tapa').style.display='none';  
    //Si el usuario ha escrito tiempo límite, se activa el reloj  
    if (parseInt(document.getElementById('n_tiempo').value) > 0){
   		La_Partida.pid_reloj = setInterval("La_Partida.Reloj()",1000);
      La_Partida.Esta_Activo_Reloj = true;
	    }    //de si ha puesto tiempo
    } // de la función jugar
    
    /****************************************************************
    ****************************************************************/
    //El objeto que hace referencia a la configuración se hace global
    //para tener acceso desde cualquier punto a él sin necesidad de ser
    //pasado como parámetro. Ninguno de sus valores debe cambiar.
    //No pertenece al modelo de datos y eson valores exclusivos de 
    //configuración
    var La_Conf = new Configuracion();
    //El objeto servidor se declara como global ya que en la versión
    //final no existe al ser una llamada al servidor
    var El_Servidor = new Servidor();

