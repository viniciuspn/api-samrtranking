import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { get } from 'http';
import { CategoriasService } from './categorias.service';
import { CriaCategoriaDto } from './dtos/cria-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body() criaCategoriaDto: CriaCategoriaDto,
  ): Promise<Categoria> {
    return await this.categoriasService.criarCategoria(criaCategoriaDto);
  }

  @Get()
  async consultarCategorias(): Promise<Array<Categoria>> {
    return await this.categoriasService.consultarCategorias();
  }

  @Get('/:_id')
  async consultarCategoriasPeloId(
    @Param('_id') _id: string,
  ): Promise<Categoria> {
    return await this.categoriasService.consultarCategoriaPeloId(_id);
  }
}
