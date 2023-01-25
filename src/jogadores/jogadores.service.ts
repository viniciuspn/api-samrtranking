import { Injectable, Logger } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-Jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];
  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    await this.criar(criarJogadorDto);
  }

  private criar(criarJogadorDto: CriarJogadorDto): void {
    const { nome, telefoneCelular, email } = criarJogadorDto;

    const jogador: Jogador = {
      _id: uuidv4(),
      nome: nome,
      email: email,
      telefoneCelular: telefoneCelular,
      ranking: 'A',
      posicaoRanking: 2,
      urlFotoJogador: '',
    };
    this.logger.log(`criarJogadorDto: ${JSON.stringify(jogador)}`);
    this.jogadores.push(jogador);
  }
}
