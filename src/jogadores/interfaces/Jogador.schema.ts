import mongoose from 'mongoose';

export const JogadorSchema = new mongoose.Schema(
  {
    telefoneCelular: { type: String, unique: true },
    email: { type: String, unique: true },
    nome: String,
    ranking: String,
    posicaoRanking: String,
    urlFotoJogador: Number,
  },
  { timestamps: true, collection: 'jogadores' },
);
