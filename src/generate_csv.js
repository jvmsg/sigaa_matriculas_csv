function isDisciplina(linha) {
    return linha.hasClassName('disciplina');
}

function getDisciplina(linha) {
    const [codigo, nome] = linha.children[1].children[0].textContent.replace(/\n|\t|\*/g,'').split('-');
	return { codigo: codigo.trim(), nome: nome.trim() };
}

function isDisciplinaPermitida(linha) {
    return linha.children[0].children[0].title === 'É permitida a matrícula nesse componente'
}

function getTipo(linha) {
    return linha.children[1].children[1].textContent.replace(/\n|\t/g,'');
}

function isTurma(linha) {
    return linha.className.includes('turmas');
}

function getTurma(linha) {
    return linha.children[3].children[0].textContent.replace(/\n|\t/g,'');
}

function getDocente(linha) {
    return linha.children[4].children[0].textContent.replace(/\n|\t/g,'');
}

function getHorario(linha) {
    return linha.children[5].children[0].textContent.replace(/\n|\t/g,'');
}

function isTurmaReservada(linha) {
    return linha.children[0].childElementCount === 2;
}

let [tabela] = document.getElementsByTagName('tbody');
let linhas = tabela.children;

let lastDisciplina;
let lastDisciplinaPermitida;
let materias = {};

Array.from(linhas).forEach(linha => {
    let tipo;
    if (isDisciplina(linha)) {
        lastDisciplina = getDisciplina(linha);
        lastDisciplinaPermitida = isDisciplinaPermitida(linha);
        tipo = getTipo(linha);
    }

    if (!lastDisciplina || !lastDisciplinaPermitida) return;

    if (!materias.hasOwnProperty(lastDisciplina.codigo)) {
        materias[lastDisciplina.codigo] = {
			...lastDisciplina,
            tipo,
            turmas: []
        }
    }

    materia = materias[lastDisciplina.codigo];

    if (isTurma(linha)) {
        materia.turmas.push({
            turma: getTurma(linha),
            docente: getDocente(linha),
            horario: getHorario(linha),
			reservada: isTurmaReservada(linha)
        })
    }
})

let materiasCSV = "Código;Nome;Tipo;Turma;Reservada;Docente;Horário\n"
for (const materia of Object.values(materias)) {
    for (const turma of materia.turmas) {
            materiasCSV += `${materia.codigo};${materia.nome};${materia.tipo};${turma.turma};${turma.reservada};${turma.docente};${turma.horario}\n`
    }
}