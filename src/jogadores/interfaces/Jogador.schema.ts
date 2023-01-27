import mongoose from 'mongoose';

export const JogadorSchema = new mongoose.Schema(
  {
    telefoneCelular: { type: String },
    email: { type: String, unique: true },
    nome: String,
    ranking: String,
    posicaoRanking: String,
    urlFotoJogador: Number,
  },
  { timestamps: true, collection: 'jogadores' },
);
