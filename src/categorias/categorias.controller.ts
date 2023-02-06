import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
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

  @Get('/categoria/:categoria')
  async consultarCategoriasPelaCategoria(
    @Param('categoria') categoria: string,
  ): Promise<Categoria> {
    return await this.categoriasService.consultarCategoriasPelaCategoria(
      categoria,
    );
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atulizarCategoria(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('_id') _id: string,
  ): Promise<void> {
    return await this.categoriasService.atulizarCategoria(
      _id,
      atualizarCategoriaDto,
    );
  }

  @Post('/:_id/jogadores/:idJogador')
  async atribuirCategoriaJogador(@Param() params: string[]): Promise<void> {
    return await this.categoriasService.atribuirCategoriaJogador(params);
  }
}
