import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-Jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;
    /* const jogadorEncontrado = this.jogadores.find(
      (jogador) => jogador.email === email,
    );*/
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();
    if (jogadorEncontrado) {
      this.atualizar(criarJogadorDto);
    } else {
      this.criar(criarJogadorDto);
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    //return await this.jogadores;
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {
    /*const jogadorEncontrado = this.jogadores.find(
      (jogador) => jogador.email === email,
    );*/
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();
    if (!jogadorEncontrado) {
      throw new NotFoundException(
        `Jogador com o e-mail ${email} não encontrado`,
      );
    }
    return jogadorEncontrado;
  }

  async deletarJogador(email: string) {
    /* const jogadorEncontrado = this.jogadores.find(
      (jogador) => jogador.email === email,
    );
    if (!jogadorEncontrado) {
      throw new NotFoundException(
        `Jogador com o e-mail ${email} não encontrado`,
      );
    }
    this.jogadores = this.jogadores.filter(
      (jogador) => jogador.email !== jogadorEncontrado.email,
    );*/
    return await this.jogadorModel.remove({ email }).exec();
  }

  private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const jogadorCriado = new this.jogadorModel(criarJogadorDto);

    return await jogadorCriado.save();
    /*const { nome, telefoneCelular, email } = criarJogadorDto;
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
    this.jogadores.push(jogador);*/
  }

  private async atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    return await this.jogadorModel
      .findOneAndUpdate(
        {
          email: criarJogadorDto.email,
        },
        { $set: criarJogadorDto },
      )
      .exec();
    /*
    const { nome } = criarJogadorDto;
    jogadorEncontrado.nome = nome;
    */
  }
}
