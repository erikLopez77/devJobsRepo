document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');
    if (skills) {
        skills.addEventListener('click', agregarSkills);

        //una vez que estamos en editar, llamar la función
        skillsSeleccionados();
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