import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { Delete, Query, UsePipes } from '@nestjs/common/decorators';
import { CriarJogadorDto } from './dtos/criar-Jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarAtualizarJogador(@Body() criarJogadorDto: CriarJogadorDto) {
    await this.jogadoresService.criarAtualizarJogador(criarJogadorDto);
    return JSON.stringify({
      mensagem: 'Jogador Criado com sucesso',
    });
  }

  @Get()
  async consultarJogadores(
    @Query('email') email: string,
  ): Promise<Jogador[] | Jogador> {
    if (email) {
      return await this.jogadoresService.consultarJogadoresPeloEmail(email);
    } else {
      return await this.jogadoresService.consultarTodosJogadores();
    }
  }

  @Delete()
  async deletarJogador(@Query('email') email: string) {
    await this.jogadoresService.deletarJogador(email);
    return JSON.stringify({
      mensagem: 'Jogador deletado com sucesso',
    });
  }
}
