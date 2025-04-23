const axios = require('axios');
const Swal = require('sweetalert2');

document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');
    //limpiar alertas
    let alertas = document.querySelector('.alertas');
    if (alertas) {
        limpiarAlertas();
    }
    if (skills) {
        skills.addEventListener('click', agregarSkills);

        //una vez que estamos en editar, llamar la función
        skillsSeleccionados();
    }

    const vacantesListado = document.querySelector('.panel-administracion');

    if (vacantesListado) {
        vacantesListado.addEventListener('click', accionesListado);
    }
})

const skills = new Set();
const agregarSkills = e => {
    //target identifica al elemento que desencadeno el evento
    if (e.target.tagName === 'LI') {
        if (e.target.classList.contains('activo')) {
            //quitarlo del set y quitar la clase
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo');
        } else {
            //agregarlo al set y agregar la clase
            skills.add(e.target.textContent);
            e.target.classList.add('activo');
        }
    }
    const skillsArray = [...skills]//skills se convierte a un array
    document.querySelector('#skills').value = skillsArray;
}

const skillsSeleccionados = () => {
    const seleccionados = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));

    seleccionados.forEach(seleccionado => {
        skills.add(seleccionado.textContent)
    })

    const skillsArray = [...skills]//conversion del set a un array 
    document.querySelector('#skills').value = skillsArray;//inyectamos en el hidden
}
const limpiarAlertas = () => {
    let alertas = document.querySelector('.alertas');
    const interval = setInterval(() => {
        if (alertas.children.length > 0) {
            alertas.removeChild(alertas.children[0]);
        } else if (alertas.children.length === 0) {
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    }, 2000);

}

//Eliminar vacantes
const accionesListado = e => {
    console.log('+++1');
    e.preventDefault();
    if (e.target.dataset.eliminar) {
        //eliminar por axios
        const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;
        console.log('+++');
        return;
        Swal.fire({
            title: '¿Confirmar eliminación?',
            text: 'Una vex eliminado, no se puede recuperar',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.value) {
                //enviar la peticion con axios
                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;

                //axios p/ eliminar el registro
                axios.delete(url, { params: { url } })
                    .then(function (respuesta) {
                        if (respuesta.status === 200) {
                            Swal.fire('Eliminado', respuesta.data, 'success');
                        }
                        //todo eliminar del dom
                    })
            }
        })

    } else {
        window.location.href = e.target.href;
    }
}