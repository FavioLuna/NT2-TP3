new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.hayUnaPartidaEnJuego = true;
            this.saludJugador = 100;
            this.saludMonstruo = 100;
        },
        atacar: function () {
            var daño = this.calcularHeridas(this.rangoAtaque[0], this.rangoAtaque[1]);
            this.saludMonstruo -=daño;
            this.turnos.unshift({
                esJugador: true,
                text: 'El jugador atacó al monstruo por ' + daño + ' de daño'
            })
            if (this.verificarGanador()) {
                return;
            }
            this.ataqueDelMonstruo();
        },

        ataqueEspecial: function () {
            var daño = this.calcularHeridas(this.rangoAtaqueEspecial[0], this.rangoAtaqueEspecial[1]);
            this.saludMonstruo -= daño;
            this.turnos.unshift({
                esJugador: true,
                text: 'El jugador usó un ataque especial por ' + daño + ' de daño'
            })
            if (this.verificarGanador()) {
                return;
            }
            this.ataqueDelMonstruo();
        },

        curar: function () {
            if (this.saludJugador <= 90) {
                this.saludJugador += 10;
            } else{
                this.saludJugador = 100;
            }
            this.turnos.unshift({
                esJugador: true,
                text: 'El jugador regeneró +10 de salud'  
            })
            this.ataqueDelMonstruo();
        },

        registrarEvento(evento) {
        },
        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false;
            this.turnos = [];
        },

        ataqueDelMonstruo: function () {
            var daño = this.calcularHeridas(this.rangoAtaqueDelMonstruo[0], this.rangoAtaqueDelMonstruo[1]);            
            this.saludJugador -= daño;
            this.turnos.unshift({
                esJugador: false,
                text: 'El monstruo atacó con ' + daño + ' de daño'
            })
            this.verificarGanador();
        },

        calcularHeridas: function (min, max) {
            return Math.max(Math.floor(Math.random() * max) + 1, min)
      
        },

        verificarGanador: function () {
            if (this.saludMonstruo <= 0) {
                if (confirm('Ganaste! Jugar de nuevo?')) {
                    this.empezarPartida();
                }else{
                    this.hayUnaPartidaEnJuego = false;
                }
                this.turnos = [];
                return true;
            } else if(this.saludJugador <= 0){
                if (confirm('Perdiste! Jugar de nuevo?')) {
                    this.empezarPartida();
                } else {
                    this.hayUnaPartidaEnJuego = false;
                }
                this.turnos = [];
                return true;
            }
            return false;
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});