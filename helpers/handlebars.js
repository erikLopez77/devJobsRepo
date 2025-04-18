module.exports = {
    //seleccionadas y en caso de no haber, se usan los corchetes (vacio)
    seleccionarSkills: (seleccionadas = [], opciones) => {
        const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress'];
        let html = '';

        skills.forEach(skill => {
            html += `
                <li ${seleccionadas.includes(skill) ? 'class="activo"' : ''}>${skill}</li>
            `;
        });
        //opciones.fn()(renderiza el bloque interno) se le crea una propiedad html y se le asigna lo que tenemos en let html
        return opciones.fn().html = html;
    },
    tipoContrato: (seleccionado, opciones) => {
        return opciones.fn(this).replace(
            //si value == seleccionado entonces selected=selected
            new RegExp(`value="${seleccionado}"`), '$& selected="selected"'
        )
    },
    mostrarAlertas: (errores = {}, alertas) => {
        const categoria = Object.keys(errores);
        let html = '';
        if (categoria.length) {
            errores[categoria].forEach(error => {
                html += `<div class="${categoria} alerta">${error}
                </div>`;
            })
        }
        return alertas.fn().html = html;
    }
}