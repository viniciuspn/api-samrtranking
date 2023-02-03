import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-Jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AtualizaJogadorDto } from './dtos/atualiza-Jogador.dto';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(JogadoresService.name);

  async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criarJogadorDto;
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();
    if (jogadorEncontrado) {
      throw new BadRequestException(
        `Jogador com o e-mail ${email} já cadastrado`,
      );
    }
    const jogadorCriado = new this.jogadorModel(criarJogadorDto);
    return await jogadorCriado.save();
  }

  async atualizarJogador(
    _id: string,
    atualizarJogadorDto: AtualizaJogadorDto,
  ): Promise<void> {
    const jogadorEncontrado = await this.obterJogadorPorId(_id);
    if (!jogadorEncontrado) {
      throw new BadRequestException(`Jogador com o id ${_id} não encontrado`);
    }
    await this.jogadorModel
      .findOneAndUpdate(
        {
          _id: _id,
        },
        { $set: atualizarJogadorDto },
      )
      .exec();
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();
    if (!jogadorEncontrado) {
      throw new NotFoundException(
        `Jogador com o e-mail ${email} não encontrado`,
      );
    }
    return jogadorEncontrado;
  }

  async consultarJogadoresPeloId(_id: string): Promise<Jogador> {
    const jogadorEncontrado = await this.obterJogadorPorId(_id);
    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com o id  ${_id} não encontrado`);
    }
    return jogadorEncontrado;
  }
  async deletarJogador(_id: string) {
    const jogadorEncontrado = await this.obterJogadorPorId(_id);
    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com o id  ${_id} não encontrado`);
    }

    return await this.jogadorModel.remove({ _id }).exec();
  }

  private async obterJogadorPorId(_id: string): Promise<Jogador> {
    const valid = mongoose.Types.ObjectId.isValid(_id);
    if (!valid) {
      throw new NotFoundException(`Jogador com o id  ${_id} invalido!`);
    }
    return await this.jogadorModel.findOne({ _id }).exec();
  }
}
