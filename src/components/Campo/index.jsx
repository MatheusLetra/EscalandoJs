import { useState } from 'react';
import Modal from 'react-modal';
import playersData from '../../data/jogadores.json'

Modal.setAppElement('#root');

import './Campo.css';

const Campo = () => {
  const [jogadores, setJogadores] = useState([
    { id: 1, nome: '1', posX: 50, posY: 350, foto: '' },
    { id: 2, nome: '6', posX: 350, posY: 100, foto: '' },
    { id: 3, nome: '3', posX: 250, posY: 250, foto: '' },
    { id: 4, nome: '4', posX: 250, posY: 450, foto: '' },
    { id: 5, nome: '2', posX: 350, posY: 600, foto: '' },
    { id: 6, nome: '5', posX: 450, posY: 350, foto: '' },
    { id: 7, nome: '8', posX: 650, posY: 200, foto: '' },
    { id: 8, nome: '10', posX: 650, posY: 500, foto: '' },
    { id: 9, nome: '7', posX: 850, posY: 100, foto: '' },
    { id: 10, nome: '9', posX: 950, posY: 350, foto: '' },
    { id: 11, nome: '11', posX: 850, posY: 600, foto: '' },
  ]);

  const [todosJogadores] = useState([...playersData.jogadores])
  const [jogadorSubstituir, setJogadorSubstituir] = useState(0)


  const [modalIsOpen, setIsOpen] = useState(false);

  function fecharModal() {
    setIsOpen(false);
  }

  const handleDragStart = (event, id) => {
    event.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const jogadorId = event.dataTransfer.getData('text/plain');
    const jogadorIndex = jogadores.findIndex((jogador) => jogador.id === parseInt(jogadorId, 10));

    if (jogadorIndex !== -1) {
      const novoJogadores = [...jogadores];
      // Ajuste para garantir que a posição seja relativa ao campo e leve em consideração o tamanho do jogador
      const offsetX = event.clientX - event.currentTarget.offsetLeft - 50; // Metade da largura do jogador
      const offsetY = event.clientY - event.currentTarget.offsetTop - 50; // Metade da altura do jogador
      // Garantir que o jogador não ultrapasse as bordas do campo
      const posX = Math.min(Math.max(offsetX, 0), 1228 - 100); // 1228 - largura do jogador
      const posY = Math.min(Math.max(offsetY, 0), 812 - 100); // 812 - altura do jogador

      novoJogadores[jogadorIndex].posX = posX;
      novoJogadores[jogadorIndex].posY = posY;

      setJogadores(novoJogadores);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const exibirModal = (id_jogador) => {
    setJogadorSubstituir(id_jogador)
    setIsOpen(true)
  }


  const alterarDadosJogador = (nome, foto) => {
    let jogadoresAux = []

    jogadores.forEach((jogadorAux) => {
      if (jogadorAux.id === jogadorSubstituir) {
        jogadoresAux = [...jogadoresAux, { id: jogadorAux.id, nome: nome, posX: jogadorAux.posX, posY: jogadorAux.posY, foto: foto }]
      } else {
        jogadoresAux = [...jogadoresAux, jogadorAux]
      }
    })

    setJogadores([...jogadoresAux])
    setIsOpen(false)
  }

  return (
    <div style={{
      display: "flex",
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      flexDirection: 'column',
      backgroundColor: '#000',
      width: '100vw',
      height: '100vh',
      color: "#FFF"
    }}>
      <h1>ESCALE SEU CORINTHIANS</h1>
      <div
        className="campo-de-futebol"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        id='campo-de-futebol'
      >
        {jogadores.map((jogador) => (


          jogador.foto !== '' ?
            <div
              key={jogador.id}
              className="jogador-preenchido"
              style={{ top: `${jogador.posY}px`, left: `${jogador.posX}px` }}
              draggable
              onDragStart={(e) => handleDragStart(e, jogador.id)}
              onClick={() => exibirModal(jogador.id)}
            >
              <img src={jogador.foto} className='foto-jogador-campo' />
              <p className='nome-jogador-campo'>{jogador.nome}</p>

            </div>
            : <div
              key={jogador.id}
              className="jogador-vazio"
              style={{ top: `${jogador.posY}px`, left: `${jogador.posX}px` }}
              draggable
              onDragStart={(e) => handleDragStart(e, jogador.id)}
              onClick={() => exibirModal(jogador.id)}
            >

              {jogador.nome}
            </div>


        ))}

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={fecharModal}
          contentLabel="Escolha o jogador"
          style={{
            marginRight: '-50%',
            overlay: {
              backgroundColor: 'rgba(0, 0 ,0, 0.8)'
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              width: '500px',
              height: '600px'
            }
          }}
        >
          <h2>Escolha um jogador</h2>
          {todosJogadores.map((jogador, index) => (

            <div
              key={index}
              className="jogador-lista"
              onClick={() => alterarDadosJogador(jogador.nome, jogador.foto)}
            >
              <img src={jogador.foto} className='foto-jogador-lista' />
              {jogador.nome}
            </div>
          ))}
        </Modal>
      </div>
    </div>
  );
};

export default Campo;
