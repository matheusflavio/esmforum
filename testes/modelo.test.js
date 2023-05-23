const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando criação de duas perguntas e uma resposta', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('1 + 2 = ?');

  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(2);

  const pergunta_id = modelo.listar_perguntas()[0].id_pergunta;
  const pergunta_gerada = modelo.get_pergunta(pergunta_id);
  expect(pergunta_gerada.texto).toBe('1 + 1 = ?');
  
  modelo.cadastrar_resposta(pergunta_gerada.id_pergunta, '2');

  const resposta = modelo.get_respostas(pergunta_id);
  expect(resposta[0].id_pergunta).toBe(pergunta_id);
  const resposta_obtida = modelo.get_respostas(pergunta_id)[0].texto
  expect(resposta_obtida).toBe(resposta[0].texto);
  expect(resposta[0].texto).toBe('2');

})