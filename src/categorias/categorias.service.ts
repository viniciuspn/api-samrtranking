import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CriaCategoriaDto } from './dtos/cria-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
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
    return await this.categoriaModel.find().exec();
  }

  async consultarCategoriaPeloId(_id: string): Promise<Categoria> {
    const categoriaEncontrada = await this.obterCategoriaPorId(_id);
    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria com o id  ${_id} não encontrada!`);
    }
    return categoriaEncontrada;
  }

  private async obterCategoriaPorId(_id: string): Promise<Categoria> {
    const valid = mongoose.Types.ObjectId.isValid(_id);
    if (!valid) {
      throw new NotFoundException(`Categoria com o id  ${_id} invalido!`);
    }
    return await this.categoriaModel.findOne({ _id }).exec();
  }
}
