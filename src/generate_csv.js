function isDisciplina(linha) {
    return linha.hasClassName("disciplina");
  }
  
  function getDisciplina(linha) {
    const [codigo, nome] = linha.children[1].children[0].textContent
      .replace(/\n|\t|\*/g, "")
      .split("-");
    return { codigo: codigo.trim(), nome: nome.trim() };
  }
  
  function isDisciplinaPermitida(linha) {
    return (
      linha.children[0].children[0].title ===
      "É permitida a matrícula nesse componente"
    );
  }
  
  function getTipo(linha) {
    return linha.children[1].children[1].textContent.replace(/\n|\t/g, "");
  }
  
  function isTurma(linha) {
    return linha.className.includes("turmas");
  }
  
  function getTurma(linha) {
    return linha.children[3].children[0].textContent.replace(/\n|\t/g, "");
  }
  
  function getDocente(linha) {
    return linha.children[4].children[0].textContent.replace(/\n|\t/g, "");
  }
  
  function getHorarios(linha) {
    const regex = /(\d{1,6})(M|T|N)(\d{1,5})/g;
    const horariosStr = linha.children[5].children[0].textContent.match(regex);
    const horarios = {};
    const setDiaHorario = new Set();
    
    horariosStr.forEach((horarioStr) => {
      const [dias, periodo, horario] = horarioStr
        .replace(regex, "$1:$2:$3")
        .split(":");
        
        for (const dia of dias.split("")) {
          if (!horarios.hasOwnProperty(dia)) {
            horarios[dia] = [];
          }
          
          const key = `${dia}${periodo}${horario}`;
          if (!setDiaHorario.has(key)) {
              setDiaHorario.add(key);
              horarios[dia].push({ periodo, horario });
          }
      }
    });
    return horarios;
  }
  
  function isTurmaReservada(linha) {
    return linha.children[0].childElementCount === 2;
  }
  
  let [tabela] = document.getElementsByTagName("tbody");
  let linhas = tabela.children;
  
  let lastDisciplina;
  let lastDisciplinaPermitida;
  let materias = {};
  
  Array.from(linhas).forEach((linha) => {
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
        turmas: [],
      };
    }
  
    materia = materias[lastDisciplina.codigo];
  
    if (isTurma(linha)) {
      materia.turmas.push({
        turma: getTurma(linha),
        docente: getDocente(linha),
        horarios: getHorarios(linha),
        reservada: isTurmaReservada(linha),
      });
    }
  });
  
  let materiasCSV =
    "Código;Nome;Tipo;Turma;Reservada;Docente;Segunda;Terca;Quarta;Quinta;Sexta;Sabado\n";
  for (const materia of Object.values(materias)) {
    for (const turma of materia.turmas) {
      materiasCSV += `${materia.codigo};${materia.nome};${materia.tipo};${turma.turma};${turma.reservada};${turma.docente}`;
  
      for (let i = 2; i < 8; i++) {
        let horarioCSV = ";";
        if (turma.horarios.hasOwnProperty(i)) {
          horarioCSV += turma.horarios[i]
            .map(({ periodo, horario }) => periodo + horario)
            .join(",");
        }
        materiasCSV += horarioCSV;
      }
  
      materiasCSV += "\n";
    }
  }
  