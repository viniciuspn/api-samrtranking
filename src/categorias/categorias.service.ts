import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriaCategoriaDto } from './dtos/cria-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
  ) {}
  async criarCategoria(criaCategoriaDto: CriaCategoriaDto): Promise<Categoria> {
    const { categoria } = criaCategoriaDto;

    const categoriaEncontrada = await this.categoriaModel
      .findOne({
        categoria,
      })
      .exec();

    if (categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${categoria} já cadastrada`);
    }
    const categoriaCriado = new this.categoriaModel(criaCategoriaDto);
    return await categoriaCriado.save();
  }

  async consultarCategorias(): Promise<Array<Categoria>> {
    return await this.categoriaModel.find().populate('jogadores').exec();
  }

  async consultarCategoriaPeloId(_id: string): Promise<Categoria> {
    const categoriaEncontrada = await this.obterCategoriaPorId(_id);
    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria com o id  ${_id} não encontrada!`);
    }
    return categoriaEncontrada;
  }
  async consultarCategoriasPelaCategoria(
    categoria: string,
  ): Promise<Categoria> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();
    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria  ${categoria} não encontrada!`);
    }
    return categoriaEncontrada;
  }

  async atulizarCategoria(
    _id: string,
    atualizarCategoriaDto: AtualizarCategoriaDto,
  ): Promise<void> {
    const categoriaEncontrada = await this.obterCategoriaPorId(_id);
    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria com o id  ${_id} não encontrada!`);
    }
    await this.categoriaModel
      .findOneAndUpdate(
        {
          _id: _id,
        },
        { $set: atualizarCategoriaDto },
      )
      .exec();
  }

  async atribuirCategoriaJogador(params: string[]): Promise<void> {
    const _id = params['_id'];
    const idJogador = params['idJogador'];

    const categoriaEncontrada = await this.obterCategoriaPorId(_id);
    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria com o id  ${_id} não encontrada!`);
    }

    await this.jogadoresService.consultarJogadoresPeloId(idJogador);
    const jogadorJaCadastro = await this.categoriaModel
      .find({ _id })
      .where('jogadores')
      .in(idJogador)
      .exec();
    if (jogadorJaCadastro) {
      throw new NotFoundException(
        `Jogador com o id ${idJogador} já vinculado a categoria ${categoriaEncontrada.categoria}!`,
      );
    }
    categoriaEncontrada.jogadores.push(idJogador);
    await this.categoriaModel
      .findOneAndUpdate(
        {
          _id: _id,
        },
        { $set: categoriaEncontrada },
      )
      .exec();
  }

  async consultarCategoriaDoJogador(idJogador: any): Promise<Categoria> {
    /*
    Desafio
    Escopo da exceção realocado para o próprio Categorias Service
    Verificar se o jogador informado já se encontra cadastrado
    */

    //await this.jogadoresService.consultarJogadorPeloId(idJogador)

    const jogadores = await this.jogadoresService.consultarTodosJogadores();

    const jogadorFilter = jogadores.filter(
      (jogador) => jogador._id == idJogador,
    );

    if (jogadorFilter.length == 0) {
      throw new BadRequestException(`O id ${idJogador} não é um jogador!`);
    }

    return await this.categoriaModel
      .findOne()
      .where('jogadores')
      .in(idJogador)
      .exec();
  }

  private async obterCategoriaPorId(_id: string): Promise<Categoria> {
    const valid = mongoose.Types.ObjectId.isValid(_id);
    if (!valid) {
      throw new NotFoundException(`Categoria com o id  ${_id} invalido!`);
    }
    return await this.categoriaModel
      .findOne({ _id })
      .populate('jogadores')
      .exec();
  }
}
