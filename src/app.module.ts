import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';
import 'dotenv/config';
const URI = process.env.MONGODB_URL;
@Module({
  imports: [MongooseModule.forRoot(URI), JogadoresModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
