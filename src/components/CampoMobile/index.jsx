import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import playersData from '../../data/jogadores.json'


Modal.setAppElement('#root');

import './CampoMobile.css';
import { recuperarDados, salvarDados } from '../../utils/storage';

const defaultData = [
  { id: 1, nome: '1', posX: 175, posY: 525, foto: '' },
  { id: 2, nome: '6', posX: 50, posY: 375, foto: '' },
  { id: 3, nome: '3', posX: 125, posY: 450, foto: '' },
  { id: 4, nome: '4', posX: 250, posY: 450, foto: '' },
  { id: 5, nome: '2', posX: 300, posY: 375, foto: '' },
  { id: 6, nome: '5', posX: 175, posY: 325, foto: '' },
  { id: 7, nome: '8', posX: 50, posY: 225, foto: '' },
  { id: 8, nome: '10', posX: 300, posY: 225, foto: '' },
  { id: 9, nome: '7', posX: 50, posY: 100, foto: '' },
  { id: 10, nome: '9', posX: 175, posY: 125, foto: '' },
  { id: 11, nome: '11', posX: 300, posY: 100, foto: '' },
]

const CampoMobile = () => {
  const [jogadores, setJogadores] = useState([...defaultData]);

  const [todosJogadores] = useState([...playersData.jogadores])
  const [jogadorSubstituir, setJogadorSubstituir] = useState(0)


  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let dadossalvos = recuperarDados("escalando-corinthians-app")
    if (dadossalvos) {
      setJogadores([...dadossalvos])
    }
  }, [])

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
      const offsetY = event.clientX - event.currentTarget.offsetLeft - 25; // Metade da largura do jogador
      const offsetX = event.clientY - event.currentTarget.offsetTop - 25; // Metade da altura do jogador
      // Garantir que o jogador não ultrapasse as bordas do campo
      const posY = Math.min(Math.max(offsetX, 0), 614 - 50); // 1228 - largura do jogador
      const posX = Math.min(Math.max(offsetY, 0), 406 - 50); // 812 - altura do jogador

      novoJogadores[jogadorIndex].posX = posX;
      novoJogadores[jogadorIndex].posY = posY;

      setJogadores(novoJogadores);

      if (novoJogadores.length > 0) {
        salvarDados("escalando-corinthians-app", novoJogadores)
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };


  const handleTouchStart = (event, id) => {
    event.preventDefault();
    const jogadorIndex = jogadores.findIndex((jogador) => jogador.id === id);

    if (jogadorIndex !== -1) {
      const novoJogadores = [...jogadores];
      const touch = event.touches[0];

      novoJogadores[jogadorIndex].dragging = true;
      novoJogadores[jogadorIndex].offsetX = touch.clientX - novoJogadores[jogadorIndex].posX;
      novoJogadores[jogadorIndex].offsetY = touch.clientY - novoJogadores[jogadorIndex].posY;

      setJogadores(novoJogadores);
    }
  };

  const handleTouchMove = (event, id) => {
    event.preventDefault();
    const jogadorIndex = jogadores.findIndex((jogador) => jogador.id === id);

    if (jogadorIndex !== -1 && jogadores[jogadorIndex].dragging) {
      const novoJogadores = [...jogadores];
      const touch = event.touches[0];
      const posX = touch.clientX - novoJogadores[jogadorIndex].offsetX;
      const posY = touch.clientY - novoJogadores[jogadorIndex].offsetY;

      novoJogadores[jogadorIndex].posX = Math.min(Math.max(posX, 0), 1228 - 100);
      novoJogadores[jogadorIndex].posY = Math.min(Math.max(posY, 0), 812 - 100);

      setJogadores(novoJogadores);
    }
  };


  const handleTouchEnd = (id) => {
    const jogadorIndex = jogadores.findIndex((jogador) => jogador.id === id);

    if (jogadorIndex !== -1) {
      const novoJogadores = [...jogadores];
      novoJogadores[jogadorIndex].dragging = false;

      setJogadores(novoJogadores);
    }
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
    if (jogadoresAux.length > 0) {
      salvarDados("escalando-corinthians-app", jogadoresAux)
    }
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
      color: "#FFF",
      fontSize: '10px'
    }}>
      <div
        className="campo-de-futebol-mobile"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        id='campo-de-futebol-mobile'
      >
        {jogadores.map((jogador) => (


          jogador.foto !== '' ?
            <div
              key={jogador.id}
              className="jogador-preenchido-mobile"
              style={{ top: `${jogador.posY}px`, left: `${jogador.posX}px` }}
              draggable
              onDragStart={(e) => handleDragStart(e, jogador.id)}
              onTouchStart={(e) => handleTouchStart(e, jogador.id)}
              onTouchMove={(e) => handleTouchMove(e, jogador.id)}
              onTouchEnd={() => handleTouchEnd(jogador.id)}
              onClick={() => exibirModal(jogador.id)}
            >
              <img src={jogador.foto} className='foto-jogador-campo-mobile' />
              <p className='nome-jogador-campo-mobile'>{jogador.nome.indexOf(" ") != -1 ?
                jogador.nome.split(" ")[0].substring(0, 1).concat(". ").concat(jogador.nome.split(" ")[1])
                : jogador.nome}</p>

            </div>
            : <div
              key={jogador.id}
              className="jogador-vazio-mobile"
              style={{ top: `${jogador.posY}px`, left: `${jogador.posX}px` }}
              draggable
              onDragStart={(e) => handleDragStart(e, jogador.id)}
              onTouchStart={(e) => handleTouchStart(e, jogador.id)}
              onTouchMove={(e) => handleTouchMove(e, jogador.id)}
              onTouchEnd={() => handleTouchEnd(jogador.id)}
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
              width: '250px',
              height: '400px'
            }
          }}
        >
          <h2>Escolha um jogador</h2>
          {todosJogadores.map((jogador, index) => (

            <div
              key={index}
              className="jogador-lista-mobile"
              onClick={() => alterarDadosJogador(jogador.nome, jogador.foto)}
            >
              <img src={jogador.foto} className='foto-jogador-lista-mobile' />
              {jogador.nome}
            </div>
          ))}
        </Modal>
      </div>
    </div>
  );
};

export default CampoMobile;
