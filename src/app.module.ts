import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';
import { CategoriasModule } from './categorias/categorias.module';
import 'dotenv/config';
const URI = process.env.MONGODB_URL;
@Module({
  imports: [MongooseModule.forRoot(URI), JogadoresModule, CategoriasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
