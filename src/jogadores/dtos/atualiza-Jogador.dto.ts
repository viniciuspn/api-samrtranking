import { IsNotEmpty } from 'class-validator';
export class AtualizaJogadorDto {
  @IsNotEmpty()
  readonly telefoneCelular: string;
  @IsNotEmpty()
  nome: string;
}
